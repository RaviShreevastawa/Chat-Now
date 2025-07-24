import useConversation from '../../zustand/useConversation';
import { useSocketContext } from '../../Context/SocketContext';
import moment from "moment";

const Conversation = ({ conversation, lastIdx }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const isSelected = selectedConversation?._id === conversation._id;

	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);

	// Define the last seen text here
	const getLastSeenText = () => {
		if (isOnline) return "Online";
		if (conversation.lastSeen) {
			return `Last seen ${moment(conversation.lastSeen).fromNow()}`;
		}
		return "Last seen recently";
	};

	return (
		<>
			<div
				className={`flex gap-5 items-center hover:bg-red-950 rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-red-950" : ""}`}
				onClick={() => setSelectedConversation(conversation)}
			>
				<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div className='w-12 rounded-full'>
						<img
							src={conversation.profilePic}
							alt={conversation.fullname}
							className="w-10 h-10 rounded-full"
						/>
					</div>
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between'>
						<p className='font-bold text-gray-200'>{conversation.fullname}</p>
						<span className='text-xs text-gray-400'>
							{getLastSeenText()}
						</span>
					</div>
				</div>
			</div>

			{!lastIdx && <div className="divider my-0 py-0 h-1" />}
		</>
	);
};

export default Conversation;
