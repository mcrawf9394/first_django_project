from django.urls import path
from . import views
app_name='posts'
urlpatterns=[
    path('', views.basePostRoute, name='posts'),
    path('<int:postId>/', views.interactWithSpecificPost, name='singlePost'),
    path('<int:postId>/handleLikes/', views.handleLikes, name='handleLikes')
]