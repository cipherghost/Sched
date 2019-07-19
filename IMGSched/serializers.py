from rest_framework import serializers
from .models import Comment, Meeting
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class CommentSerializer(serializers.ModelSerializer):
	user = serializers.ReadOnlyField(source='user.username')
	time = serializers.ReadOnlyField()
	class Meta:		
		model = Comment
		fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
	#meetings = serializers.PrimaryKeyRelatedField(many=True, queryset=Meeting.objects.all())

	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'first_name', 'is_staff', 'password')
		extra_kwargs = {'password': {'write_only': True} }

	def create(self, validated_data):
		user = super(UserSerializer, self).create(validated_data)
		user.set_password(validated_data['password'])
		user.save()
		return user			

class MeetingSerializer(serializers.ModelSerializer):
	created_by = serializers.ReadOnlyField(source='created_by.username')
	created_on = serializers.ReadOnlyField()
	comments = CommentSerializer(many=True, read_only=True)
	#user = serializers.SlugRelatedField(slug_field='username')
	class Meta:
		model = Meeting
		read_only_fields = ('created_by', 'created_on')
		fields = ('id','created_by', 'created_on', 'purpose', 'meeting_on', 'venue', 'participants', 'comments')

