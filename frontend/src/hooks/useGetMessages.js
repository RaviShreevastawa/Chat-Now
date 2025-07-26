import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import API from "../Api/api"; // ✅ Import the axios instance

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			if (!selectedConversation?._id) return;
			setLoading(true);

			try {
				const res = await API.get(`/api/message/${selectedConversation._id}`);

				const data = res.data;
				console.log("Fetched messages:", data);

				if (!Array.isArray(data)) {
					throw new Error("Unexpected API response: messages should be an array.");
				}

				setMessages(data);
			} catch (error) {
				const msg = error?.response?.data?.error || error.message || "Failed to fetch messages";
				toast.error(msg);
			} finally {
				setLoading(false);
			}
		};

		getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};

export default useGetMessages;
