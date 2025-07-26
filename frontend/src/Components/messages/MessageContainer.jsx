import { useEffect } from 'react';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { TiMessages } from 'react-icons/ti';
import useConversation from '../../zustand/useConversation';
import { useAuthContext } from '../../Context/AuthContext';
import Profile from "../../Pages/profile/Profile"
import API from "../../Api/api";
import { useNavigate } from 'react-router-dom';

function MessageContainer() {
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
		return () => {
			if (setSelectedConversation) setSelectedConversation(null);
		};
	}, [setSelectedConversation]);

	const formatLastSeen = (timestamp) => {
		if (!timestamp) return "Offline";

		const lastSeenDate = new Date(timestamp);
		const now = new Date();

		const isToday = lastSeenDate.toDateString() === now.toDateString();
		const timeStr = lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

		if (isToday) return `last seen today at ${timeStr}`;
		return `last seen on ${lastSeenDate.toLocaleDateString()} at ${timeStr}`;
	};

	useEffect(() => {
		const markMessagesAsSeen = async () => {
			if (!selectedConversation?._id) return;

			try {
				await API.put(`/api/message/seen/${selectedConversation._id}`);
				// ✅ This will re-trigger your useGetMessages since it depends on selectedConversation._id
				// But if your Zustand doesn't refetch messages on update, manually do this:
				// setMessages((prev) => [...prev]) to force state update (if needed)
			} catch (err) {
				console.error("Error marking messages as seen:", err);
			}
		};

		markMessagesAsSeen();
	}, [selectedConversation?._id]);


	return (
		<div className='w-full flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					<div className='bg-red-950 px-4 py-2 rounded-lg ml-2 my-8 flex items-center gap-3'>
						<img
							src={selectedConversation?.profilePic}
							alt="Profile"
							className="w-10 h-10 bg-yellow-700 rounded-full"
						/>
						<div>
							<p className='text-red-700 font-bold'>{selectedConversation?.fullname}</p>
							<p className='text-sm text-gray-300'>
								{formatLastSeen(selectedConversation?.lastSeen)}
							</p>
						</div>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
}

export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	const navigate = useNavigate(); // ✅ Hook

	return (
		<div className='flex items-center justify-center w-full h-full'>
				<img
				src={authUser?.profilePic}
				alt={authUser.fullname}
				onClick={() => navigate("/profile")} // ✅ Correct usage
				className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
				/>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👏 {authUser?.fullname || "User"} </p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};
