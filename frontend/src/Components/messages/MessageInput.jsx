import React, { useState } from 'react';
import { BsSend } from 'react-icons/bs';
import useSendMessage from '../../hooks/useSendMessage';
import { useSocketContext } from '../../Context/SocketContext';
import useConversation from '../../zustand/useConversation';

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { socket } = useSocketContext();
  const {
    selectedConversation,
    replyMessage,
    setReplyMessage,
    setMessages,
    messages
  } = useConversation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = await sendMessage({
      message,
      repliedTo: replyMessage?._id || null,
    });

    if (newMessage) {
      setMessages([...messages, newMessage]);
    }

    setMessage("");
    setReplyMessage(null);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (socket && selectedConversation?._id) {
      socket.emit("typing", {
        to: selectedConversation._id,
      });
    }
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      {replyMessage && (
        <div className="text-sm text-gray-300 mb-1 border-l-4 border-blue-400 pl-2">
          Replying to: <span className="font-semibold">{replyMessage.message}</span>
          <button
            className="ml-2 text-red-400"
            onClick={() => setReplyMessage(null)}
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-transparent border-b-red-950 text-white"
          placeholder="Send a message"
          value={message}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsSend className="cursor-pointer" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
