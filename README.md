# 📸 Django Auth System with Image Detection + React Frontend

A full-stack authentication system built with:

- ✅ **Python 3.12.3**
- ✅ **Django 5 + DRF + Simple JWT**
- ✅ **React (Vite)** frontend
- ✅ **Three Login Options**:
  - 🔑 Password-based login
  - 📲 WhatsApp OTP login (via Twilio API)
  - 🌐 Google OAuth login
- ✅ **Image Upload with Duplicate Detection**
  - Detects visually identical images (even with different filenames)
  - Uses `imagehash` + `Pillow` for perceptual hashing

---

## 📂 Project Structure
```
├── backend/
│ ├── auth_project/
│ ├── auth_app/
│ ├── db.sqlite3
│ └── .env
├── frontend/
│ ├── vite.config.js
│ ├── src/
│ └── .env
├── README.md
├── .gitignore
└── requirements.txt

```

---

## 🚀 Features

### 🔐 Authentication

- Email/Password Login – `/login/`
- Google OAuth Login – `/google-login/` using [`@react-oauth/google`](https://www.npmjs.com/package/@react-oauth/google)
- WhatsApp OTP Login – `/sendotp/` and `/otp-login/` (via Twilio)
- JWT stored securely in `localStorage`
- Post-login redirect to `/dashboard`

---

### 🖼️ Image Upload with Duplicate Detection

- Upload images via a React dashboard
- On upload, backend uses perceptual hashing:

  ```python
  import imagehash
  str(imagehash.average_hash(image))
  ```
If hash already exists:
```

{
  "message": "Image already exists."
}

```
Display all uploaded images in a table with:

Filename

Upload timestamp

Download link

### 🛠️ Tech Stack
## 🔧 Backend
Django 5.2

Django REST Framework

djangorestframework-simplejwt

django-allauth + dj-rest-auth

twilio for WhatsApp OTP

imagehash + Pillow for duplicate detection

## ⚛️ Frontend
Vite + React

Tailwind CSS

@react-oauth/google

react-router-dom, react-toastify

Protected dashboard with file upload, detection & download

### ✅ Setup Instructions
## 📦 Backend Setup
```
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
Create .env in backend/
```
```
SECRET_KEY=your_secret_key
DEBUG=True
```
# Google OAuth
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
# Twilio (WhatsApp)
```
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```
```
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
### 💻 Frontend Setup
```
cd frontend
npm install
Create .env in frontend/
```
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
```
npm run dev
```
### 🔐 API Endpoints Summary

| Type           | Endpoint(s)                | Description                        |
|----------------|----------------------------|------------------------------------|
| Password Login | `/login/`                  | Login with email & password        |
| Google OAuth   | `/google-login/`           | Login using Google ID token        |
| WhatsApp OTP   | `/sendotp/`, `/otp-login/` | Login via WhatsApp OTP using Twilio |
| Image Upload   | `/upload-image/`           | Upload and detect duplicate images |

# 📦 Python Requirements
See requirements.txt for full list of dependencies.

Notable packages:

Django, djangorestframework, django-allauth, dj-rest-auth

djangorestframework-simplejwt

twilio, imagehash, Pillow, google-auth

# 🧠 Notes
Uses perceptual hashing (aHash) for content-based image detection

React frontend uses Tailwind for responsive UI

All login methods redirect to a unified dashboard

# 🛡️ Security Best Practices
Use DEBUG=False in production

Swap SQLite for PostgreSQL in production

Secure all .env secrets via environment config

Set up proper CORS and CSRF protection

Add rate limiting & OTP expiry on login endpoints
