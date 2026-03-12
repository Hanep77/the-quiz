import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function GuestLayout() {
  const { token } = useStateContext();

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 py-12 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-md w-full space-y-8 brutalist-card bg-white rotate-1">
        <div>
          <h2 className="mt-6 text-center text-5xl font-black text-black uppercase tracking-tighter -rotate-2">
            Quiz Platform
          </h2>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
