import {Link, Route, Routes, useNavigate} from 'react-router-dom'
import '../stylesheets/App.css'
import { useEffect } from 'react'
import Login from './Login'
function App() {
  const navigate = useNavigate()
  useEffect(() => {
    const isAuth = async () => {
      try {
        const request = await fetch('http://localhost:8000/users/isAuth/')
        console.log(request)
      } catch (error) {
        console.log(error)
      }
    }
    isAuth()
  }, [])
  return (
    <>
      <nav className='navBar'>
        <h1></h1>
        <Link>Home</Link>
        <Link>Communities</Link>
        <Link>Messages</Link>
        <Link>Following</Link>
        <Link>Profile</Link>
      </nav>
      <Routes>
          <Route Component={Login} path='/login'/>
      </Routes>
    </>
  )
}

export default App
