from django.contrib import admin
from .models import Group, Member, Expense, ExpenseSplit


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_by")


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("id", "get_username", "group")

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = "User"


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "amount", "paid_by", "group", "created_at")


@admin.register(ExpenseSplit)
class ExpenseSplitAdmin(admin.ModelAdmin):
    list_display = ("id", "expense", "member", "amount")
