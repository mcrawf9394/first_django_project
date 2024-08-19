from django.urls import path
from . import views
app_name = 'users'
urlpatterns = [
    path("", views.create_users, name='index'),
    path("<int:uid>/", views.interact_with_single_user, name='singleUser'),
    path("login/", views.loginUser, name='loginUser'),
    path("logout/", views.logoutUser, name='logoutUser')
]