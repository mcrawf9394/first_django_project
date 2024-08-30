from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
class User_Connections(models.Model):
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    following = models.JSONField()
class Profile(User):
    profilePic = models.CharField()
    biography = models.CharField()