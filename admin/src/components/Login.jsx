import React, { useEffect, useState } from "react";
import axios from 'axios'
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({setToken}) => {

    const [formLogin, setFormLogin] = useState({
        email: '',
        password: ''
    })

    const onSubmitHandler = async (e) => {
        const data = {email: formLogin.email, password: formLogin.password}
        try {
            e.preventDefault()
            const response = await axios.post(backendUrl + '/api/user/admin', data)
            if(response.data.success) {
                setToken(response.data.token)
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const onChange = (key, text) => {
        setFormLogin((prev) => {
            return {
                ...prev,
                [key]:text
            }
        })
    }

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Email Address</p>
            <input value={formLogin.email} onChange={(e) => onChange('email',e.target.value)} className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none" type="email" placeholder="your@email.com" required />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input value={formLogin.password} onChange={(e) => onChange('password',e.target.value)} className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none" type="password" placeholder="Enter your password" required />
          </div>
          <button className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
