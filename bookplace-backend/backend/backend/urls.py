"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView
from django.conf.urls.static import static
from django.conf import settings

from users import urls as users_urls
from users.routers import router as users_router

from offers import urls as offers_urls
from offers.routers import router as offers_router

from reviews.routers import router as reviews_router

from reservations.routers import router as reservations_router



urlpatterns = [
    path('api/v1/admin/', admin.site.urls),
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/', include(users_router.urls)),
    path('api/v1/', include(offers_router.urls)),
    path('api/v1/', include(reviews_router.urls)),
    path('api/v1/', include(reservations_router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)