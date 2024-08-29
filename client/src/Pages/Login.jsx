import React, { useState } from 'react';
import { useAuth } from '../store/auth';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from '../Components/Dropdown';

const Login = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const { setIsLoggedIn, roles, role } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if(!role){return toast.error("Please give a proper user role")}
        e.preventDefault();
        const formData = { type:role,name,email, password };
        if (!role) {
            toast.error("Please select a proper user type")
        }
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            if (res.status === 200) {
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', role);
                setIsLoggedIn(true);
                toast.success("login successfull");
                navigate('/');
            } else {
                console.error("fail", data);
            }
        } catch (e) {
            console.error(e);
        }

    };

    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-slate-800">
            <div className="max-w-sm w-full text-white space-y-5">
                <div className="text-center pb-8">
                    <img src="/logo512.png" alt='bailsuites' className="mx-auto w-16 " />
                    <div className="mt-5">
                        <h3 className="text-white h-10 text-2xl font-bold sm:text-3xl">Login</h3>
                    </div>
                    <hr className="my-2" />
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="font-medium">
                            Select Your Role
                        </label>
                        <Dropdown head="Select Your Role" data={roles} />
                    </div>
                    {role === "charity" ? (
                        <div>
                            <label className="font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full mt-2 px-3 py-2 text-white bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    ) : role === "organization" ? (
                            <div>
                                <label className="font-medium">
                                    Name
                                </label>
                                <input
                                    type="name"
                                    required
                                    className="w-full mt-2 px-3 py-2 text-white bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        ) : <div>
                            <label className="font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full mt-2 px-3 py-2 text-white bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>}
                    <div>
                        <label className="font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full mt-2 px-3 py-2 text-white bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-x-3">
                            <input type="checkbox" id="remember-me-checkbox" className="checkbox-item peer hidden" />
                            <label
                                htmlFor="remember-me-checkbox"
                                className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                            >
                            </label>
                            <span>Remember me</span>
                        </div>
                        <Link to="/" className="text-center text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                    </div>
                    <button
                        className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                    >
                        Sign in
                    </button>
                </form>
                <p className="text-center">Don't have an account? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register</Link></p>
            </div>
        </main>
    );
};

export default Login;