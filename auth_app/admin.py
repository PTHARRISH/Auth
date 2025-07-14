# auth_app/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Fields shown in user list in admin
    list_display = ("username", "email", "phone", "is_staff", "is_active")

    # Fields searchable in admin
    search_fields = ("username", "email", "phone")

    # Filter options in the right sidebar
    list_filter = ("is_staff", "is_active", "groups")

    # Order of fields in the detail (edit) page
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email", "phone")}),
        (_("Permissions"), {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    # Fields to show when creating a user via admin
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "phone", "password1", "password2"),
            },
        ),
    )
