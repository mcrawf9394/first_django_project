import { useEffect, useState } from "react"
import { Form, useParams } from 'react-router-dom'
import serverUrl from '../serverUrl'
import { createPortal } from 'react-dom'
import DeleteProfile from './DeleteProfile'
import '../../stylesheets/profile/EditProfile.css'
function EditProfile () {
    const params = useParams()
    const [showModal, setShowModal] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [errors, setErrors] = useState([])
    const [canEdit, setCanEdit] = useState(false)
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
                    if (response.username != 'Guest') {
                        setCanEdit(true)
                    }
                    setUsername(response.username)
                }
            } catch {
                setErrors(["There was an issue reaching the server"])
            }
        }
        getInfo()
    }, [])
    return <>
        {showModal && createPortal(
            <DeleteProfile onClose={() => setShowModal(false)} />,
            document.body
        )}
        <Form className="editUsernameForm">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
            <button onClick={async click => {
                click.preventDefault()
                if (canEdit == false) {
                    setErrors(["You cannot edit the Guest account"])
                } else {
                    try {
                        const request = await fetch(serverUrl + `users/${params.userId}/`, {
                            mode: 'cors',
                            method: 'POST',
                            headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`},
                            body: new URLSearchParams(`username=${username}`)
                        })
                        const response = await request.json()
                        if (response.msg != "User updated") {
                            setErrors([response.msg])
                        } else {
                            setErrors(["Username successfully changed"])
                        }
                    } catch {
                        setErrors(["There was an error reaching the server"])
                    }
                }
            }} type="submit">Change Username</button>
        </Form>
       <Form className="editPasswordForm">
            <label htmlFor="password">New Password</label>
            <input id="password" value={password} onChange={e => setPassword(e.target.value)} type="text" />
            <label htmlFor="confirm">Confirm Password</label>
            <input id="confirm" value={confirm} onChange={e => setConfirm(e.target.value)} type="text" />
            <button type="submit" onClick={async click => {
                click.preventDefault()
                try {
                    if (canEdit == false) {
                        setErrors(["You cannot edit the Guest account"])
                    } else {
                        if (password != confirm || password.length < 8) {
                            setErrors(["Passwords either do not match, or The passwords length is less than 8 characters, please re-enter your new password"])
                        } else {
                            const request = await fetch(serverUrl + 'users/updatePassword/', {
                                mode: 'cors',
                                method: 'POST',
                                headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`},
                                body: new URLSearchParams(`password=${password}`)
                            })
                            if (request.status != 200) {
                                setErrors(["There was an enternal server error"])
                            } else {
                                setErrors(["Password successfully changed"])
                            }   
                        }
                    }
                } catch {
                    setErrors(["There was an error reaching the server"])      
                }
            }}>Change Password</button>
       </Form>
        <button className='userDeleteButton' onClick={click => {
            click.preventDefault()
            if (canEdit == false) {
                setErrors(["You cannot edit the Guest account"])
            } else {
                setShowModal(true)
            }
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