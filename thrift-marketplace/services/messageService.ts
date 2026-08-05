// services/messageService.ts
import { Conversation, Message } from "../types/conversation";
import { CONVERSATIONS, MESSAGES } from "../data/conversations";

export const messageService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    await new Promise((res) => setTimeout(res, 200));
    return CONVERSATIONS.filter((c) => c.participantIds.includes(userId));
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    await new Promise((res) => setTimeout(res, 200));
    return MESSAGES.filter((m) => m.conversationId === conversationId);
  },

  async sendMessage(conversationId: string, senderId: string, receiverId: string, messageText: string): Promise<Message> {
    await new Promise((res) => setTimeout(res, 200));
    const newMessage: Message = {
      id: `msg-${MESSAGES.length + 1}`,
      conversationId,
      senderId,
      receiverId,
      message: messageText,
      timestamp: new Date().toISOString(),
      readStatus: false,
      attachments: [],
    };
    MESSAGES.push(newMessage);
    const conv = CONVERSATIONS.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessage = messageText;
      conv.lastMessageTimestamp = newMessage.timestamp;
    }
    return newMessage;
  },
};