import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './stylesheets/index.css'
import Login from './components/Login.jsx'
import EditProfile from './components/Profiles/EditProfile.jsx'
import SignUp from './components/SignUp.jsx'
import ViewAllUsers from './components/Profiles/ViewAllUsers.jsx'
import ShowFollowing from './components/Profiles/ShowFollowing.jsx'

const Router = createBrowserRouter([
  {
    path: '*',
    element:<App/>,
    children: [
      {path: 'profile/edit/:userId', element: <EditProfile/>},
      {path: 'users/', element: <ViewAllUsers/>},
      {path: 'following/', element: <ShowFollowing/>},
    ]
  }, 
  {
    path: '/login',
    element:<Login />
  },
  {
    path: '/signup',
    element: <SignUp/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>,
)
