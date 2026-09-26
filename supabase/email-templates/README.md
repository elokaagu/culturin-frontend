# Supabase auth email templates

Culturin-styled versions of the emails Supabase sends (sign-up confirmation, password reset, email change).
Supabase stores these in the dashboard, not in this repo, so paste them in by hand:

1. Supabase dashboard → Authentication → Emails → Templates.
2. For each template, set the subject and paste the HTML file's contents into the body.

| Template | Subject | File |
|---|---|---|
| Confirm signup | Confirm your Culturin account | `confirm-signup.html` |
| Reset password | Reset your Culturin password | `reset-password.html` |
| Change email address | Confirm your new email | `change-email.html` |

To send them from `hello@culturin.com` instead of Supabase's shared sender (which is heavily rate-limited),
set up custom SMTP under Authentication → Emails → SMTP settings with Resend:
host `smtp.resend.com`, port `465`, username `resend`, password = the Resend API key,
sender `hello@culturin.com`, sender name `Culturin`.
