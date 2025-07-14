from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)


class ImageUpload(models.Model):
    image = models.ImageField(upload_to="uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    image_hash = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return f"Image {self.id} ({self.image.name})"


