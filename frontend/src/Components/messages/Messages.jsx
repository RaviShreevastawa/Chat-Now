import React from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";

function Messages() {
  const { messages, loading } = useGetMessages(); // Correct variable name

  return (
    <div className="px-4 flex-1 overflow-auto">
      {loading ? (
        <p className="text-center text-gray-300">Loading messages...</p>
      ) : messages.length > 0 ? (
        messages.map((msg) => <Message key={msg._id} message={msg} />)
      ) : (
        <p className="text-center text-gray-500">No messages yet</p>
      )}
    </div>
  );
}

export default Messages;
