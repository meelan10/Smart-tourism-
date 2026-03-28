from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root(request):
    return JsonResponse({"status": "ok", "message": "NepalWander API", "docs": "/api/"})

urlpatterns = [
    path("", root),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
]
