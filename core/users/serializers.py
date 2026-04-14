import uuid
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import Group, Member, Expense, ExpenseSplit, GroupInvite, Settlement


# ================= AUTH =================


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        user = authenticate(username=user.username, password=data["password"])

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        return user


# ================= PROFILE =================


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = ["id"]

    def validate_email(self, value):
        user = self.instance

        # Prevent duplicate emails
        if User.objects.exclude(id=user.id).filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")

        return value


# ================= MEMBER =================


class MemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Member
        fields = ["id", "user", "group", "username"]
        read_only_fields = ["user"]


# ================= SPLIT =================


class ExpenseSplitSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.user.username", read_only=True)

    class Meta:
        model = ExpenseSplit
        fields = ["id", "member", "amount", "member_name"]


# ================= EXPENSE =================


class ExpenseSerializer(serializers.ModelSerializer):
    splits = ExpenseSplitSerializer(many=True)
    group_name = serializers.CharField(source="group.name", read_only=True)
    paid_by_name = serializers.CharField(source="paid_by.user.username", read_only=True)

    class Meta:
        model = Expense
        fields = [
            "id",
            "title",
            "amount",
            "paid_by",
            "group",
            "splits",
            "group_name",
            "paid_by_name",
            "created_at",
        ]

    def validate(self, data):
        splits = data.get("splits", [])
        group = data.get("group")
        paid_by = data.get("paid_by")
        amount = data.get("amount")

        # Payer must belong to group
        if paid_by.group != group:
            raise serializers.ValidationError("Payer must belong to the group")

        # Validate all members belong to group
        for split in splits:
            if split["member"].group != group:
                raise serializers.ValidationError(
                    "All members must belong to same group"
                )

        # Validate split sum
        total = sum([Decimal(str(split["amount"])) for split in splits])

        if total != amount:
            raise serializers.ValidationError("Split total must equal expense amount")

        return data

    @transaction.atomic
    def create(self, validated_data):
        splits_data = validated_data.pop("splits")

        expense = Expense.objects.create(**validated_data)

        ExpenseSplit.objects.bulk_create(
            [
                ExpenseSplit(
                    expense=expense, member=split["member"], amount=split["amount"]
                )
                for split in splits_data
            ]
        )

        return expense


# ================= GROUP =================


class GroupSerializer(serializers.ModelSerializer):
    members = MemberSerializer(many=True, read_only=True)
    total_expenses = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ["id", "name", "created_by", "members", "total_expenses", "created_at"]

    def get_total_expenses(self, obj):
        return sum([exp.amount for exp in obj.expenses.all()])


# ================= SETTLEMENT ================
class SettlementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settlement
        fields = ["id", "from_member", "to_member", "group", "amount"]

    def validate(self, data):
        if data["from_member"] == data["to_member"]:
            raise serializers.ValidationError("Cannot settle with yourself")

        if data["amount"] <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")

        # Ensure both members belong to same group
        if (
            data["from_member"].group != data["group"]
            or data["to_member"].group != data["group"]
        ):
            raise serializers.ValidationError("Members must belong to same group")

        return data


# ================= INVITE =================


class InviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupInvite
        fields = ["email", "group"]
        read_only_fields = ["token", "accepted"]

    def create(self, validated_data):
        validated_data["token"] = uuid.uuid4()

        validated_data["expires_at"] = timezone.now() + timedelta(days=3)

        return super().create(validated_data)
