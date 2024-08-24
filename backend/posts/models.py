from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    postContent = models.CharField(max_length=200)
    listOfLikes = models.JSONField()
    created = models.DateTimeField()

class Comment(models.Model):
    postId = models.ForeignKey(Post, on_delete=models.CASCADE)
    userId = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    commentContent = models.CharField(max_length=100)
    listOfLikes = models.JSONField()
    created = models.DateTimeField()