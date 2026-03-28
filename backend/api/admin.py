from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import (
    Category, Destination, Hotel, Guide, Review,
    SafetyAlert, EmergencyContact, Favorite, TripPlan,
    WeatherCache, NewsletterSubscriber, BookingLog,
    Payment, Refund, VisitHistory
)

admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ["username", "email", "first_name", "last_name", "is_staff", "date_joined"]
    list_filter = ["is_staff", "is_superuser", "is_active"]
    search_fields = ["username", "email", "first_name", "last_name"]


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ["name", "city", "category", "rating", "entry_fee"]
    list_filter = ["category", "country", "difficulty"]
    search_fields = ["name", "city"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ["name", "destination", "stars", "price_per_night", "rating"]
    list_filter = ["stars"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    list_display = ["name", "rating", "years_experience", "price_per_day", "is_certified"]
    list_filter = ["is_certified"]
    search_fields = ["name", "specialties"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["user", "content_type", "rating", "created_at"]
    list_filter = ["content_type", "rating"]
    search_fields = ["user__username", "comment"]
    readonly_fields = ["created_at"]


@admin.register(BookingLog)
class BookingLogAdmin(admin.ModelAdmin):
    list_display = ["action", "status", "user", "email", "item_name", "amount", "currency", "payment_method", "ip_address", "created_at"]
    list_filter = ["action", "status", "payment_method", "created_at"]
    search_fields = ["user__username", "email", "item_name"]
    readonly_fields = ["action", "status", "user", "email", "item_name", "item_id", "amount", "currency", "payment_method", "extra_data", "ip_address", "created_at"]

    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["user", "method", "amount", "currency", "status", "transaction_id", "created_at"]
    list_filter = ["method", "status", "currency", "created_at"]
    search_fields = ["user__username", "transaction_id"]
    readonly_fields = ["transaction_id", "created_at"]


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ["user", "amount", "status", "created_at", "updated_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["user__username", "reason"]
    readonly_fields = ["user", "payment", "amount", "reason", "created_at"]
    fields = ["user", "payment", "amount", "reason", "status", "admin_note", "created_at"]


@admin.register(NewsletterSubscriber)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ["email", "subscribed_at", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["email"]


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ["user", "content_type", "destination", "hotel", "guide", "created_at"]
    list_filter = ["content_type"]
    search_fields = ["user__username"]


@admin.register(VisitHistory)
class VisitHistoryAdmin(admin.ModelAdmin):
    list_display = ["user", "content_type", "item_name", "visited_at"]
    list_filter = ["content_type"]
    search_fields = ["user__username", "item_name"]


admin.register(Category)(admin.ModelAdmin)
admin.register(SafetyAlert)(admin.ModelAdmin)
admin.register(EmergencyContact)(admin.ModelAdmin)
admin.register(TripPlan)(admin.ModelAdmin)
