from django.http import JsonResponse
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
import environ
import os
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
from django.contrib.auth.models import User
from .models import Post, Comment
import jwt
import json

# Creating Post and retrieving posts for specific users feed
def basePostRoute(request):
    userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get("id")
    currentUser = User.objects.get(id=userId)
    if request.method == 'POST':
        newPost = Post(userId=currentUser, postContent=request.POST["content"], listOfLikes=json.dumps([]))
        newPost.save()
        return JsonResponse({"post": [newPost.userId.username, newPost.postContent]})
    elif request.method == 'GET:':
        currentUser = User.objects.get(id=userId)
        