# NepalWander — React Frontend + Django Setup Guide

## 📁 PROJECT STRUCTURE

```
nepalwander/              ← React frontend (this project)
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── context/
    │   └── ThemeContext.js
    ├── data/
    │   └── mockData.js       ← Replace with API calls for Django backend
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── Cards.jsx
    │   └── PageLoader.jsx
    └── pages/
        ├── HomePage.jsx
        ├── DestinationsPage.jsx
        ├── DestinationDetailPage.jsx
        ├── HotelsPage.jsx
        ├── HotelDetailPage.jsx
        ├── GuidesPage.jsx
        ├── GuideDetailPage.jsx
        ├── SearchPage.jsx
        ├── SafetyPage.jsx
        ├── AboutPage.jsx
        ├── ContactPage.jsx
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        └── ProfilePage.jsx
```

---

## 🚀 RUNNING THE REACT FRONTEND (Standalone)

```bash
# 1. Navigate into project
cd nepalwander

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → Opens at http://localhost:3000

# 4. Build for production
npm run build
# → Outputs to /dist folder
```

---

## 🐍 DJANGO PROJECT — WHERE TO PUT YOUR FILES

### Assumed Django project structure:
```
your_django_project/
├── manage.py
├── config/                 ← project settings folder (may be named differently)
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── destinations/
│   ├── hotels/
│   ├── guides/
│   ├── transport/
│   └── safety/
├── templates/              ← PUT ALL HTML FILES HERE
│   ├── base.html
│   ├── home.html
│   ├── about.html
│   ├── contact.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── search.html
│   ├── search_old.html
│   ├── destinations/
│   │   ├── list.html
│   │   └── detail.html
│   ├── hotels/
│   │   ├── list.html
│   │   └── detail.html
│   └── guides/
│       ├── list.html
│       └── detail.html
└── static/                 ← PUT CSS AND JS HERE
    ├── css/
    │   └── style.css       ← PUT style.css HERE
    └── js/
        ├── main.js         ← PUT main.js HERE
        └── translations.js ← PUT translations.js HERE
```

---

## 📂 EXACT FILE PLACEMENT FOR DJANGO

### 1. Static Files → `/static/`

| Your file       | Place it at                        |
|-----------------|------------------------------------|
| `style.css`     | `static/css/style.css`             |
| `main.js`       | `static/js/main.js`                |
| `translations.js` | `static/js/translations.js`     |

### 2. HTML Templates → `/templates/`

| Your file           | Place it at                              |
|---------------------|------------------------------------------|
| `base.html`         | `templates/base.html`                    |
| `home.html`         | `templates/home.html`                    |
| `about.html`        | `templates/about.html`                   |
| `contact.html`      | `templates/contact.html`                 |
| `login.html`        | `templates/login.html`                   |
| `register.html`     | `templates/register.html`                |
| `profile.html`      | `templates/profile.html`                 |
| `search.html`       | `templates/search.html`                  |
| `search_old.html`   | `templates/search_old.html`              |
| `list.html` (destinations) | `templates/destinations/list.html` |
| `detail.html` (destinations) | `templates/destinations/detail.html` |
| `list.html` (hotels) | `templates/hotels/list.html`          |
| `detail.html` (hotels) | `templates/hotels/detail.html`      |
| `list.html` (guides) | `templates/guides/list.html`          |
| `detail.html` (guides) | `templates/guides/detail.html`      |

---

## ⚙️ DJANGO SETTINGS REQUIRED

### settings.py

```python
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ─── TEMPLATES ───────────────────────────────────────────────
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],   # ← point to your templates folder
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',  # ← required for {% trans %}
            ],
        },
    },
]

# ─── STATIC FILES ────────────────────────────────────────────
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']   # ← your static folder
STATIC_ROOT = BASE_DIR / 'staticfiles'     # ← for collectstatic

# ─── MEDIA FILES ─────────────────────────────────────────────
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ─── INSTALLED APPS ──────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Your apps:
    'apps.destinations',
    'apps.hotels',
    'apps.guides',
    'apps.transport',
    'apps.safety',
    # i18n:
    'django.contrib.humanize',
]

# ─── INTERNATIONALIZATION ────────────────────────────────────
LANGUAGE_CODE = 'en'
USE_I18N = True
USE_L10N = True
USE_TZ = True

from django.utils.translation import gettext_lazy as _
LANGUAGES = [
    ('en', _('English')),
    ('ne', _('Nepali')),
    ('hi', _('Hindi')),
    ('zh-hans', _('Chinese Simplified')),
    ('ar', _('Arabic')),
    ('fr', _('French')),
    ('de', _('German')),
    ('ja', _('Japanese')),
]

LOCALE_PATHS = [BASE_DIR / 'locale']

# ─── LOGIN / LOGOUT ──────────────────────────────────────────
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
```

---

## 🔗 DJANGO URLS (config/urls.py)

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('i18n/', include('django.conf.urls.i18n')),  # language switcher
]

urlpatterns += i18n_patterns(
    path('', include('apps.destinations.urls')),
    path('hotels/', include('apps.hotels.urls')),
    path('guides/', include('apps.guides.urls')),
    path('transport/', include('apps.transport.urls')),
    path('safety/', include('apps.safety.urls')),
    path('accounts/', include('django.contrib.auth.urls')),  # login/logout
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

---

## 🛠️ COMMON DJANGO ERRORS & FIXES

### Error: `TemplateDoesNotExist`
**Fix:** Make sure `DIRS` in `TEMPLATES` settings points to your `templates/` folder.
```python
'DIRS': [BASE_DIR / 'templates'],
```

### Error: `No module named 'img_tags'`
**Fix:** The templates use `{% load img_tags %}`. Create a custom template tag:
```python
# apps/destinations/templatetags/img_tags.py
from django import template
register = template.Library()

@register.filter
def img_src(obj):
    """Return the first image URL for a model object."""
    if hasattr(obj, 'image') and obj.image:
        return obj.image.url
    if hasattr(obj, 'images') and obj.images.exists():
        return obj.images.first().image.url
    return None
```

### Error: Static files not loading
**Fix:** Run `python manage.py collectstatic` and ensure:
```python
STATICFILES_DIRS = [BASE_DIR / 'static']
```

### Error: `{% url 'destination_list' %}` not found
**Fix:** Name your URL patterns to match:
```python
# apps/destinations/urls.py
from django.urls import path
from . import views

app_name = 'destinations'
urlpatterns = [
    path('', views.DestinationListView.as_view(), name='destination_list'),
    path('<slug:slug>/', views.DestinationDetailView.as_view(), name='destination_detail'),
]
```

### Error: `{% trans %}` not working
**Fix:** Add to INSTALLED_APPS and MIDDLEWARE:
```python
MIDDLEWARE = [
    ...
    'django.middleware.locale.LocaleMiddleware',  # ← add this
    ...
]
```
Then run: `python manage.py makemessages -l ne`

### Error: `set_language` URL not found
**Fix:** Add to urls.py:
```python
path('i18n/', include('django.conf.urls.i18n')),
```

---

## 🔄 CONNECTING REACT TO DJANGO (Full Stack)

To use React as the frontend with Django as the API backend:

### Option A: Django REST Framework + React (Recommended)
```bash
# Django side
pip install djangorestframework djangorestframework-simplejwt django-cors-headers

# Add to INSTALLED_APPS
'rest_framework',
'corsheaders',

# Add CORS middleware
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ...]
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

Then in React's `mockData.js`, replace static data with API calls:
```javascript
// Example: fetch destinations from Django API
const API_BASE = 'http://localhost:8000/api';

export async function fetchDestinations() {
  const res = await fetch(`${API_BASE}/destinations/`);
  return res.json();
}
```

### Option B: Serve React Build from Django
```bash
# Build React
cd nepalwander && npm run build

# Copy dist/ contents to Django's static folder
# Then serve index.html for the frontend route
```

---

## ✅ QUICK START CHECKLIST

**For Django project:**
- [ ] Copy `style.css` → `static/css/style.css`
- [ ] Copy `main.js` → `static/js/main.js`  
- [ ] Copy `translations.js` → `static/js/translations.js`
- [ ] Copy all HTML files to correct `templates/` subdirectories
- [ ] Create `img_tags` templatetag (see above)
- [ ] Update `settings.py` with TEMPLATES DIRS and STATICFILES_DIRS
- [ ] Add `LocaleMiddleware` to MIDDLEWARE
- [ ] Add `i18n/` URL pattern for language switching
- [ ] Run `python manage.py collectstatic`
- [ ] Run `python manage.py migrate`

**For React standalone:**
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Open http://localhost:3000
