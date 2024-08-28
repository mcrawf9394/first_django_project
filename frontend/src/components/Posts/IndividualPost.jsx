import { useState, useEffect } from "react"
import {useParams, useNavigate} from 'react-router-dom'
import serverUrl from '../serverUrl'
import {v4} from 'uuid'
import '../../stylesheets/posts/IndividualPost.css'
function IndividualPost () {
    const navigate = useNavigate()
    const params = useParams()
    const [username, setUsername] = useState('')
    const [post, setPost] = useState("")
    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState([])
    const [errors, setErrors] = useState([])
    const [liked, setLiked] = useState("isNotLiked")
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
                    if (response.isLikedByUser == true) {
                        setLiked("isLiked")
                    }
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
            <div className="singlePostDisplay">
                <button className='goBackButton' onClick={click => {
                    click.preventDefault()
                    navigate('/')
                }}>Go Back</button>
                <h2 className="basicInfoFromPost">{username} - {post}</h2>
                <button className={`${liked}`} onClick={async click => {
                    click.preventDefault()
                    try {
                        const request = await fetch(serverUrl + `posts/${params.postId}/handleLikes/`, {
                            mode: 'cors',
                            method: 'POST',
                            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                        })
                        const response = await request.json()
                        if (response.isLiked == true) {    
                            setLiked("isLiked")
                        } else {
                            setLiked("isNotLiked")
                        }
                        setLikes(response.likes)
                    } catch {
                        setErrors(["Unable to reach the server"])
                    }
                }}>{likes}</button>
            </div>
            <ul className="commentList">
                {comments.map(comment => {
                    return <li className="singleComment" key={v4()}>{comment.commentContent}</li>
                })}
            </ul>
            <ul>
                {errors.map(error => {
                    return <li key={v4()}>{error}</li>
                })}
            </ul>
        </>
    }
}
export default IndividualPost