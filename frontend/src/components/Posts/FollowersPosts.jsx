import {useState, useEffect} from 'react'
import {useNavigate, Form} from 'react-router-dom'
import serverUrl from '../serverUrl'
import {v4} from 'uuid'
import '../../stylesheets/posts/FollowersPosts.css'
function FollowersPosts () {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [errors, setErrors] = useState([])
    function AddPosts () {
        const [content, setContent] = useState('')
        return <Form className='addNewPostForm'>
            <input className='addNewPostInput' id='postContent' type="text" value={content} onChange={e => {setContent(e.target.value)}} />
            <button className='addNewPostButton' onClick={async click => {
                click.preventDefault()
                try {
                    const request = await fetch(serverUrl + 'posts/', {
                        mode: 'cors',
                        method: 'POST',
                        headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`},
                        body: new URLSearchParams(`content=${content}`)
                    })
                    const response = await request.json()
                    const newList = [response.post, ...posts]
                    setPosts(newList)
                } catch {
                    setErrors(["There was an error creating the post"])
                }
            }}>Add Post</button>
        </Form>
    }
    useEffect(() => {
        const getInfo = async () => {
            try {
                const request = await fetch(serverUrl + 'posts/', {
                    mode: 'cors',
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
                })
                const response = await request.json()
                setPosts(response.posts)
            } catch {
                setErrors(["There was an issue reaching the server"])
            }
        }
        getInfo()
    }, [])
    if (posts.length == 0) {
        return <>
            <AddPosts/>
            <p>There are no posts, why don't you create your own or follow other users!</p>
            <ul>
                {errors.map(error => {
                    return <li key={v4()}>{error}</li>
                })}
            </ul>
        </>
    } else {
        return <>
            <AddPosts />
            {posts.map(post => {
                return <button className='followersPosts' onClick={click => {
                    click.preventDefault()
                    navigate(`/posts/${post.id}`)
                }} key={v4()}>{post.username} - {post.postContent}</button>
            })}
            <ul>
                {errors.map(error => {
                    return <li key={v4()}>{error}</li>
                })}
            </ul>
        </>
    }
}
export default FollowersPosts