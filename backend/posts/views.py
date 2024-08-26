from django.http import JsonResponse
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
import environ
import os
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
from django.contrib.auth.models import User
from .models import Post, Comment
from users.models import User_Connections
import jwt
import json
from django.utils import timezone
# Creating Post and retrieving posts for specific users feed
def basePostRoute(request):
    userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get("id")
    currentUser = User.objects.get(id=userId)
    if request.method == 'POST':
        newPost = Post(userId=currentUser, postContent=request.POST["content"], listOfLikes=json.dumps([]), created=timezone.now())
        newPost.save()
        return JsonResponse({"post": {"id": newPost.id ,"username": newPost.userId.username, "postContent": newPost.postContent}})
    elif request.method == 'GET':
        currentUser = User.objects.get(id=userId)
        following = json.loads(User_Connections.objects.get(userId=currentUser).following)
        def createObj(user, post):
            return {"id": post.id, "username": user.username, "postContent": post.postContent, "listOfLikes": post.listOfLikes, "created": post.created}
        posts = []
        for post in Post.objects.all().filter(userId=currentUser):
            posts.append(createObj(currentUser, post))
        for user in following:
            for post in Post.objects.all().filter(userId=User.objects.get(username=user)):
                post.append(createObj(user, post))
        def merge(leftList, rightList):
            sortedList = []
            while len(leftList) and len(rightList):
                if leftList[0].get("created") >= rightList[0].get("created"):
                    sortedList.append(leftList.pop(0))
                else:
                    sortedList.append(rightList.pop(0))
            sortedList.extend(leftList)
            sortedList.extend(rightList)
            return sortedList
        def mergeSort(someList):
            if len(someList) < 2:
                return someList
            middle = int(len(someList) / 2)
            leftList = someList[:middle]
            rightList = someList[middle:]
            return(merge(mergeSort(leftList), mergeSort(rightList)))
        posts = mergeSort(posts)
        return JsonResponse({"posts": posts})
def interactWithSpecificPost(request, postId):
    post = Post.objects.get(id=postId)
    userId = jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get("id")
    if request.method == 'POST':
        if post.userId != User.objects.get(id=userId):
            return JsonResponse({"msg": "You cannot edit a post that you did not create"})
        else:
            post.postContent = request.POST["postContent"]
            post.save()
            return JsonResponse({"post": post})
    elif request.method == 'GET':
        comments = Comment.objects.all().filter(postId=post)
        if len(comments) == 0:
            comments = []
        else:
            tempList = []
            for comment in comments:
                tempList.append({"commentContent": comment.commentContent, "username": comment.userId.username, "likes": len(json.loads(comment.listOfLikes))})
            comments = tempList
        responseObj = {"username": post.userId.username,"postContent": post.postContent, "likes": len(json.loads(post.listOfLikes)), "comments": comments}
        return JsonResponse(responseObj)
    elif request.method == 'DELETE':
        if post.userId != User.objects.get(id=userId):
            return JsonResponse({"msg": "You cannot delete a post that you did not create"})
        else:
            post.delete()
            return JsonResponse({"msg": "This post has been deleted"})