from django.urls import path
from . import views
app_name = 'users'
urlpatterns = [
    path("", views.create_users, name='index'),
    path("<int:uid>/", views.interact_with_single_user, name='singleUser'),
    path('updatePassword/', views.updatePassword, name='passwordUpdate'),
    path('isAuth/', views.isAuth, name="checkAuth"),
    path("login/", views.login, name='loginUser'),
    path("following/", views.getCurrentUserFollowing, name='following'),
    path("addfollowing/", views.addUserToFollowing, name='addfollowing'),
]