import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../Api/api"; // ✅ Import your axios instance

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await API.get("/api/users");

				const data = res.data;

				if (data.error) {
					throw new Error(data.error);
				}

				setConversations(data);
			} catch (error) {
				const message = error?.response?.data?.error || error.message || "Failed to fetch users";
				toast.error(message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};

export default useGetConversations;
