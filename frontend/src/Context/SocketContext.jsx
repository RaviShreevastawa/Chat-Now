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
	const timeoutRef = useRef({}); // Change to object to handle multiple users separately

	useEffect(() => {
		if (!authUser) {
			if (socket) {
				socket.disconnect();
				setSocket(null);
			}
			return;
		}

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
				prevConvos.map((convo) => {
					if (convo._id === receiverId) {
						const updatedMessages = convo.messages.map((m) => ({
							...m,
							isSeen: true,
						}));
						return { ...convo, messages: updatedMessages };
					}
					return convo;
				})
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

		// Cleanup on component unmount or authUser change
		return () => {
			newSocket.disconnect();
			setSocket(null);
			setTypingUsers([]);
			setOnlineUsers([]);
		};
	}, [authUser]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers, typingUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
