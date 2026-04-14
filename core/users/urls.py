from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    GroupViewSet,
    MemberViewSet,
    ExpenseViewSet,
    RegisterView,
    LoginView,
    SendInviteView,
    AcceptInviteView,
    ProfileView,
    DashboardView,
)

router = DefaultRouter()

router.register(r"groups", GroupViewSet, basename="group")
router.register(r"members", MemberViewSet, basename="member")
router.register(r"expenses", ExpenseViewSet, basename="expense")

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", LoginView.as_view()),
    path("auth/profile/", ProfileView.as_view()),
    path("dashboard/", DashboardView.as_view()),
    path("invite/", SendInviteView.as_view()),
    path("invite/accept/<str:token>/", AcceptInviteView.as_view()),
    path("", include(router.urls)),
]
