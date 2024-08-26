import { useState, useEffect } from "react"
import {useParams, useNavigate} from 'react-router-dom'
import serverUrl from '../serverUrl'
function IndividualPost () {
    const navigate = useNavigate()
    const params = useParams()
    const [username, setUsername] = useState('')
    const [post, setPost] = useState("")
    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState([])
    const [errors, setErrors] = useState([])
    useEffect(() => {
        const getInfo = async () => {
            try {
                const request = await fetch(serverUrl + `posts/${params.postId}/`, {
                    mode: 'cors',
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
                })
                const response = await request.json()
                if (response.msg) {
                    setErrors([response.msg])
                } else {
                    setUsername(response.username)
                    setPost(response.postContent)
                    setLikes(response.likes)
                    setComments(response.comments)
                }
            } catch {
                setErrors(["There was an error reaching the server"])
            }
        }
        getInfo()
    }, [])
    if (post == '') {
        return <>
        
        </>
    } else {
        return <>
            <div>
                <h2>{username} - {post}</h2>
                <button>{likes}</button>
            </div>
            <ul>
                {comments.map(comment => {
                    return <li>{comment.commentContent}</li>
                })}
            </ul>
            <ul>
                {errors.map(error => {
                    return <li>{error}</li>
                })}
            </ul>
        </>
    }
}
export default IndividualPost