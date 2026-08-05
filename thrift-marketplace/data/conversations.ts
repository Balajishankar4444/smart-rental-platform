// data/conversations.ts
import { Conversation, Message } from "../types/conversation";

export const CONVERSATIONS: Conversation[] = Array.from({ length: 40 }, (_, i) => ({
  id: `conv-${i + 1}`,
  participantIds: [`user-${(i % 50) + 1}`, `user-${((i + 1) % 50) + 1}`],
  lastMessage: `Is this equipment available for pickup this weekend?`,
  lastMessageTimestamp: "2026-08-04T15:30:00Z",
  unreadCount: { [`user-${(i % 50) + 1}`]: 0, [`user-${((i + 1) % 50) + 1}`]: 1 },
  createdAt: "2026-07-01T10:00:00Z",
  updatedAt: "2026-08-04T15:30:00Z",
}));

export const MESSAGES: Message[] = Array.from({ length: 200 }, (_, i) => {
  const convIndex = i % 40;
  const conv = CONVERSATIONS[convIndex];
  return {
    id: `msg-${i + 1}`,
    conversationId: conv.id,
    senderId: conv.participantIds[0],
    receiverId: conv.participantIds[1],
    message: `Hello! Inquiry about listing item #${i + 1}. Let me know your best offer.`,
    timestamp: "2026-08-04T15:30:00Z",
    readStatus: i % 2 === 0,
    attachments: [],
  };
});