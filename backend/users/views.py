from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse, Http404
def create_users(request):
    if request.method == 'POST':
        user = User.objects.create_user(request.POST["username"], None , request.POST["password"])
        return HttpResponse(user)
    else:
        users = User.objects.all()
        return HttpResponse(users)
def interact_with_single_user(request, uid):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=uid)
        except User.DoesNotExist:
            return HttpResponse("This user does not exist")
        return HttpResponse(user)
    elif request.method == 'POST':
        if request.user.id != uid:
            return HttpResponse("You can not change another user")
        else:
            try:
                user = User.objects.get(id=uid)
            except User.DoesNotExist:
                return HttpResponse("This user does not exist")
            def update(username, password):
                user.username = username
                user.set_password(password)
                user.save()
            try:
                CheckUser = User.objects.get(username=request.POST["username"])
            except User.DoesNotExist:
                update(request.POST["username"], request.POST["password"])
                return HttpResponse("User updated")
            if CheckUser.id != uid:
                return HttpResponse("Please use another username")
            else:
                update(request.POST["username"], request.POST["password"])
                return HttpResponse("User updated")
    elif request.method == 'DELETE':
        if request.user.id != uid:
            return HttpResponse("You can not delete another user")
        else:
            try:
                user = User.objects.get(id=uid)
            except User.DoesNotExist:
                return HttpResponse("This user does not exist")
            user.delete()
            return HttpResponse("User Deleted")
def loginUser(request):
    if request.method == 'POST':
        user = authenticate(request, username=request.POST["username"], password=request.POST["password"])
        if user is not None:
            login(request, user)
            return HttpResponse("User is logged in")
        else:
            return HttpResponse("Incorrect Credentials")
def logoutUser(request):
    if request.method == 'GET':
        logout(request)
        return HttpResponse("User logged out")