import MessageStatusTick from "./MessageStatusTick";

const MessageBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`p-2 max-w-xs rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}>
      <p>{message.text}</p>
      <div className="flex justify-end items-center gap-1">
        <span className="text-[10px] text-gray-300">{new Date(message.createdAt).toLocaleTimeString()}</span>
        {isOwnMessage && <MessageStatusTick isSeen={message.isSeen} />}
      </div>
    </div>
  );
};

export default MessageBubble;