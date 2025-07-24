import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages : [],
	setMessages: (messages) => set({ messages }),

	replyingToMessage: null,
	setReplyingToMessage: (message) => set({ replyingToMessage: message }),
	clearReplyingToMessage: () => set({ replyingToMessage: null }),
	
}));

export default useConversation;