import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await fetch("http://localhost:3000/api/users", {
					method: "GET",
					credentials: "include", // Send cookies
				});
				const data = await res.json();

				if (data.error) {
					throw new Error(data.error);
				}

				setConversations(data.filtereduser); // Extract the correct array
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};

export default useGetConversations;
