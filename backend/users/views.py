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
@api_view(['GET', "POST"])
def create_users(request):
    if request.method == 'POST':
        user = User.objects.create_user(request.POST["username"], None , request.POST["password"])
        return JsonResponse({"user": user})
    else:
        users = User.objects.all()
        return JsonResponse({"users": users})
@api_view(["GET", "POST", "DELETE"])
def interact_with_single_user(request, uid):
    userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get("id")
    if request.method == 'GET':
        try:
            user = User.objects.get(id=uid)
        except User.DoesNotExist:
            return JsonResponse({"msg": "This user does not exist"})
        return JsonResponse(user)
    elif request.method == 'POST':
        if userId != uid:
            return JsonResponse({"msg": "You can not change another user"})
        else:
            try:
                user = User.objects.get(id=uid)
            except User.DoesNotExist:
                return JsonResponse({"msg": "This user does not exist"})
            def update(username, password):
                user.username = username
                user.set_password(password)
                user.save()
            try:
                CheckUser = User.objects.get(username=request.POST["username"])
            except User.DoesNotExist:
                update(request.POST["username"], request.POST["password"])
                return JsonResponse({"msg": "User updated"})
            if CheckUser.id != uid:
                return JsonResponse({"msg":"Please use another username"})
            else:
                update(request.POST["username"], request.POST["password"])
                return JsonResponse({"msg":"User updated"})
    elif request.method == 'DELETE':
        if userId != uid:
            return JsonResponse({"msg":"You can not delete another user"})
        else:
            try:
                user = User.objects.get(id=uid)
            except User.DoesNotExist:
                return JsonResponse({"msg": "This user does not exist"})
            user.delete()
            return JsonResponse({"msg": "User Deleted"})
def isAuth(request):
    userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"])
    return JsonResponse({"id": userId.get("id")})
def login(request):
    user = authenticate(request, username=request.POST["username"], password=request.POST["password"])
    if user is not None:
        token = jwt.encode({"id": user.id}, env("JWTSECRET"),algorithm="HS256")
        return JsonResponse({"token": token})
    else:
        return JsonResponse({"msg": "These are not the correct credentials"})