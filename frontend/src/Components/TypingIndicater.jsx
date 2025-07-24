const TypingIndicator = ({ typingUsers }) => {
  return (
    <div className="text-sm italic text-gray-600 px-4">
      {typingUsers.length > 0 && `${typingUsers.join(", ")} is typing...`}
    </div>
  );
};

export default TypingIndicator;