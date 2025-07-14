import re

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import ImageUpload

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "phone", "password", "confirm_password"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if len(data["username"]) > 75:
            raise serializers.ValidationError(
                {"username": "Username too long. Max 75 characters."}
            )
        if len(data["email"]) > 75:
            raise serializers.ValidationError(
                {"email": "Email too long. Max 75 characters."}
            )
        if len(data["password"]) > 75:
            raise serializers.ValidationError(
                {"password": "Password too long. Max 75 characters."}
            )

        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError({"username": "Username already exists."})
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        if User.objects.filter(phone=data["phone"]).exists():
            raise serializers.ValidationError({"phone": "Phone number already exists."})

        if not re.match(r"^\+?\d{10,15}$", data["phone"]):
            raise serializers.ValidationError(
                {
                    "phone": "Enter a valid phone number (10–15 digits, with optional '+')."
                }
            )

        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        if not re.match(r"^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$", data["password"]):
            raise serializers.ValidationError(
                {"password": "Password must include a letter, number, and symbol."}
            )

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageUpload
        fields = ["id", "image", "uploaded_at"]
