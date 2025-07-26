import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import API from "../Api/api"; // ✅ axios instance

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
      const res = await API.post(`/api/message/send/${selectedConversation._id}`, {
        message,
        repliedTo,
      });

      const data = res.data;
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
      return data; // ✅ return the newly created message
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || "Message failed";
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
