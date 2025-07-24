import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async ({ message, repliedTo = null }) => {
    if (!selectedConversation) {
      toast.error("No conversation selected!");
      return null;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/message/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message, repliedTo }),
        }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
      return data; // return the newly created message
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
