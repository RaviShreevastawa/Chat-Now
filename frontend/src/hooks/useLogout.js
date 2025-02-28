import { useState } from "react";
import { useAuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
    const [loading, setLoading] = useState();
    const {setAuthUser} = useAuthContext();

    const logout = async () => {
        setLoading(true)
        try {
            const res = await fetch("http://localhost:3000/api/auth/logout", {
                method : "POST",
                headers : {"content-type" : "application/json"}
            });
            const data = await res.json()
            if(data.error){
                throw new Error(data.Error)
            }
            localStorage.removeItem("chat-user")
            setAuthUser(null)
        }catch(error){
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
    return {loading, logout}
}

export default useLogout