from django.db.models import Q, Sum
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import random, uuid

from .models import (
    Category, Destination, Hotel, Guide, Review,
    SafetyAlert, EmergencyContact, Favorite, TripPlan,
    NewsletterSubscriber, BookingLog, Payment, Refund, VisitHistory
)
from .serializers import (
    CategorySerializer, DestinationSerializer, HotelSerializer, GuideSerializer,
    ReviewSerializer, SafetyAlertSerializer, EmergencyContactSerializer,
    FavoriteSerializer, TripPlanSerializer, RegisterSerializer,
    UserSerializer, NewsletterSerializer, BookingLogSerializer,
    PaymentSerializer, RefundSerializer, VisitHistorySerializer
)


def get_ip(request):
    x = request.META.get("HTTP_X_FORWARDED_FOR")
    return x.split(",")[0] if x else request.META.get("REMOTE_ADDR")


# ================= AUTH =================

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    s = RegisterSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    user = s.save()
    refresh = RefreshToken.for_user(user)
    return Response({
        "user": UserSerializer(user).data,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }, status=201)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == "GET":
        return Response(UserSerializer(request.user).data)
    safe_fields = ["first_name", "last_name", "email"]
    data = {k: v for k, v in request.data.items() if k in safe_fields}
    s = UserSerializer(request.user, data=data, partial=True)
    s.is_valid(raise_exception=True)
    s.save()
    return Response(s.data)


# ================= DESTINATIONS =================

class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Destination.objects.select_related("category")
    serializer_class = DestinationSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.query_params
        if q.get("category"):
            qs = qs.filter(category__slug=q["category"])
        if q.get("country"):
            qs = qs.filter(country=q["country"])
        if q.get("search"):
            qs = qs.filter(Q(name__icontains=q["search"]) | Q(city__icontains=q["search"]))
        return qs.order_by(q.get("sort", "-rating"))

    @action(detail=True, methods=["get"])
    def reviews(self, request, slug=None):
        dest = self.get_object()
        return Response(ReviewSerializer(dest.reviews.select_related("user"), many=True).data)

    @action(detail=True, methods=["get"])
    def hotels(self, request, slug=None):
        dest = self.get_object()
        return Response(HotelSerializer(dest.hotels.all(), many=True).data)


# ================= HOTELS =================

class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Hotel.objects.select_related("destination")
    serializer_class = HotelSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.query_params
        if q.get("destination"):
            qs = qs.filter(destination__slug=q["destination"])
        if q.get("max_price"):
            qs = qs.filter(price_per_night__lte=q["max_price"])
        if q.get("search"):
            qs = qs.filter(Q(name__icontains=q["search"]))
        return qs.order_by(q.get("sort", "-rating"))


# ================= GUIDES =================

class GuideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Guide.objects.prefetch_related("destinations")
    serializer_class = GuideSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.query_params
        if q.get("language"):
            qs = qs.filter(languages__icontains=q["language"])
        if q.get("max_price"):
            qs = qs.filter(price_per_day__lte=q["max_price"])
        return qs.order_by(q.get("sort", "-rating"))


# ================= CATEGORIES =================

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# ================= SAFETY =================

class SafetyAlertViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SafetyAlert.objects.select_related("destination")
    serializer_class = SafetyAlertSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.query_params
        if q.get("destination"):
            qs = qs.filter(destination__slug=q["destination"])
        if q.get("level"):
            qs = qs.filter(level=q["level"])
        return qs.order_by("-created_at")


class EmergencyContactViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EmergencyContact.objects.all()
    serializer_class = EmergencyContactSerializer


# ================= REVIEWS =================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_review(request):
    s = ReviewSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    review = s.save(user=request.user)
    # Log to BookingLog
    BookingLog.objects.create(
        action="save_dest",
        user=request.user,
        email=request.user.email,
        item_name=request.data.get("comment", "")[:100],
        ip_address=get_ip(request),
        extra_data={"review_id": review.id, "rating": review.rating, "type": review.content_type},
    )
    return Response(s.data, status=201)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_review(request, pk):
    try:
        review = Review.objects.get(pk=pk, user=request.user)
    except Review.DoesNotExist:
        return Response(status=404)
    review.delete()
    return Response(status=204)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_reviews(request):
    reviews = Review.objects.filter(user=request.user).select_related("destination", "hotel", "guide")
    return Response(ReviewSerializer(reviews, many=True).data)


# ================= FAVORITES =================

@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def favorites(request):
    if request.method == "GET":
        favs = Favorite.objects.filter(user=request.user)
        return Response(FavoriteSerializer(favs, many=True).data)

    if request.method == "POST":
        s = FavoriteSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        fav = s.save(user=request.user)
        return Response(FavoriteSerializer(fav).data, status=201)

    ct = request.data.get("content_type")
    item_id = request.data.get("id")
    filter_data = {"user": request.user, "content_type": ct}
    if ct == "destination":
        filter_data["destination_id"] = item_id
    elif ct == "hotel":
        filter_data["hotel_id"] = item_id
    elif ct == "guide":
        filter_data["guide_id"] = item_id
    deleted, _ = Favorite.objects.filter(**filter_data).delete()
    if not deleted:
        return Response({"error": "Not found"}, status=404)
    return Response(status=204)


# ================= VISIT HISTORY =================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def visit_history(request):
    if request.method == "GET":
        history = VisitHistory.objects.filter(user=request.user).select_related("destination", "hotel", "guide")[:100]
        return Response(VisitHistorySerializer(history, many=True).data)

    s = VisitHistorySerializer(data=request.data)
    s.is_valid(raise_exception=True)
    s.save(user=request.user)
    return Response(s.data, status=201)


# ================= PAYMENTS =================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def payments(request):
    if request.method == "GET":
        pays = Payment.objects.filter(user=request.user)
        return Response(PaymentSerializer(pays, many=True).data)

    data = request.data
    method = data.get("method")
    amount = float(data.get("amount", 0))
    item_name = data.get("item_name", "")
    action_type = data.get("action", "book_hotel")
    item_id = data.get("item_id")
    extra = data.get("extra_data", {})
    if not isinstance(extra, dict):
        extra = {}

    # Create booking log
    booking = BookingLog.objects.create(
        action=action_type,
        status="confirmed",
        user=request.user,
        email=request.user.email,
        item_name=item_name,
        item_id=item_id,
        amount=amount,
        currency=data.get("currency", "USD"),
        payment_method=method,
        ip_address=get_ip(request),
        extra_data=extra,
    )

    # Create payment record
    payment = Payment.objects.create(
        user=request.user,
        booking=booking,
        method=method,
        amount=amount,
        currency=data.get("currency", "USD"),
        status="completed",
        transaction_id=str(uuid.uuid4())[:16].upper(),
    )

    return Response(PaymentSerializer(payment).data, status=201)


# ================= REFUNDS =================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def refunds(request):
    if request.method == "GET":
        user_refunds = Refund.objects.filter(user=request.user)
        return Response(RefundSerializer(user_refunds, many=True).data)

    payment_id = request.data.get("payment_id")
    reason = request.data.get("reason", "")

    try:
        payment = Payment.objects.get(id=payment_id, user=request.user)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=404)

    # Allow refund only within 7 days
    refund_window = timezone.now() - timedelta(days=7)
    if payment.created_at < refund_window:
        return Response({"error": "Refund window of 7 days has passed"}, status=400)

    if payment.status == "refunded":
        return Response({"error": "Already refunded"}, status=400)

    refund = Refund.objects.create(
        payment=payment,
        user=request.user,
        reason=reason,
        amount=payment.amount,
        status="requested",
    )
    return Response(RefundSerializer(refund).data, status=201)


# ================= TRIP =================

class TripPlanViewSet(viewsets.ModelViewSet):
    serializer_class = TripPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TripPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ================= SEARCH =================

@api_view(["GET"])
@permission_classes([AllowAny])
def search(request):
    q = request.query_params.get("q", "").strip()
    if not q:
        return Response({"destinations": [], "hotels": [], "guides": []})
    return Response({
        "destinations": DestinationSerializer(Destination.objects.filter(Q(name__icontains=q))[:10], many=True).data,
        "hotels": HotelSerializer(Hotel.objects.filter(Q(name__icontains=q))[:10], many=True).data,
        "guides": GuideSerializer(Guide.objects.filter(Q(name__icontains=q))[:10], many=True).data,
    })


# ================= WEATHER =================

@api_view(["GET"])
@permission_classes([AllowAny])
def weather(request):
    return Response({"temp": random.randint(10, 30), "condition": "Sunny"})


# ================= COST =================

@api_view(["POST"])
@permission_classes([AllowAny])
def estimate_trip_cost(request):
    try:
        days = int(request.data.get("days", 7))
    except Exception:
        return Response({"error": "Invalid days"}, status=400)
    return Response({"total": days * 100})


# ================= NEWSLETTER =================

@api_view(["POST"])
@permission_classes([AllowAny])
def newsletter_subscribe(request):
    s = NewsletterSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    subscriber = s.save()
    BookingLog.objects.create(
        action="subscribe",
        email=subscriber.email,
        item_name="Newsletter",
        ip_address=get_ip(request),
    )
    return Response({"subscribed": True})


# ================= CONTACT =================

@api_view(["POST"])
@permission_classes([AllowAny])
def contact(request):
    BookingLog.objects.create(
        action="contact",
        email=request.data.get("email", ""),
        item_name=request.data.get("subject", "Contact Form"),
        ip_address=get_ip(request),
        extra_data={"name": request.data.get("name", ""), "message": request.data.get("message", "")},
    )
    return Response({"sent": True})


# ================= STATS =================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def stats(request):
    base = {
        "destinations": Destination.objects.count(),
        "hotels": Hotel.objects.count(),
        "guides": Guide.objects.count(),
    }
    if request.user.is_staff or request.user.is_superuser:
        from django.contrib.auth.models import User as DjangoUser
        total_revenue = Payment.objects.filter(status="completed").aggregate(t=Sum("amount"))["t"] or 0
        base.update({
            "users": DjangoUser.objects.count(),
            "bookings": BookingLog.objects.count(),
            "reviews": Review.objects.count(),
            "newsletter_subscribers": NewsletterSubscriber.objects.filter(is_active=True).count(),
            "favorites": Favorite.objects.count(),
            "total_revenue": round(total_revenue, 2),
            "pending_refunds": Refund.objects.filter(status="requested").count(),
        })
    return Response(base)


# ================= ADMIN USER ACTIVITY =================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_activity(request):
    """Full activity for a specific user or all users — admin only."""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(status=403)

    from django.contrib.auth.models import User as DjangoUser
    uid = request.query_params.get("user_id")

    if uid:
        try:
            target = DjangoUser.objects.get(pk=uid)
        except DjangoUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        return Response({
            "user": UserSerializer(target).data,
            "bookings": BookingLogSerializer(
                BookingLog.objects.filter(user=target).order_by("-created_at"), many=True
            ).data,
            "payments": PaymentSerializer(
                Payment.objects.filter(user=target).order_by("-created_at"), many=True
            ).data,
            "reviews": ReviewSerializer(
                Review.objects.filter(user=target).select_related("destination","hotel","guide"), many=True
            ).data,
            "favorites": FavoriteSerializer(
                Favorite.objects.filter(user=target), many=True
            ).data,
            "visit_history": VisitHistorySerializer(
                VisitHistory.objects.filter(user=target).select_related("destination","hotel","guide"), many=True
            ).data,
            "refunds": RefundSerializer(
                Refund.objects.filter(user=target), many=True
            ).data,
        })

    # All users summary
    users = DjangoUser.objects.all().order_by("-date_joined")
    result = []
    for u in users:
        result.append({
            "user": UserSerializer(u).data,
            "booking_count": BookingLog.objects.filter(user=u).count(),
            "payment_total": Payment.objects.filter(user=u, status="completed").aggregate(t=Sum("amount"))["t"] or 0,
            "review_count": Review.objects.filter(user=u).count(),
            "favorite_count": Favorite.objects.filter(user=u).count(),
            "visit_count": VisitHistory.objects.filter(user=u).count(),
            "last_active": BookingLog.objects.filter(user=u).values_list("created_at", flat=True).first(),
        })
    return Response(result)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def booking_logs(request):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(status=403)
    logs = BookingLog.objects.select_related("user").all()
    return Response(BookingLogSerializer(logs, many=True).data)


# ================= ADMIN PAYMENTS =================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def all_payments(request):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(status=403)
    pays = Payment.objects.select_related("user", "booking").all()
    return Response(PaymentSerializer(pays, many=True).data)


# ================= ADMIN REFUNDS =================

@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_refunds(request, pk=None):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(status=403)

    if request.method == "GET":
        all_refunds = Refund.objects.select_related("user", "payment").all()
        return Response(RefundSerializer(all_refunds, many=True).data)

    # PATCH — approve/reject
    try:
        refund = Refund.objects.get(pk=pk)
    except Refund.DoesNotExist:
        return Response(status=404)

    new_status = request.data.get("status")
    admin_note = request.data.get("admin_note", "")
    if new_status in ["approved", "rejected", "processed"]:
        refund.status = new_status
        refund.admin_note = admin_note
        refund.save()
        if new_status == "processed":
            refund.payment.status = "refunded"
            refund.payment.save()
            if refund.payment.booking:
                refund.payment.booking.status = "refunded"
                refund.payment.booking.save()
    return Response(RefundSerializer(refund).data)
