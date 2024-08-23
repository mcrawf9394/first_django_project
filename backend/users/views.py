import jwt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from django.http import JsonResponse
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
import environ
import os
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
from . import models
import json
@api_view(['GET', "POST"])
def create_users(request):
    userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get("id")
    if request.method == 'POST':
        user = User.objects.create_user(request.POST["username"], None , request.POST["password"])
        userConnections = models.User_Connections(userId=user, following=json.dumps([]))
        userConnections.save()
        return JsonResponse({"user": user.username})
    else:
        users = list(User.objects.all())
        def obj(user):
            return {"id": user.id, "username": user.username}
        response = []
        for user in users:
            if userId != user.id:
                response.append(obj(user))
        return JsonResponse({'users': response})

@api_view(["GET", "POST", "DELETE"])
def interact_with_single_user(request, uid):
    userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get("id")
    try:
        user = User.objects.get(id=uid)
    except User.DoesNotExist:
        return JsonResponse({"msg": "This user does not exist"})
    if request.method == 'GET':
        try:
            otherUser = User.objects.get(id=userId)
        except User.DoesNotExist:
            return JsonResponse({"msg": "This user does not exist"})
        userConnections = json.loads(models.User_Connections.objects.get(userId=otherUser).following)
        isFollowing = userConnections.count(user.get_username()) == 1
        return JsonResponse({"username": user.get_username(), "following": isFollowing})
    elif request.method == 'POST':
        if userId != uid:
            return JsonResponse({"msg": "You can not change another user"})
        else:
            def update(username):
                user.username = username
                user.save()
            try:
                CheckUser = User.objects.get(username=request.POST["username"])
            except User.DoesNotExist:
                update(request.POST["username"])
                return JsonResponse({"msg": "User updated"})
            if CheckUser.id != uid:
                return JsonResponse({"msg":"Please use another username"})
            else:
                update(request.POST["username"])
                return JsonResponse({"msg":"User updated"})
    elif request.method == 'DELETE':
        if userId != uid:
            return JsonResponse({"msg":"You can not delete another user"})
        else:
            user.delete()
            return JsonResponse({"msg": "User Deleted"})

def updatePassword(request):
    if request.method == 'POST':
        try:
            userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"])
        except:
            return JsonResponse({"error": "This token is expired"})
        user = User.objects.get(id=userId.get("id"))
        user.set_password(request.POST["password"])
        user.save()
        return JsonResponse({"msg": "User's password has been updated"})

def isAuth(request):
    try:
        userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return JsonResponse({"msg": "This token is expired"})
    return JsonResponse({"id": userId.get("id")})

def login(request):
    user = authenticate(request, username=request.POST["username"], password=request.POST["password"])
    if user is not None:
        token = jwt.encode({"id": user.id}, env("JWTSECRET"),algorithm="HS256")
        return JsonResponse({"token": token})
    else:
        return JsonResponse({"msg": "These are not the correct credentials"})
from django.core import serializers
# This functions are going to link to the table that holds the information to the users following
def getCurrentUserFollowing(request):
    userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get('id')
    user = User.objects.get(id=userId)
    currentUserConnections = json.loads(models.User_Connections.objects.get(userId=user).following)
    userList = [] 
    def createObj(someUser):
        return {"id": someUser.id, "username": someUser.username}
    for username in currentUserConnections:
        someUser = User.objects.get(username=username)
        userList.append(createObj(someUser))
    return JsonResponse({"users": userList})

def addUserToFollowing(request, username):
    if request.method == 'POST' or request.method == 'DELETE':
        userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get('id')
        user = User.objects.get(id=userId)
        currentUserConnections = models.User_Connections.objects.get(userId=user)
        followers = json.loads(currentUserConnections.following)
        if request.method == 'POST':
            followers.append(username)
        else:
            followers.remove(username)
        currentUserConnections.following = json.dumps(followers)
        currentUserConnections.save()
        return JsonResponse({"msg": "user following updated"})