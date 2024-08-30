from django.urls import path
from . import views
app_name='posts'
urlpatterns=[
    path('', views.basePostRoute, name='posts'),
    path('<int:postId>/', views.interactWithSpecificPost, name='singlePost'),
    path('<int:postId>/handleLikes/', views.handleLikes, name='handleLikes'),
    path('<int:postId>/comments/', views.baseCommentsRoutes, name='comments'),
    path('<int:postId>/comments/<int:commentId>/', views.accessOneComment, name='singleComment'),
    path('<int:postId>/comments/<int:commentId>/handleLikes/', views.handleCommentLikes, name='handleCommentLikes')
]