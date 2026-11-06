export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface User {
  id: string;
  name: string;
  handle: string; // e.g. @alexvance
  avatarUrl: string;
  status: UserStatus;
  lastSeen?: string;
  bio?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
}

export type MessageType = 'text' | 'image' | 'voice' | 'file' | 'system';
export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface MediaMetadata {
  fileName?: string;
  fileSize?: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  mediaMetadata?: MediaMetadata;
  timestamp: string; // ISO string or display string
  rawTimestamp: number;
  status: MessageDeliveryStatus;
  isEdited?: boolean;
  replyToMessage?: {
    id: string;
    senderName: string;
    snippet: string;
  };
  reactions?: MessageReaction[];
}

export type ChatType = 'direct' | 'group' | 'channel';

export interface Chat {
  id: string;
  type: ChatType;
  title: string;
  avatarUrl?: string;
  participantIds: string[];
  participants: User[];
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  unreadCount: number;
  lastMessage?: Message;
  draft?: string;
  typingUsers?: string[];
  description?: string;
}

export type DeviceFrameType = 'responsive' | 'ios' | 'android' | 'desktop';

export interface AppSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  enterIsSend: boolean;
  readReceipts: boolean;
  twoFactorEnabled: boolean;
  chatWallpaper: 'midnight' | 'navy' | 'clean' | 'slate';
  accentColor: 'blue' | 'indigo' | 'cyan';
}
