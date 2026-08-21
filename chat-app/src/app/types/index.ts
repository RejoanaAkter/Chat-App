export interface User {
  id: string;
  name: string;
  phone: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
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