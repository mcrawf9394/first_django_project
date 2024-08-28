import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import serverUrl from '../serverUrl'
import { v4 } from 'uuid'
import '../../stylesheets/profile/ViewAllUsers.css'
function ViewAllUsers () {
    const navigate = useNavigate()
    const [userList, setUserList] = useState([])
    const [errors, setErrors] = useState([])
    useEffect(() => {
        const getInfo = async () => {
            try {
                const request = await fetch(serverUrl + 'users/', {
                    mode: 'cors',
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                })
                const response = await request.json()
                setUserList(response.users)
            } catch {
                setErrors(["There was an error reaching the server"])
            }
        }
        getInfo()
    }, [])
    if (userList.length == 0) {
        return <>

        </>
    } else {
        return <>
            {userList.map(user => {
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
}
export default ViewAllUsers