import {Link, Route, Routes} from 'react-router-dom'
import './stylesheets/App.css'
import Login from './Login'
function App() {
  return (
    <>
      <nav className='navBar'>
        <h1></h1>
        <Link></Link>
        <Link></Link>
        <Link></Link>
      </nav>
      <Routes>
          <Route Component={Login} path='/login'/>
      </Routes>
    </>
  )
}

export default App
