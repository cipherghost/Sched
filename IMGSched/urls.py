# dappx/urls.py
from django.conf.urls import url
from django.urls import path, include
from IMGSched import views
from rest_framework import routers
from IMGSched.views import MeetingViewSet, CommentViewSet, UserViewSet
from rest_framework import renderers

meeting_list = MeetingViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
meeting_detail = MeetingViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

comment_list = CommentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
comment_detail = CommentViewSet.as_view({
    'get': 'retrieve',
})

user_list = UserViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
user_detail = UserViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
})

app_name = 'IMGSched'
router = routers.DefaultRouter()
router.register(r'meetings', views.MeetingViewSet, base_name='meeting')
router.register(r'comments', views.CommentViewSet, base_name='comment')
router.register(r'users', views.UserViewSet, base_name='user')

# Be careful setting the name to just /login use userlogin instead!
urlpatterns=[
 	path('', include(router.urls)),
]