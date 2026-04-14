import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


# ================= GROUP =================
class Group(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ================= MEMBER =================
class Member(models.Model):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("member", "Member"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="members")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="member")

    class Meta:
        unique_together = ("user", "group")

    def __str__(self):
        return f"{self.user.username} ({self.group.name})"


# ================= EXPENSE =================
class Expense(models.Model):
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_by = models.ForeignKey(Member, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="expenses")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# ================= SPLIT =================
class ExpenseSplit(models.Model):
    expense = models.ForeignKey(
        Expense, on_delete=models.CASCADE, related_name="splits"
    )
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)


# ================= SETTLEMENT =================
class Settlement(models.Model):
    from_member = models.ForeignKey(
        Member, related_name="settlements_from", on_delete=models.CASCADE
    )
    to_member = models.ForeignKey(
        Member, related_name="settlements_to", on_delete=models.CASCADE
    )
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="settlements"  # FIXED
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.from_member == self.to_member:
            raise ValueError("Cannot settle with yourself")

    def __str__(self):
        return f"{self.from_member} → {self.to_member} ({self.amount})"


def default_expiry():
    return timezone.now() + timedelta(days=3)


# ================= INVITE =================
class GroupInvite(models.Model):
    email = models.EmailField()
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="invites")
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE)

    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    accepted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    # AUTO EXPIRY
    expires_at = models.DateTimeField(default=default_expiry)

    def __str__(self):
        return f"Invite to {self.email} for {self.group.name}"
