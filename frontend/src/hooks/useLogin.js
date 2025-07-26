import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../Context/AuthContext";
import API from "../Api/api"

const useLogin = () => {
	
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username, password) => {
		const success = handleInputErrors(username, password);
		if (!success) return;

		setLoading(true);
		try {
			const res = await API.post("/api/auth/login", {
				username,
				password,
			});

			const data = res.data;

			if (data && data._id) {
				localStorage.setItem("chat-user", JSON.stringify(data));
				setAuthUser(data);
				toast.success("Login successful!");
			} else {
				throw new Error("Invalid login response");
			}

		} catch (error) {
			const message = error?.response?.data?.error || error.message || "Login failed";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};


	return { loading, login };
};
export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}
	return true;
}
