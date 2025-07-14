from django.urls import path

from .views import (
    GoogleLoginCallback,
    ImageUploadView,
    LoginView,
    SendOTPView,
    SignupView,
    WhatsAppOTPLoginView,
)

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("send-otp/", SendOTPView.as_view(), name="send-otp"),
    path("otp-login/", WhatsAppOTPLoginView.as_view(), name="otp-login"),
    path("upload-image/", ImageUploadView.as_view(), name="upload-image"),
    path("google-login/", GoogleLoginCallback.as_view(), name="google-login"),
]
