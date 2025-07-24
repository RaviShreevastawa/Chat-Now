import { useEffect, useRef, useState } from "react";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../Context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const {
		selectedConversation,
		setMessages,
		setReplyingToMessage,
	} = useConversation();

	const formattedTime = extractTime(message.createdAt);
	const fromMe = message.senderId === authUser._id;
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic || "/default-avatar.png";
	const bubbleBgColor = fromMe ? "bg-red-900" : "bg-gray-700";
	const shakeClass = message.shouldShake ? "shake" : "";

	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(message.message);
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

	const contextMenuRef = useRef();

	// Show context menu on right-click
	const handleContextMenu = (e) => {
		e.preventDefault();
		setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
	};

	// Hide context menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (!contextMenuRef.current?.contains(e.target)) {
				setContextMenu({ visible: false, x: 0, y: 0 });
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const handleDelete = async () => {
		try {
			const res = await fetch(`http://localhost:4000/api/message/${message._id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (res.ok) {
				setMessages((prev) =>
					prev.map((m) =>
						m._id === message._id
							? { ...m, message: "This message was deleted", deleted: true }
							: m
					)
				);
			}
		} catch (err) {
			console.error("Failed to delete:", err);
		}
	};

	const handleEdit = async () => {
		try {
			const res = await fetch(`http://localhost:4000/api/message/${message._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ newMessage: editText }),
			});
			if (res.ok) {
				setMessages((prev) =>
					prev.map((m) =>
						m._id === message._id ? { ...m, message: editText, edited: true } : m
					)
				);
				setIsEditing(false);
			}
		} catch (err) {
			console.error("Failed to edit:", err);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleEdit();
		}
	};

	const handleReply = () => {
		setReplyingToMessage(message);
		setContextMenu({ visible: false, x: 0, y: 0 });
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(message.message);
		setContextMenu({ visible: false, x: 0, y: 0 });
	};

	return (
		<div className={`chat ${chatClassName}`}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img src={profilePic} alt="User Avatar" />
				</div>
			</div>

			{/* Message Bubble with right-click only */}
			<div
				onContextMenu={handleContextMenu}
				className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}
			>
				{message.deleted ? (
					<i>This message was deleted</i>
				) : isEditing ? (
					<input
						value={editText}
						onChange={(e) => setEditText(e.target.value)}
						onKeyDown={handleKeyDown}
						className="text-black p-1 rounded w-full"
					/>
				) : (
					<>
						<span>{message.message}</span>
						{message.edited && <span className="text-[10px] ml-1 opacity-60">(edited)</span>}
					</>
				)}
			</div>

			<div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
				<span>{formattedTime}</span>
				{fromMe && !message.deleted && (
					<>
						{message.isSeen ? (
							<FaCheckDouble className="text-blue-400 text-[12px]" />
						) : (
							<FaCheck className="text-gray-400 text-[12px]" />
						)}
					</>
				)}
			</div>

			{/* Custom Context Menu */}
			{contextMenu.visible && (
				<ul
					ref={contextMenuRef}
					className="absolute bg-gray-800 text-white rounded p-2 text-sm shadow-lg z-50"
					style={{ top: contextMenu.y, left: contextMenu.x }}
				>
					{!message.deleted && fromMe && (
						<li className="px-2 py-1 hover:bg-gray-600 cursor-pointer" onClick={() => setIsEditing(true)}>
							Edit
						</li>
					)}
					{!message.deleted && fromMe && (
						<li className="px-2 py-1 hover:bg-gray-600 cursor-pointer" onClick={handleDelete}>
							Delete
						</li>
					)}
					{!message.deleted && (
						<li className="px-2 py-1 hover:bg-gray-600 cursor-pointer" onClick={handleReply}>
							Reply
						</li>
					)}
					{!message.deleted && (
						<li className="px-2 py-1 hover:bg-gray-600 cursor-pointer" onClick={handleCopy}>
							Copy
						</li>
					)}
				</ul>
			)}
		</div>
	);
};

export default Message;
