from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView
from django.conf.urls.static import static
from django.conf import settings
from offers.routers import router as offers_router
from reviews.routers import router as reviews_router
from reservations.routers import router as reservations_router

urlpatterns = [
    path('api/v1/admin/', admin.site.urls),
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/auth/', include('users.urls')),
    path('api/v1/', include(offers_router.urls)),
    path('api/v1/', include(reviews_router.urls)),
    path('api/v1/', include(reservations_router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)