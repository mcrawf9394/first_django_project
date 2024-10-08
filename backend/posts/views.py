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
        postLikes = json.loads(post.listOfLikes)
        isLikedByUser = postLikes.count(User.objects.get(id=userId).username) > 0
        responseObj = {"username": post.userId.username,"postContent": post.postContent, "likes": len(json.loads(post.listOfLikes)), "comments": comments, "isLikedByUser": isLikedByUser}
        return JsonResponse(responseObj)
    elif request.method == 'DELETE':
        if post.userId != User.objects.get(id=userId):
            return JsonResponse({"msg": "You cannot delete a post that you did not create"})
        else:
            post.delete()
            return JsonResponse({"msg": "This post has been deleted"})
def handleLikes(request, postId):
    if request.method == 'POST':
        post = Post.objects.get(id=postId)
        likes = json.loads(post.listOfLikes)
        user = User.objects.get(id=jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get("id"))
        if likes.count(user.username) == 0:
            likes.append(user.username)
        else:
            likes.remove(user.username)
        post.listOfLikes = json.dumps(likes)
        post.save()
        return JsonResponse({"isLiked": likes.count(user.username) == 0, "likes": len(likes)})

#Views that handle the interaction with comments
def baseCommentsRoutes(request, postId):
    if request.method == 'POST':
        newComment = Comment(postId=Post.objects.get(id=postId), userId=User.objects.get(id=jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get("id")), commentContent=request.POST["commentContent"], listOfLikes=json.dumps([]), created=timezone.now())
        newComment.save()
        return JsonResponse({"comment": {"commentContent": newComment.commentContent, "username": newComment.userId.username, "likes": len(json.loads(newComment.listOfLikes))}})
def accessOneComment(request, postId, commentId):
    if request.method == 'DELETE' or request.method == 'POST':
        requestedComment = Comment.objects.get(id=commentId)
        currentUser = User.objects.get(id=jwt.decode(request.headers["Authorization"].split(' ')[1], env("JWTSECRET"), algorithms=["HS256"]).get("id"))
        if requestedComment.userId != currentUser or requestedComment.postId.userId != currentUser:
            return JsonResponse({'msg': "You cannot delete or edit a comment that you did not create"})
        else:
            if request.method =='DELETE':
                requestedComment.delete()
                return JsonResponse({"success": "This comment was successfully deleted"})
            else:
                requestedComment.commentContent = request.POST["commentContent"]
                requestedComment.save()
                return JsonResponse({"success": "This comment was successfully updated"})
def handleCommentLikes(request, postId, commentId):
    if request.method == 'POST':
        requestedComment = Comment.objects.get(id=commentId)
        likes = json.loads(requestedComment.listOfLikes)
        user = User.objects.get(id=jwt.decode(request.headers["Authorization"].split(' ')[1], env('JWTSECRET'), algorithms=["HS256"]).get("ID"))
        if likes.count(user.username) == 0:
            likes.append(user.username)
        else:
            likes.remove(user.username)
        requestedComment.listOfLikes = json.dumps(likes)
        requestedComment.save()
        return JsonResponse({"likes": len(likes), "isLiked": likes.count(user.username) > 0})