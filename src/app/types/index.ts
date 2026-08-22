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