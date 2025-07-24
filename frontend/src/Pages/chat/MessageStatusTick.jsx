const MessageStatusTick = ({ isSeen }) => {
  return (
    <span className="text-xs text-gray-400">
      {isSeen ? "✓✓" : "✓"}
    </span>
  );
};

export default MessageStatusTick;