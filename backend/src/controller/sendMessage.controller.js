import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import User from "../models/user.model.js";

// Send message to a user
export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
			isSeen: false,
		});

		
		conversation.messages.push(newMessage._id);
		
		await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });
		
		await Promise.all([conversation.save(), newMessage.save()]);

		// Emit real-time new message event to receiver
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.error("Error in sendMessage:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get all messages between current user and another
export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages");

		if (!conversation) return res.status(200).json([]);

		res.status(200).json(conversation.messages);
	} catch (error) {
		console.error("Error in getMessages:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Mark all unseen messages from a sender as seen
export const markMessagesAsSeen = async (req, res) => {
	try {
		const receiverId = req.user._id;
		const senderId = req.params.senderId;

		await Message.updateMany(
			{ receiverId, senderId, isSeen: false },
			{ $set: { isSeen: true } }
		);

		// Emit to sender that their messages were seen
		const senderSocketId = getReceiverSocketId(senderId);
		if (senderSocketId) {
			io.to(senderSocketId).emit("messagesSeen", { by: receiverId });
		}

		res.status(200).json({ message: "Messages marked as seen" });
	} catch (err) {
		console.error("Error in markMessagesAsSeen:", err.message);
		res.status(500).json({ error: err.message });
	}
};

export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  try {
    const message = await Message.findById(messageId);

    if (!message) return res.status(404).json({ error: "Message not found" });

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Soft delete: show "message deleted"
    message.message = "This message was deleted";
    message.deleted = true;
    await message.save();

    res.status(200).json({ message: "Message deleted", updatedMessage: message });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { newText } = req.body;
  const userId = req.user._id;

  try {
    const message = await Message.findById(messageId);

    if (!message) return res.status(404).json({ error: "Message not found" });

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    message.message = newText;
    message.edited = true;
    await message.save();

    res.status(200).json({ message: "Message edited", updatedMessage: message });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
