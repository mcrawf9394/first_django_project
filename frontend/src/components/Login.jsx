import {Form, useNavigate} from 'react-router-dom'
import {useState} from 'react'
import serverUrl from './serverUrl'
import {v4} from 'uuid'
function Login () {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    return <>
        <Form action={serverUrl + 'users/login/'} method='POST' className='loginForm'>
            <label htmlFor="username">Username</label>
            <input id='username' value={username} onChange={e => setUsername(e.target.value)} type="text" />
            <label htmlFor="password">Password</label>
            <input id='password' value={password} onChange={e => setPassword(e.target.value)} type="text" />
            <button onClick={async (click) => {
                click.preventDefault()
                try {
                    const request = await fetch(serverUrl + 'users/login/', {
                        mode: 'cors',
                        method: 'POST',
                        body: new URLSearchParams(`username=${username}&password=${password}`)
                    })
                    const response = await request.json()
                    if (response.msg) {
                        setErrors(["Incorrect username or password, please try again"])
                    } else {
                        localStorage.setItem('token', response.token)
                        navigate('/')
                    }
                } catch {
                    setErrors(["There was an error on the server please try again at a later time"])
                }
            }} type="submit">Submit</button>
        </Form>
        <ul>
            {errors.map(error => {
                return <li key={v4()}>
                    {error}
                </li>
            })}
        </ul>
    </>
}
export default Login