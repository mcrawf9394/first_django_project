import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import serverUrl from '../serverUrl'
import { v4 } from "uuid"
function ViewProfile () {
    const navigate = useNavigate()
    const params = useParams()
    const [userInfo, setUserInfo] = useState("")
    const [posts, setPosts] = useState([])
    const [isFollowing, setIsFollowing] = useState("Follow")
    const [errors, setErrors] = useState([])
    useEffect(() => {
        const getInfo = async () => {
            try {
                const request = await fetch(serverUrl + `users/${params.userId}/`, {
                    mode: 'cors',
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                })
                const response = await request.json()
                setUserInfo(response.username)
                if (response.following) {
                    setIsFollowing("Unfollow")
                }
            } catch {
                setErrors(["There was an issue reaching the server"])
            }
        }
        getInfo()
    }, [])
    if (userInfo.length == 0) {
        return <>
        
        </>
    } else {
        return <>
            <h2>{userInfo}</h2>
            <button onClick={async click => {
                click.preventDefault()
                try {
                    let method
                    let newButtonContent
                    if (isFollowing == 'Follow') {
                        method = 'POST'
                        newButtonContent = 'Unfollow'
                    } else {
                        method = 'DELETE'
                        newButtonContent = 'Follow'
                    }
                    const request = await fetch(serverUrl + `/users/addfollowing/${userInfo}/`, {
                        mode: 'cors',
                        method: method,
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    })
                    if (request.status != 200) {
                        setErrors(["There was an internal server error"])
                    } else {
                        setIsFollowing(newButtonContent)
                    }
                } catch {
                    setErrors(["There was an issue reaching the server"])
                }
            }}>{isFollowing}</button>
            {posts.map(post => {
                return <button key={v4()}>{post}</button>
            })}
            <ul>
                {errors.map(error => {
                    return <li key={v4()}>{error}</li>
                })}
            </ul>
        </>
    }
}
export default ViewProfile