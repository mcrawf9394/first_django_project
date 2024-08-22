import { useState } from "react"
import { useNavigate, Form } from "react-router-dom"
import serverUrl from './serverUrl'
import { v4 } from "uuid"
import '../stylesheets/SignUp.css'
function SignUp () {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [errors, setErrors] = useState([])
    const navigate = useNavigate()
    return <>
        <Form>
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={e => setUsername(e.target.value)} type="text" />
            <label htmlFor="password">Password</label>
            <input id="password" value={password} onChange={e => setPassword(e.target.value)} type="text" />
            <label htmlFor="confirm">Confirm Password</label>
            <input id="confirm" value={confirm} onChange={e => setConfirm(e.target.value)} type="text" />
            <button onClick={async click => {
                click.preventDefault()
                if (confirm != password || password.length < 8) {
                    setErrors(["These passwords do no match, or the password is less than 8 charaters please re-enter the information"])
                } else {
                    try {
                        const request = await fetch(serverUrl + 'users/', {
                            mode: 'cors',
                            method: 'POST',
                            body: new URLSearchParams(`username=${username}&password=${password}`)
                        })
                        if (request.status != 200) {
                            setErrors(["There was an internal server error"])
                        }
                        else {
                            navigate('/login')
                        }
                    } catch {
                        setErrors(["There was an error reaching the server"])
                    }
                }
            }} type="submit">Create Account</button>
        </Form>
        <ul>
            {errors.map(error => {
                return <li key={v4()}>{error}</li>
            })}
        </ul>
    </>
}
export default SignUp