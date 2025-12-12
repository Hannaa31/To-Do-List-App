import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({ email: "", password: "", name: "" });
  const { email, password, name } = inputs;

  const onChange = e => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password, name };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
      } else {
        setAuth(false);
        alert(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-8">Create Account</h1>
        <form onSubmit={onSubmitForm} className="flex flex-col gap-5">
          <input type="text" name="name" placeholder="Name" value={name} onChange={onChange}
             className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-purple-500 outline-none transition" />
          <input type="email" name="email" placeholder="Email" value={email} onChange={onChange}
             className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-purple-500 outline-none transition" />
          <input type="password" name="password" placeholder="Password" value={password} onChange={onChange}
             className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-purple-500 outline-none transition" />
          <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg shadow-purple-500/20">
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Login</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;