import { useState } from "react";
import { useAuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import API from "../Api/api"; // ✅ import axios instance

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			const res = await API.post("/api/auth/logout");

			const data = res.data;

			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.removeItem("chat-user");
			setAuthUser(null);
			toast.success("Logged out successfully");

		} catch (error) {
			const message = error?.response?.data?.error || error.message || "Logout failed";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};

export default useLogout;
