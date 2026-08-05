// types/conversation.ts
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  readStatus: boolean;
  attachments: string[];
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}