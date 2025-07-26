import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from "../Context/AuthContext";
import API from "../Api/api"; // ✅ Use your axios instance

function useSignUp() {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullname, username, password, confirmPassword, gender }) => {
		const success = handleInputError({ fullname, username, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			const res = await API.post("/api/auth/register", {
				fullname,
				username,
				password,
				confirmPassword,
				gender
			});

			const data = res.data;

			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
			toast.success("Signup successful!");

		} catch (error) {
			const message = error?.response?.data?.error || error.message || "Signup failed";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
}

export default useSignUp;

function handleInputError({ fullname, username, password, confirmPassword, gender }) {
	if (!fullname || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}
	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}
	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}
	return true;
}
