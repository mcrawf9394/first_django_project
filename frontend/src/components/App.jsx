import {Link, Route, Routes, useNavigate} from 'react-router-dom'
import '../stylesheets/App.css'
import { useEffect, useState } from 'react'
import Login from './Login'
import EditProfile from './Profiles/EditProfile'
import serverUrl from './serverUrl'
import ViewAllUsers from './Profiles/ViewAllUsers'
import ShowFollowing from './Profiles/ShowFollowing'
import ViewProfile from './Profiles/ViewProfile'
import FollowersPosts from './Posts/FollowersPosts'
import IndividualPost from './Posts/IndividualPost'
function App() {
    const navigate = useNavigate()
    const [userID, setUserID] = useState(null)
    useEffect(() => {
        const isAuth = async () => {
        if (localStorage.getItem('token') == null) {
            navigate('/login')
        } else {
            try {
                const request = await fetch(serverUrl + 'users/isAuth/', {
                    mode: 'cors',
                    headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
                })
                if (request.status == 500) {
                    console.log("there has been an internal server error")
                } else {
                    const response = await request.json()
                    if (response.msg) {
                        localStorage.clear()
                        navigate('/login')
                    } else {
                        setUserID(response.id)
                    }
                }
            } catch (error) {
                console.log(error)
            }
          }
        }
        isAuth()
    }, [])
    return (
        <>
            <nav className='navBar'>
                <h1>Placeholder</h1>
                <Link to='/' className='links'>Home</Link>
                <Link to='/users/' className='links'>All Users</Link>
                <Link  className='links'>Groups</Link>
                <Link className='links'>Messages</Link>
                <Link to='/following/' className='links'>Following</Link>
                <Link to={`/profile/edit/${userID}/`} className='links'>Profile</Link>
            </nav>
            <Routes>
                <Route Component={EditProfile} path={`/profile/edit/:userId`}/>
                <Route Component={ViewAllUsers} path='/users/'/>
                <Route Component={ShowFollowing} path='/following/'/>
                <Route Component={ViewProfile} path='/users/:userId'/>
                <Route Component={FollowersPosts} path='/'/>
                <Route Component={IndividualPost} path='/posts/:postId'/>
            </Routes>
        </>
    )
}

export default App
