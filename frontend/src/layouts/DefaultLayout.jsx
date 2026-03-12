import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [loading, setLoading] = useState(true);

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    axiosClient.get("/user")
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 401) {
          // Token expired or invalid
          setToken(null);
        }
        setLoading(false);
      });
  }, [setToken, setUser]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="brutalist-card text-2xl font-black">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div id="defaultLayout" className="min-h-screen bg-amber-50 flex flex-col font-mono">
      <header className="bg-white border-b-8 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="text-4xl font-black tracking-tighter text-black uppercase hover:skew-x-2 transition-transform">
            Quiz Platform
          </Link>
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg hidden sm:inline">USER: {user.name}</span>
            <a
              href="#"
              onClick={onLogout}
              className="brutalist-button brutalist-button-red py-1"
            >
              LOGOUT
            </a>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {notification && (
                <div className="mb-8 brutalist-card bg-green-400 font-bold text-xl text-center rotate-1">
                    {notification}
                </div>
            )}
            <Outlet />
        </div>
      </main>
    </div>
  );
}
