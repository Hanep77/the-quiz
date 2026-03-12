import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    setErrors(null);
    await axiosClient.post("/login", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.access_token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message],
            });
          }
        }
      });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h1 className="text-3xl font-black text-center mb-8 uppercase tracking-tighter">Login</h1>
      {errors && (
        <div className="brutalist-card bg-red-400 p-4 mb-6">
          {Object.keys(errors).map((key) => (
            <p key={key} className="font-bold">{errors[key][0]}</p>
          ))}
        </div>
      )}
      <div>
        <label className="brutalist-label">Email</label>
        <input ref={emailRef} type="email" placeholder="Email Address" className="brutalist-input" />
      </div>
      <div>
        <label className="brutalist-label">Password</label>
        <input ref={passwordRef} type="password" placeholder="Password" className="brutalist-input" />
      </div>
      <button className="brutalist-button w-full text-xl py-3 uppercase">Login</button>
      <p className="text-center font-bold text-lg">
        Not registered? <Link to="/signup" className="underline decoration-4 hover:bg-yellow-200 transition-colors px-1">Create an account</Link>
      </p>
    </form>
  );
}
