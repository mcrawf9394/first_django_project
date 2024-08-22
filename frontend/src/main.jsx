import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './stylesheets/index.css'
import Login from './components/Login.jsx'
import EditProfile from './components/Profiles/EditProfile.jsx'
import SignUp from './components/SignUp.jsx'

const Router = createBrowserRouter([
  {
    path: '*',
    element:<App/>,
    children: [
      {path: 'profile/edit/:userId', element: <EditProfile/>}
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
