import random

import imagehash
from allauth.socialaccount.helpers import complete_social_login
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework import status

from django.core.cache import cache
from PIL import Image
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client

from .models import ImageUpload
from .serializers import ImageUploadSerializer, SignupSerializer

User = get_user_model()


class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid email or password."}, status=400)

        user = authenticate(username=user.username, password=password)
        if not user:
            return Response({"error": "Invalid email or password."}, status=400)

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
            }
        )


class SendOTPView(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        print(phone)
        if not phone:
            return Response({"error": "Phone number is required."}, status=400)

        otp = random.randint(100000, 999999)
        cache.set(f"otp:{phone}", str(otp), timeout=300)  # store for 5 minutes

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message = f"Your OTP for login is {otp}"
        print(message)
        try:
            client.messages.create(
                body=message,
                from_=settings.TWILIO_WHATSAPP_FROM,
                to=f"whatsapp:{'+91' + phone}",
            )
        except TwilioRestException as e:
            print("Twilio error:", e)
            return Response({"error": str(e)}, status=500)

        return Response({"message": "OTP sent successfully via WhatsApp"})


class WhatsAppOTPLoginView(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        otp = request.data.get("otp")

        if not phone or not otp:
            return Response({"error": "Phone and OTP are required."}, status=400)

        cached_otp = cache.get(f"otp:{phone}")
        if cached_otp != otp:
            return Response({"error": "Invalid OTP."}, status=400)

        try:
            user = User.objects.get(
                phone=phone
            )  
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        refresh = RefreshToken.for_user(user)
        print(user.username)
        return Response(
            {
                "message": "Login successful via WhatsApp OTP 🎉",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
            }
        )


class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        images = ImageUpload.objects.all().order_by("-uploaded_at")
        serializer = ImageUploadSerializer(images, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("image")
        if not file_obj:
            return Response({"error": "No image provided."}, status=400)
        try:
            image = Image.open(file_obj)
            image_hash = str(imagehash.average_hash(image))
        except Exception:
            return Response({"error": "Invalid image file."}, status=400)
        if ImageUpload.objects.filter(image_hash=image_hash).exists():
            return Response({"message": "Image already exists."}, status=200)
        file_obj.seek(0) 
        upload = ImageUpload.objects.create(image=file_obj, image_hash=image_hash)

        serializer = ImageUploadSerializer(upload)
        return Response(serializer.data, status=201)




class GoogleLoginCallback(APIView):
    def post(self, request):
        token = request.data.get("access_token")
        if not token:
            return Response({"error": "Access token is required."}, status=400)

        try:
            # Verify token with Google
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())

            email = idinfo.get("email")
            username = idinfo.get("name") or email.split("@")[0]
            if not email:
                return Response({"error": "Email not provided by Google"}, status=400)

            # Get or create user
            user, created = User.objects.get_or_create(email=email, defaults={"username": username})
            
            if not user.is_active:
                return Response({"error": "User is inactive"}, status=403)

            # Create JWT
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username
            })

        except ValueError:
            return Response({"error": "Invalid Google token"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
