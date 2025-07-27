import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import useConversationStore from "../zustand/useConversation";

const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [typingUsers, setTypingUsers] = useState([]);
	const { authUser } = useAuthContext();
	const { setConversations } = useConversationStore();
	const timeoutRef = useRef({});

	useEffect(() => {
		if (!authUser) return;

		// Prevent socket reconnecting on intermediate stale state
		if (!authUser._id || authUser._id === "undefined") return;

		console.log("🔌 Socket connect with userId:", authUser._id);

		const newSocket = io(import.meta.env.VITE_API_URL, {
			query: { userId: authUser._id },
			withCredentials: true,
			transports: ["websocket"],
		});

		setSocket(newSocket);

		newSocket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});

		newSocket.on("messagesSeen", ({ receiverId }) => {
			setConversations((prevConvos) =>
				prevConvos.map((convo) =>
					convo._id === receiverId
						? { ...convo, messages: convo.messages.map((m) => ({ ...m, isSeen: true })) }
						: convo
				)
			);
		});

		newSocket.on("user-typing", ({ from }) => {
			setTypingUsers((prev) => [...new Set([...prev, from])]);

			clearTimeout(timeoutRef.current[from]);
			timeoutRef.current[from] = setTimeout(() => {
				setTypingUsers((prev) => prev.filter((u) => u !== from));
				delete timeoutRef.current[from];
			}, 3000);
		});

		return () => {
			console.log("🔌 Disconnecting socket for userId:", authUser._id);
			newSocket.disconnect();
			setSocket(null);
			setOnlineUsers([]);
			setTypingUsers([]);
		};
	}, [authUser?._id]); // <-- only rerun effect when user ID changes


	return (
		<SocketContext.Provider value={{ socket, onlineUsers, typingUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
