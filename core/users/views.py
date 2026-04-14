import os
import threading
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from collections import defaultdict
from rest_framework.exceptions import PermissionDenied
from decimal import Decimal
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.timezone import localtime
from .utils import optimize_debts
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from .models import Group, Expense, Member, GroupInvite, Settlement
from .serializers import (
    GroupSerializer,
    MemberSerializer,
    ExpenseSerializer,
    LoginSerializer,
    RegisterSerializer,
    InviteSerializer,
    SettlementSerializer,
)


# ================= AUTH =================


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "user": serializer.data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            )
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            )

        return Response(serializer.errors, status=400)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            }
        )


# ================= GROUP =================


class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer

    def get_queryset(self):
        return Group.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    # BALANCE
    @action(detail=True, methods=["get"])
    def balances(self, request, pk=None):
        group = self.get_object()
        optimize = request.query_params.get("optimize") == "true"

        balances = defaultdict(Decimal)

        # EXPENSES
        for expense in group.expenses.all():
            payer = expense.paid_by

            for split in expense.splits.all():
                member = split.member

                if member == payer:
                    continue

                balances[(member.id, payer.id)] += split.amount

        # SETTLEMENTS
        for s in group.settlements.all():
            balances[(s.from_member.id, s.to_member.id)] -= s.amount

        result = []

        if optimize:
            optimized = optimize_debts(balances)

            for from_id, to_id, amount in optimized:
                if amount <= 0:
                    continue

                from_member = Member.objects.get(id=from_id)
                to_member = Member.objects.get(id=to_id)

                result.append(
                    {
                        "from_id": from_id,
                        "to_id": to_id,
                        "from": from_member.user.username,
                        "to": to_member.user.username,
                        "amount": float(round(amount, 2)),
                        "optimized": True,
                    }
                )

        else:
            for (from_id, to_id), amount in balances.items():
                if amount <= 0:
                    continue

                from_member = Member.objects.get(id=from_id)
                to_member = Member.objects.get(id=to_id)

                result.append(
                    {
                        "from_id": from_id,
                        "to_id": to_id,
                        "from": from_member.user.username,
                        "to": to_member.user.username,
                        "amount": float(round(amount, 2)),
                        "optimized": False,
                    }
                )

        return Response(result)


# ================= MEMBER =================


class MemberViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MemberSerializer

    def get_queryset(self):
        return Member.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ================= EXPENSE =================


class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(group__members__user=self.request.user)


# ================= INVITE =================


def send_email_async(to_email, subject, html_content):
    try:
        print("Sending email...")

        message = Mail(
            from_email="noreply@sendgrid.net",
            to_emails=to_email,
            subject=subject,
            html_content=html_content,
        )

        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        sg.send(message)

        print("Email sent successfully")

    except Exception as e:
        print("Email failed:", e)


class SendInviteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = InviteSerializer(data=request.data)

        if serializer.is_valid():
            invite = serializer.save(invited_by=request.user)

            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
            link = f"{frontend_url}/join/{invite.token}"

            context = {
                "invite_link": link,
                "group_name": invite.group.name,
                "inviter_name": request.user.username,
                "expiry_date": localtime(invite.expires_at).strftime("%d %b %Y"),
            }

            html_content = render_to_string("emails/invite.html", context)

            subject = f"Join {invite.group.name} on SpendWise 🎉"

            send_email_async(invite.email, subject, html_content)

            return Response({"message": "Invite sent!", "token": str(invite.token)})

        return Response(serializer.errors, status=400)


class AcceptInviteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token):
        try:
            invite = GroupInvite.objects.get(token=token, accepted=False)
        except GroupInvite.DoesNotExist:
            return Response({"error": "Invalid invite"}, status=400)

        Member.objects.create(user=request.user, group=invite.group)

        invite.accepted = True
        invite.save()

        return Response({"message": "Joined successfully"})


# ================= SETTLEMENT =================
class SettlementViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SettlementSerializer

    def get_queryset(self):
        return Settlement.objects.filter(group__members__user=self.request.user)

    def perform_create(self, serializer):
        group = serializer.validated_data["group"]

        # Ensure user is part of group
        if not Member.objects.filter(user=self.request.user, group=group).exists():
            raise PermissionDenied("Not part of this group")

        serializer.save()


# ================= DASHBOARD =================


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        groups = Group.objects.filter(members__user=user).distinct()
        expenses = Expense.objects.filter(group__in=groups)

        return Response(
            {
                "total_spent": sum(e.amount for e in expenses),
                "total_groups": groups.count(),
                "total_expenses": expenses.count(),
                "recent_expenses": ExpenseSerializer(
                    expenses.order_by("-created_at")[:5], many=True
                ).data,
            }
        )
