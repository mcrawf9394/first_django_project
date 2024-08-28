import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import serverUrl from '../serverUrl'
import {v4} from 'uuid'
import '../../stylesheets/profile/ShowFollowing.css'
function ShowFollowing () {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [errors, setErrors] = useState([])
    useEffect(() => {
        const getInfo = async () =>{
            try {
                const request = await fetch(serverUrl + 'users/following/', {
                    mode: 'cors',
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
                })
                const response = await request.json()
                setUsers(response.users)
            } catch {
                setErrors(["There was an issue reaching the server"])   
            }
        }
        getInfo()
    }, [])
    return <>
            {users.map(user => {
                return <button className="userButton" onClick={click => {
                    click.preventDefault()
                    navigate(`/users/${user.id}/`)
                }} key={v4()}>
                    {user.username}
                </button>
            })}
            <ul>
                {errors.map(error => {
                    return <li key={v4()}>{error}</li>
                })}
            </ul>
    </>
}
export default ShowFollowing