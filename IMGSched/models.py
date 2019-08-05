from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.

class Meeting(models.Model):
	meeting_id = models.AutoField(primary_key=True)
	created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meetings')
	created_on = models.DateTimeField(default=timezone.now)
	purpose = models.CharField(max_length=50)
	meeting_on = models.DateTimeField()
	venue = models.CharField(max_length=30, default='IMG lab')
	participants = models.ManyToManyField(User, related_name='invitedppl')

	def __str__(self):
		return self.purpose

	class Meta:
		ordering = ('created_on', )	

class Comment(models.Model):
	user = models.ForeignKey(User, on_delete=models.PROTECT)
	meet = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='comments')
	time = models.DateTimeField(default=timezone.now)
	comment = models.TextField()

	def __str__(self):
		return '%d: %s' % (self.id, self.comment)
