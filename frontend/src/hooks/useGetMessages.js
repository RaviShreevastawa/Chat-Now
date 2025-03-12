import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async () => {
            if (!selectedConversation?._id) return;
            setLoading(true);

            try {
                const res = await fetch(`api/message/${selectedConversation._id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();

                console.log("Fetched messages:", data);

                if (!data) throw new Error(data.error);
                

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

    return { messages, loading }; 
};

export default useGetMessages;
