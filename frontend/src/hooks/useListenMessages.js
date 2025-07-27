import { useEffect } from "react";
import { useSocketContext } from "../Context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (newMessage) => {
			newMessage.shouldShake = true;
			new Audio(notificationSound).play();
			setMessages((prev) => [...prev, newMessage]);
		};

		socket.on("newMessage", handleNewMessage);

		return () => {
			socket.off("newMessage", handleNewMessage);
		};
	}, [socket, setMessages]);
};

export default useListenMessages;
