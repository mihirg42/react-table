import { useState } from 'react';
import { Config } from '../Config/Index.ts';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const url = Config.API_URL + Config.LOGIN;


export default function Login() {

    const navigate = useNavigate();

    const [person, setPerson] = useState({
        "userName": "",
        "password": "",
        "deviceType": "",
        "fcmToken": "",
        "ipAddress": "",
        "location": ""
    });


    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPerson({
            ...person,
            userName: e.target.value
        })
    }


    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPerson({
            ...person,
            password: e.target.value
        })
    }


    async function handleSubmitClick(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "ekey": Config.EKEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });

        const json = await response.json();
        if (json?.data?.token) {
            localStorage.setItem("token", json.data.token);
            localStorage.setItem("EmployeeName", json.data.userDetails.emp_Name);
            navigate("/Home.aspx");
        }
        else {
            alert("Check username and password");
        }
    }
    return (
        <>
            <div className='row mt-5'>
                <div className='col-md-5'></div>
                <div className='col-md-2'>
                    <form onSubmit={handleSubmitClick}>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" value={person.userName} onChange={handleUsernameChange} className="form-control" placeholder="Username" />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input type="password" value={person.password} onChange={handlePasswordChange} className="form-control" placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-primary mt-5">Submit</button>
                    </form>
                </div>
                <div className='col-md-5'></div>
            </div>
        </>
    )
}

