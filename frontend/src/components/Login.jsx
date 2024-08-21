import {Form, useNavigate} from 'react-router-dom'
import {useState} from 'react'
import serverUrl from './serverUrl'
import {v4} from 'uuid'
import '../stylesheets/Login.css'
function Login () {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    return <>
        <h2>Welcome to Placeholder</h2>
        <p>Use the form below to login, click the sign in as guest button, or signup to create an account</p>
        <Form className='userLoginForm' action={serverUrl + 'users/login/'} method='POST'>
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
        <button onClick={async click => {
            click.preventDefault()
            try {

            } catch {

            }
        }}>Sign in as Guest</button>
        <button onClick={click => {
            click.preventDefault()

        }}>Sign-Up</button>
        <ul className='loginErrorList'>
            {errors.map(error => {
                return <li key={v4()}>
                    {error}
                </li>
            })}
        </ul>
    </>
}
export default Login