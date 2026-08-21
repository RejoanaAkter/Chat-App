export interface User {
  _id: string;
  id?: string;
  name: string;
  phone: string;
  createdAt?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
  };
  timestamp: string;
}

export interface Conversation {
  id: string;
  name?: string;
  participants: User[];
  lastMessage?: {
    content: string;
    timestamp: string;
  };
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface MessagesResponse {
  messages: Message[];
  conversation?: Conversation;
}

export interface UsersSearchResponse {
  users: User[];
}

export interface CreateConversationResponse {
  id: string;
  conversation?: Conversation;
}

export interface SendMessageResponse {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
}