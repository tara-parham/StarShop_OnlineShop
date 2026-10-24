
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

export function DashboardPage(){
    const {user, logout} = useAuth();

    if(!user){
        return <Navigate to="/login" />
    }

    return(
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold mb-4">My Account</h1>
            <div className="bg-rose-50 p-6 rounded-xl shadow-sm border border-gray-300">
                <p className="text-lg">Welcome back, <strong>{user.name}</strong>! 👋</p>
                <p className="text-gray-600 my-2">Email: {user.email}</p>
                <Button onClick={logout} className="mt-6">Logout</Button>
            </div>
        </div>
    )
}