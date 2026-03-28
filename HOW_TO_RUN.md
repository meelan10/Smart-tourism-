# NepalWander — How to Run

## Frontend (React + Vite)

Open **Windows Command Prompt** or **PowerShell** (NOT WSL), then:

```cmd
cd C:\Users\Lenovo\OneDrive\画像\nepalwander-v3-clay\nepalwander
npm install
npm run dev
```

Then open: **http://localhost:3000**

## Backend (Django)

Open a second terminal:

```cmd
cd C:\Users\Lenovo\OneDrive\画像\nepalwander-v3-clay\tourtech_backend
..\backend_env\Scripts\activate
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py runserver
```

## Troubleshooting

- If `npm` not found: Install Node.js from https://nodejs.org (LTS version)
- If port 3000 is busy: Edit `nepalwander/vite.config.js` and change port to 3001
- The frontend works standalone without the backend (uses mock data)
