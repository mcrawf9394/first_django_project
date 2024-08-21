import serverUrl from "../serverUrl"
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { v4 } from "uuid";
function DeleteProfile ({onClose}) {
    const navigate = useNavigate()
    const params = useParams()
    const [errors, setErrors] = useState([{msg: ''}])
    return <div className="">
        <h1 className="">Are you sure that you want to delete your account?</h1>
        <div className="">
            <button className="" onClick={onClose}>Cancel</button>
            <button className="" onClick={async click => {
                click.preventDefault()
                try {
                    const request = await fetch(serverUrl + `users/${params.userId}`,{
                        mode: 'cors',
                        method: 'DELETE',
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    })
                    if (request.status === 200) {
                        localStorage.clear()
                        navigate('/')
                    } else {
                        setErrors([{msg: 'Could not reach the server'}])
                    }
                } catch {
                    setErrors([{msg: "Could not reach the server"}]);
                }
            }}>Delete</button>
        </div>
        <ul>
            {errors.map(val => {
                <li className='' key={v4()}>{val.msg}</li>
            })}
        </ul>
    </div>
}
export default DeleteProfile