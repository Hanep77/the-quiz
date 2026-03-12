import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };
    axiosClient.post("/register", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.access_token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h1 className="text-3xl font-black text-center mb-8 uppercase tracking-tighter">Sign Up</h1>
      {errors && (
        <div className="brutalist-card bg-red-400 p-4 mb-6">
          {Object.keys(errors).map((key) => (
            <p key={key} className="font-bold">{errors[key][0]}</p>
          ))}
        </div>
      )}
      <div>
        <label className="brutalist-label">Name</label>
        <input ref={nameRef} type="text" placeholder="Full Name" className="brutalist-input" />
      </div>
      <div>
        <label className="brutalist-label">Email</label>
        <input ref={emailRef} type="email" placeholder="Email Address" className="brutalist-input" />
      </div>
      <div>
        <label className="brutalist-label">Password</label>
        <input ref={passwordRef} type="password" placeholder="Password" className="brutalist-input" />
      </div>
      <div>
        <label className="brutalist-label">Confirm Password</label>
        <input ref={passwordConfirmationRef} type="password" placeholder="Confirm Password" className="brutalist-input" />
      </div>
      <button className="brutalist-button w-full text-xl py-3 uppercase">Register</button>
      <p className="text-center font-bold text-lg">
        Already registered? <Link to="/login" className="underline decoration-4 hover:bg-yellow-200 transition-colors px-1">Sign in</Link>
      </p>
    </form>
  );
}
