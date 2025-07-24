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
			const res = await fetch("http://localhost:4000/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
				credentials: "include",
			});

			const text = await res.text();
			console.log("Raw server response:", text);

			let data;
			try {
				data = JSON.parse(text);
			} catch (jsonError) {
				throw new Error("Invalid JSON response from server");
			}

			if (!res.ok) {
				throw new Error(data.error || "Login failed");
			}

			if (data && data._id) {
				localStorage.setItem("chat-user", JSON.stringify(data));
				setAuthUser(data);
				toast.success("Login successful!");
			} else {
				throw new Error("Invalid login response");
			}

		} catch (error) {
			toast.error(error.message);
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
