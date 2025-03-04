import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async () => {
            if (!selectedConversation?._id) return; // ✅ Prevent API call if no conversation is selected
            setLoading(true);

            try {
                const res = await fetch(`http://localhost:3000/api/message/${selectedConversation._id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();

                console.log("Fetched messages:", data); // ✅ Debug API response

                if (data.error) {
                    throw new Error(data.error);
                }

                if (!Array.isArray(data)) {
                    throw new Error("Unexpected API response: messages should be an array.");
                }

                setMessages(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getMessages();
    }, [selectedConversation?._id, setMessages]);

    return { messages: messages || [], loading }; // ✅ Ensure messages is always an array
};

export default useGetMessages;
