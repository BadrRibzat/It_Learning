import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
import zxcvbn

class ComplexPasswordValidator:
    def validate(self, password, user=None):
        if len(password) < 8:
            raise ValidationError(
                _("Password must be at least 8 characters long."),
                code='password_too_short',
            )

        if not (
            re.search(r'[A-Z]', password) and
            re.search(r'[a-z]', password) and
            re.search(r'\d', password) and
            re.search(r'[!@#$%^&*(),.?":{}|<>]', password)
        ):
            raise ValidationError(
                _("Password must contain uppercase, lowercase, number, and special character."),
                code='password_complexity'
            )

        common_passwords = [
            'password', '123456', 'qwerty', 'admin',
            'letmein', 'welcome', 'monkey', 'password1'
        ]
        if (
            password.lower() in common_passwords or
            (user and (
                password.lower() in user.username.lower() or
                password.lower() in user.email.lower()
            ))
        ):
            raise ValidationError(
                _("This password is too common or relates to your personal information."),
                code='password_too_common'
            )

    def get_help_text(self):
        return _(
            "Your password must be at least 12 characters long, include uppercase and lowercase letters, "
            "numbers, and special characters. Avoid common passwords and personal information."
        )