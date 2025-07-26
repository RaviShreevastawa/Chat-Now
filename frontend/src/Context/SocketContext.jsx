import { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import useConversationStore  from "../zustand/useConversation";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [typingUsers, setTypingUsers] = useState([]);
	const { authUser } = useAuthContext();
	const { setConversations } = useConversationStore();
	const timeoutRef = useRef(null);

	useEffect(() => {
		if (authUser) {
			const newSocket = io("https://chat-now-1-3o18.onrender.com", {
				query: { userId: authUser._id },
			});
			setSocket(newSocket);

			newSocket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			newSocket.on("messagesSeen", ({ receiverId }) => {
				setConversations((prev) =>
					prev.map((convo) => {
						if (convo._id === receiverId) {
							convo.messages = convo.messages.map((m) => ({ ...m, isSeen: true }));
						}
						return convo;
					})
				);
			});

			newSocket.on("user-typing", ({ from }) => {
				setTypingUsers((prev) => [...new Set([...prev, from])]);
				clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(() => {
					setTypingUsers((prev) => prev.filter((u) => u !== from));
				}, 3000);
			});

			return () => {
				newSocket.close();
				setSocket(null);
			};
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers, typingUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
