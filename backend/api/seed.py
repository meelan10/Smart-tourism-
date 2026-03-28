"""
Run: python manage.py shell < api/seed.py
Seeds the database with all initial data from the frontend mockData.js
"""
import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tourtech_backend.settings")
django.setup()

from api.models import Category, Destination, Hotel, Guide, SafetyAlert, EmergencyContact

# Clear existing
Category.objects.all().delete()
Destination.objects.all().delete()
Hotel.objects.all().delete()
Guide.objects.all().delete()
SafetyAlert.objects.all().delete()
EmergencyContact.objects.all().delete()

# Categories
cats = {
    "Trekking":  Category.objects.create(name="Trekking",  slug="trekking",  icon="🥾"),
    "Cultural":  Category.objects.create(name="Cultural",  slug="cultural",  icon="🏛️"),
    "Wildlife":  Category.objects.create(name="Wildlife",  slug="wildlife",  icon="🐘"),
    "City":      Category.objects.create(name="City",      slug="city",      icon="🏙️"),
    "Adventure": Category.objects.create(name="Adventure", slug="adventure", icon="🏔️"),
    "Spiritual": Category.objects.create(name="Spiritual", slug="spiritual", icon="🕉️"),
}

# Destinations
d1 = Destination.objects.create(
    id=1, name="Everest Base Camp", slug="everest-base-camp", city="Solukhumbu", country="Nepal",
    category=cats["Trekking"], rating=4.9, entry_fee=0, currency="USD",
    best_time_to_visit="Mar–May, Sep–Nov",
    short_description="The ultimate trekking challenge at 5,364m — the foot of the world's highest peak.",
    description="Everest Base Camp trek is one of the most iconic adventures in the world. At 5,364m, the base camp offers breathtaking views of Everest, Lhotse, Nuptse and the Khumbu Icefall.",
    latitude=28.0026, longitude=86.8528,
    image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    altitude="5,364m", difficulty="Strenuous"
)
d2 = Destination.objects.create(
    id=2, name="Pokhara Lakeside", slug="pokhara-lakeside", city="Pokhara", country="Nepal",
    category=cats["City"], rating=4.8, entry_fee=0, currency="USD",
    best_time_to_visit="Oct–Dec, Feb–Apr",
    short_description="Nepal's adventure capital with stunning Annapurna views and the serene Phewa Lake.",
    description="Pokhara is Nepal's second-largest city and gateway to the Annapurna Circuit.",
    latitude=28.2096, longitude=83.9856,
    image="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    altitude="827m", difficulty="Easy"
)
d3 = Destination.objects.create(
    id=3, name="Chitwan National Park", slug="chitwan-national-park", city="Chitwan", country="Nepal",
    category=cats["Wildlife"], rating=4.7, entry_fee=25, currency="USD",
    best_time_to_visit="Oct–Mar",
    short_description="UNESCO World Heritage Site — home to rhinos, Bengal tigers and elephants.",
    description="Chitwan National Park is Nepal's first national park and a UNESCO World Heritage Site.",
    latitude=27.5291, longitude=84.3542,
    image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    altitude="100m", difficulty="Easy"
)
d4 = Destination.objects.create(
    id=4, name="Pashupatinath Temple", slug="pashupatinath-temple", city="Kathmandu", country="Nepal",
    category=cats["Cultural"], rating=4.6, entry_fee=10, currency="USD",
    best_time_to_visit="Year-round",
    short_description="One of the most sacred Hindu temples in the world, on the Bagmati River.",
    description="Pashupatinath Temple is a UNESCO World Heritage Site dedicated to Lord Shiva.",
    latitude=27.7105, longitude=85.3487,
    image="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80",
    altitude="1,300m", difficulty="Easy"
)
d5 = Destination.objects.create(
    id=5, name="Annapurna Circuit", slug="annapurna-circuit", city="Manang", country="Nepal",
    category=cats["Trekking"], rating=4.8, entry_fee=0, currency="USD",
    best_time_to_visit="Mar–May, Oct–Nov",
    short_description="A classic multi-week trek circumnavigating the spectacular Annapurna massif.",
    description="The Annapurna Circuit is considered one of the world's greatest treks.",
    latitude=28.7041, longitude=84.1229,
    image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    altitude="5,416m", difficulty="Challenging"
)
d6 = Destination.objects.create(
    id=6, name="Boudhanath Stupa", slug="boudhanath-stupa", city="Kathmandu", country="Nepal",
    category=cats["Cultural"], rating=4.7, entry_fee=5, currency="USD",
    best_time_to_visit="Year-round",
    short_description="One of the largest Buddhist stupas in the world — a UNESCO World Heritage Site.",
    description="Boudhanath Stupa is one of the largest stupas in the world and a UNESCO World Heritage Site.",
    latitude=27.7215, longitude=85.3620,
    image="https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80",
    altitude="1,400m", difficulty="Easy"
)

# Hotels
Hotel.objects.create(
    name="Hyatt Regency Kathmandu", slug="hyatt-regency-kathmandu", destination=d4,
    description="Luxury 5-star hotel set in beautifully landscaped gardens with mountain views.",
    rating=4.8, stars=5, price_per_night=280,
    has_wifi=True, has_pool=True, has_gym=True, has_restaurant=True, has_parking=True, has_spa=True,
    address="Taragaon, Boudha, Kathmandu", phone="+977-1-4491234", email="kathmandu@hyatt.com",
    latitude=27.7215, longitude=85.3620,
    image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
)
Hotel.objects.create(
    name="Temple Tree Resort & Spa", slug="temple-tree-resort", destination=d2,
    description="Boutique lakeside resort with stunning views of the Annapurna range and Phewa Lake.",
    rating=4.7, stars=4, price_per_night=145,
    has_wifi=True, has_pool=True, has_gym=False, has_restaurant=True, has_parking=True, has_spa=True,
    address="Lakeside, Pokhara", phone="+977-61-465888", email="info@templetree.com.np",
    latitude=28.2096, longitude=83.9556,
    image="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"
)
Hotel.objects.create(
    name="Barahi Jungle Lodge", slug="barahi-jungle-lodge", destination=d3,
    description="Eco-friendly jungle lodge inside Chitwan National Park.",
    rating=4.6, stars=4, price_per_night=120,
    has_wifi=True, has_pool=False, has_gym=False, has_restaurant=True, has_parking=False, has_spa=False,
    address="Sauraha, Chitwan", phone="+977-56-580001", email="info@barahijunglelodge.com",
    latitude=27.5333, longitude=84.3667,
    image="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"
)
Hotel.objects.create(
    name="Summit Hotel Kathmandu", slug="summit-hotel-kathmandu", destination=d4,
    description="Classic heritage hotel in the heart of Patan, offering authentic Newari architecture.",
    rating=4.4, stars=3, price_per_night=85,
    has_wifi=True, has_pool=False, has_gym=False, has_restaurant=True, has_parking=True, has_spa=False,
    address="Kupondole Heights, Patan", phone="+977-1-5521810", email="info@summithotel.com.np",
    latitude=27.6762, longitude=85.3172,
    image="https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80"
)

# Guides
g1 = Guide.objects.create(
    name="Pemba Sherpa", slug="pemba-sherpa", rating=4.9, years_experience=15, price_per_day=80,
    specialties="High altitude trekking, Everest region expert, mountaineering",
    languages="English, Nepali, Tibetan, Hindi", is_certified=True,
    bio="With 15 years of experience guiding treks in the Everest region, Pemba is one of Nepal's most respected guides.",
    phone="+977-9841234567", email="pemba@nepalguide.com",
    image="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80"
)
g1.destinations.set([d1, d5])

g2 = Guide.objects.create(
    name="Sita Gurung", slug="sita-gurung", rating=4.8, years_experience=10, price_per_day=65,
    specialties="Cultural tours, temple visits, food & cuisine tours",
    languages="English, Nepali, French, German", is_certified=True,
    bio="Sita specializes in cultural and heritage tours around Kathmandu Valley.",
    phone="+977-9851234567", email="sita@nepalguide.com",
    image="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80"
)
g2.destinations.set([d4, d6])

g3 = Guide.objects.create(
    name="Bikram Rai", slug="bikram-rai", rating=4.7, years_experience=8, price_per_day=60,
    specialties="Annapurna trekking, bird watching, nature photography",
    languages="English, Nepali, Spanish", is_certified=True,
    bio="Bikram is an expert trekking guide for the Annapurna region.",
    phone="+977-9861234567", email="bikram@nepalguide.com",
    image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"
)
g3.destinations.set([d2, d5])

g4 = Guide.objects.create(
    name="Maya Thapa", slug="maya-thapa", rating=4.6, years_experience=6, price_per_day=55,
    specialties="Wildlife safaris, jeep tours, elephant activities",
    languages="English, Nepali, Hindi", is_certified=True,
    bio="Maya is Chitwan's finest wildlife guide.",
    phone="+977-9871234567", email="maya@nepalguide.com",
    image="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80"
)
g4.destinations.set([d3])

# Safety Alerts
SafetyAlert.objects.create(
    title="Altitude Sickness Warning", level="high",
    description="Trekkers above 3,500m should acclimatize properly. AMS symptoms include headache, nausea and fatigue.",
    destination=d1
)
SafetyAlert.objects.create(
    title="Monsoon Season Flooding", level="medium",
    description="Heavy rainfall expected Jun-Sep. Some trails may be closed. Check conditions before trekking.",
    destination=d5
)
SafetyAlert.objects.create(
    title="Wildlife Safety in Chitwan", level="low",
    description="Always follow guide instructions near rhinos and crocodiles. Do not approach wildlife.",
    destination=d3
)

# Emergency Contacts
EmergencyContact.objects.bulk_create([
    EmergencyContact(name="Nepal Police",    service_type="police",         phone="100",           address="Naxal, Kathmandu",           available_24h=True),
    EmergencyContact(name="Ambulance",       service_type="ambulance",      phone="102",           address="Banshidhar, Kathmandu",       available_24h=True),
    EmergencyContact(name="Tourist Police",  service_type="tourist_police", phone="1144",          address="Bhrikutimandap, Kathmandu",   available_24h=True),
    EmergencyContact(name="Bir Hospital",    service_type="hospital",       phone="+977-1-4221119",address="Kantipath, Kathmandu",        available_24h=True),
    EmergencyContact(name="Fire Brigade",    service_type="fire",           phone="101",           address="Tripureshwor, Kathmandu",     available_24h=True),
])

print("✅ Database seeded successfully!")
print(f"   {Destination.objects.count()} destinations")
print(f"   {Hotel.objects.count()} hotels")
print(f"   {Guide.objects.count()} guides")
print(f"   {SafetyAlert.objects.count()} safety alerts")
print(f"   {EmergencyContact.objects.count()} emergency contacts")
