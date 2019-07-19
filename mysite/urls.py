from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from IMGSched import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    url(r'^api/',include('IMGSched.urls')),
]