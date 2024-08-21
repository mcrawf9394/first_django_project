import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './stylesheets/index.css'
import Login from './components/Login.jsx'
import EditProfile from './components/Profiles/EditProfile.jsx'

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
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>,
)
