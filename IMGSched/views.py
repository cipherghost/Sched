# IMGSched/views.py
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework import permissions, generics, viewsets

from IMGSched.serializers import UserSerializer, CommentSerializer, MeetingSerializer
from IMGSched.models import Meeting, Comment
from rest_framework.permissions import IsAuthenticated, AllowAny

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = (IsAuthenticated, )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        serializer.save(created_on=timezone.now())    

    @action(detail=True, methods=['get'])
    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user.username
        query_set = queryset.filter(participants__username=user)
        return query_set

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        # serializer.save(user=self.request.user)  
        serializer.save(time=timezone.now())

    # def retrieve(self, request, pk=None) :
    #     quesryset = Comment.objects.filter(meeting_id = pk)
    #     serializer = CommentSerializer(queryset, many = True)
    #     return Response(serializer.data)

class UserViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )

    @action(detail=True)
    def meetings(self, request, pk=None):
        queryset = User.objects.get(pk=pk).meetings.all()
        serializer = MeetingSerializer(queryset, many=True)
        print(queryset)
        return Response(serializer.data)

    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        filter = {}
        print(self.kwargs['pk'].isnumeric())
        if self.kwargs['pk'].isnumeric():
            filter['pk']=self.kwargs['pk']
        else:
            filter['username']=self.kwargs['pk']
        return get_object_or_404(queryset, **filter)            

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny(), ]
        return super(UserViewSet, self).get_permissions()    