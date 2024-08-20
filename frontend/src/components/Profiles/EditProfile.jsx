import { useEffect, useState } from "react"
import {useNavigate, Form, useParams} from 'react-router-dom'
import serverUrl from '../serverUrl'
function EditProfile () {
    const navigate = useNavigate()
    const params = useParams()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    useEffect(() => {
        const getInfo = async () => {
            try {
                const request = await fetch(serverUrl + `users/${params.userId}/`, {
                    mode: 'cors',
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}
                })
                const response = await request.json()
                if (response.msg) {
                    setErrors(["This user does not exist"])
                } else {
                    console.log(response.username)
                }
            } catch {

            }
        }
        getInfo()
    }, [])
    return <>
        <Form>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
            <button onClick={async click => {
                click.preventDefault()

            }} type="submit">Submit</button>
        </Form>
        <button>Change Password</button>
        <button onClick={click => {
            click.preventDefault()

        }}>Delete Profile</button>
        <ul>
            {errors.map(error => {
                return <li>
                    {error}
                </li>
            })}
        </ul>
    </>
}
export default EditProfile