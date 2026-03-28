@echo off
echo ========================================
echo   Tour Tech - Starting Both Servers
echo ========================================

echo.
echo [1/3] Setting up backend...
cd /d "%~dp0tourtech_backend"
pip install djangorestframework django-cors-headers djangorestframework-simplejwt --quiet
python manage.py migrate --run-syncdb 2>nul
python manage.py migrate 2>nul

echo.
echo [2/3] Starting Django backend on http://localhost:8000 ...
start "Tour Tech Backend" cmd /k "cd /d "%~dp0tourtech_backend" && python manage.py runserver 8000"

echo.
echo [3/3] Starting React frontend on http://localhost:5173 ...
cd /d "%~dp0nepalwander"
start "Tour Tech Frontend" cmd /k "cd /d "%~dp0nepalwander" && npm run dev"

echo.
echo ========================================
echo   Both servers starting...
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000/api/
echo   Admin:    http://localhost:8000/admin/
echo ========================================
timeout /t 3
