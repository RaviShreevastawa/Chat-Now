import { Server } from "socket.io";
import http from "http";
import express from "express";
import  User  from "../models/user.model.js"; // Make sure this path is correct
import  Message  from "../models/message.model.js"; // Make sure this path is correct

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
	console.log("✅ User connected:", socket.id);

	const userId = socket.handshake.query.userId;

	if (userId && userId !== "undefined") {
		userSocketMap[userId] = socket.id;
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	}

	socket.on("markSeen", async ({ senderId, receiverId }) => {
		try {
			await Message.updateMany(
				{ sender: senderId, receiver: receiverId, isSeen: false },
				{ isSeen: true }
			);
			const senderSocketId = getReceiverSocketId(senderId);
			if (senderSocketId) {
				io.to(senderSocketId).emit("messagesSeen", { receiverId });
			}
		} catch (error) {
			console.error("Error marking messages as seen:", error);
		}
	});

	socket.on("disconnect", async () => {
		console.log("❌ User disconnected:", socket.id);

		// Clean up userSocketMap and update lastSeen
		if (userId && userId !== "undefined") {
			delete userSocketMap[userId];
			try {
				await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
			} catch (error) {
				console.error("Error updating lastSeen:", error);
			}
			io.emit("getOnlineUsers", Object.keys(userSocketMap));
		}
	});
});

export { app, io, server };
