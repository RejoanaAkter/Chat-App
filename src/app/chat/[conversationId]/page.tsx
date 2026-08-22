'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from './../../services/api'
import { AuthProvider, useAuth } from './../../context/AuthContext'
import { 
  FaArrowLeft, 
  FaPaperPlane, 
  FaUser, 
  FaUsers, 
  FaPlus, 
  FaSignOutAlt,
  FaSearch,
  FaChevronRight,
  FaRegComment,
  FaSpinner,
  FaComments
} from 'react-icons/fa'

interface Message {
  id: string
  content: string
  sender: { _id: string; name: string }
  timestamp: string
}

interface Conversation {
  id: string
  _id?: string
  name?: string
  participants?: { _id: string; name: string; phone?: string }[]
  participant?: { _id: string; name: string; phone?: string }
  lastMessage?: { text?: string; content?: string; createdAt?: string; timestamp?: string; sender?: any }
}

interface User {
  _id: string
  id?: string
  name: string
  phone: string
}

function ChatContent() {
  const params = useParams()
  const router = useRouter()
  const { user, logout } = useAuth()
  const conversationId = params.conversationId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [conversationName, setConversationName] = useState('Conversation')
  const [error, setError] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [convLoading, setConvLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searching, setSearching] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupParticipants, setGroupParticipants] = useState<User[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  useEffect(() => {
    if (!conversationId || conversationId === 'undefined') {
      setError('Invalid conversation')
      setLoading(false)
      return
    }
    fetchConversations()
    fetchAllUsers()
    fetchMessages()
    const interval = setInterval(() => {
      if (isMounted.current && !loading) {
        fetchMessages()
        fetchConversations()
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    if (conversations.length > 0) {
      const existingConv = conversations.find((c: any) => (c.id || c._id) === conversationId)
      if (existingConv) {
        const name = getConversationName(existingConv)
        if (name && name !== 'Conversation' && name !== 'Unknown') {
          setConversationName(name)
        }
      }
    }
  }, [conversations, conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await api.get('/conversations')
      let conversationsData: Conversation[] = []
      if (response.data?.data && Array.isArray(response.data.data)) {
        conversationsData = response.data.data
      } else if (Array.isArray(response.data)) {
        conversationsData = response.data
      }
      conversationsData = conversationsData.map((conv: any) => ({
        ...conv,
        id: conv.id || conv._id
      }))
      setConversations(conversationsData)
      setConvLoading(false)
      
      if (conversationId) {
        const existingConv = conversationsData.find((c: any) => (c.id || c._id) === conversationId)
        if (existingConv) {
          const name = getConversationName(existingConv)
          if (name && name !== 'Conversation' && name !== 'Unknown') {
            setConversationName(name)
          } else {
            fetchConversationDetails()
          }
        } else {
          fetchConversationDetails()
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setConvLoading(false)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/users/search?search=')
      let usersData: User[] = []
      if (Array.isArray(response.data)) {
        usersData = response.data
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        usersData = response.data.data
      }
      setAllUsers(usersData)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const searchLower = query.toLowerCase().trim()
      const filtered = allUsers.filter((u: any) => {
        const nameMatch = u.name?.toLowerCase().includes(searchLower)
        const phoneMatch = u.phone?.toLowerCase().includes(searchLower)
        return nameMatch || phoneMatch
      })
      const currentUserId = user?._id
      const final = filtered.filter((u: any) => (u._id || u.id) !== currentUserId)
      setSearchResults(final)
    } catch (err) {
      console.error('Error searching:', err)
    } finally {
      setSearching(false)
    }
  }

  const getConversationName = (conv: any) => {
    if (conv.name) return conv.name
    
    let currentUserId = user?._id
    if (!currentUserId) {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          currentUserId = parsed._id || parsed.id
        }
      } catch {}
    }
    
    if (conv.participant) {
      const p = conv.participant
      if (p._id && p._id !== currentUserId) {
        return p.name || 'Unknown'
      }
      if (p.name) {
        return p.name
      }
    }
    
    if (conv.participants && Array.isArray(conv.participants)) {
      const other = conv.participants.filter((p: any) => p._id !== currentUserId)
      if (other.length > 0) {
        return other[0].name || 'Unknown'
      }
      if (conv.participants.length > 0) {
        return conv.participants[0].name || 'Unknown'
      }
    }
    
    if (conv.lastMessage) {
      const sender = conv.lastMessage.sender
      if (sender) {
        if (typeof sender === 'string') {
          if (conv.participants && Array.isArray(conv.participants)) {
            const found = conv.participants.find((p: any) => p._id === sender)
            if (found) return found.name || 'Unknown'
          }
          return 'User ' + sender.slice(-4)
        } else if (sender.name) {
          return sender.name
        }
      }
    }
    
    return 'Unknown'
  }

  const fetchConversationDetails = async () => {
    try {
      const response = await api.get(`/conversations/${conversationId}`)
      const data = response.data
      const conv = data.conversation || data || {}
      
      let name = 'Conversation'
      
      if (conv.name) {
        name = conv.name
      } else {
        let currentUserId = user?._id
        if (!currentUserId) {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            const parsed = JSON.parse(storedUser)
            currentUserId = parsed._id || parsed.id
          }
        }
        
        const participant = conv.participant || conv.participants || []
        if (Array.isArray(participant)) {
          const other = participant.filter((p: any) => p._id !== currentUserId)
          if (other.length > 0) {
            name = other[0].name || 'Conversation'
          }
        } else if (participant && typeof participant === 'object') {
          if (participant._id !== currentUserId) {
            name = participant.name || 'Conversation'
          } else if (participant.name) {
            name = participant.name
          }
        }
      }
      
      setConversationName(name)
      
    } catch (error) {
      console.error('Error fetching conversation details:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`)
      const data = response.data
      let messagesData = data?.messages || data || []
      
      messagesData = messagesData.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.timestamp || 0).getTime()
        const dateB = new Date(b.createdAt || b.timestamp || 0).getTime()
        return dateA - dateB
      })

      let currentUserId = user?._id
      let currentUserName = user?.name
      if (!currentUserId) {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          currentUserId = parsed._id || parsed.id
          currentUserName = parsed.name
        }
      }

      const normalized = messagesData.map((msg: any) => {
        const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender?._id || 'unknown'
        const isOwn = senderId === currentUserId
        
        let senderName = 'Unknown'
        if (typeof msg.sender === 'string') {
          senderName = isOwn ? (currentUserName || 'You') : 'User ' + senderId.slice(-4)
        } else {
          senderName = msg.sender?.name || (isOwn ? (currentUserName || 'You') : 'User ' + senderId.slice(-4))
        }
        
        return {
          id: msg._id || msg.id || `msg-${Date.now()}`,
          content: msg.text || msg.content || '',
          sender: {
            _id: senderId,
            name: senderName
          },
          timestamp: msg.createdAt || msg.timestamp || new Date().toISOString()
        }
      })

      setMessages(normalized)
      setError('')
      setLoading(false)
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      setError('Failed to load messages')
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const content = newMessage.trim()
    const tempId = `temp-${Date.now()}`

    let currentUserId = user?._id
    let currentUserName = user?.name
    if (!currentUserId) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        currentUserId = parsed._id || parsed.id
        currentUserName = parsed.name
      }
    }

    const tempMsg: Message = {
      id: tempId,
      content: content,
      sender: { _id: currentUserId || 'me', name: currentUserName || 'You' },
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, tempMsg])
    setNewMessage('')
    scrollToBottom()

    try {
      await api.post('/messages', {
        conversationId: conversationId,
        text: content
      })
      await fetchMessages()
      await fetchConversations()
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.filter(m => m.id !== tempId))
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return 'Invalid'
    }
  }

  const getInitials = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || '?'
  }

  const getLastMessage = (conv: Conversation) => {
    return conv.lastMessage?.text || conv.lastMessage?.content || 'No messages yet'
  }

  const handleConversationClick = (conv: Conversation) => {
    const convId = conv.id || conv._id
    if (convId && convId !== 'undefined') {
      router.push(`/chat/${convId}`)
    }
  }

  const startDirectConversation = async (userId: string) => {
    try {
      const response = await api.post('/conversations', { userId })
      setShowNewChat(false)
      setSearchTerm('')
      setSearchResults([])
      await fetchConversations()
      const convId = response.data?.id || response.data?._id
      if (convId) {
        router.push(`/chat/${convId}`)
      }
    } catch (err) {
      alert('Failed to start conversation')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  if (loading && convLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#e8f0f5]">
        <FaSpinner className="animate-spin text-[#5ba3c9] text-3xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#e8f0f5] p-4">
        <FaRegComment className="text-5xl text-[#8aa8bc] mb-4" />
        <h2 className="text-xl font-semibold text-[#2c3e50]">Something went wrong</h2>
        <p className="text-[#8aa8bc] text-sm mt-1">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="mt-4 bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-[#7ab8d4]/20 hover:shadow-md">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#e8f0f5]">
      {/* Sidebar */}
      <div className="w-[380px] min-w-[380px] bg-white border-r border-[#dce8ef]/60 flex flex-col">
        <div className="p-5 border-b border-[#dce8ef]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#7ab8d4] to-[#5ba3c9] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-[#7ab8d4]/20">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-[#2c3e50]">{user?.name || 'User'}</p>
                <p className="text-sm text-[#8aa8bc]">{user?.phone || ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#8aa8bc] hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
            >
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="w-full bg-[#f0f5f8] hover:bg-[#e8f0f5] text-[#2c3e50] py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 border border-[#dce8ef]/40"
          >
            <FaPlus className="text-[#5ba3c9] text-xs" />
            {showNewChat ? 'Cancel' : 'New Conversation'}
          </button>
          <button
            onClick={() => setShowGroupModal(true)}
            className="w-full bg-[#f0f5f8] hover:bg-[#e8f0f5] text-[#2c3e50] py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 border border-[#dce8ef]/40"
          >
            <FaUsers className="text-[#5ba3c9] text-xs" />
            Create Group
          </button>
        </div>

        {showNewChat && (
          <div className="px-4 pb-4">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8aa8bc] text-sm" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  searchUsers(e.target.value)
                }}
                className="w-full pl-10 pr-4 py-2 bg-[#f0f5f8] border border-[#dce8ef]/60 rounded-lg focus:border-[#7ab8d4] focus:ring-2 focus:ring-[#7ab8d4]/20 outline-none transition-all duration-300 text-sm text-[#2c3e50] placeholder:text-[#8aa8bc]"
              />
            </div>
            {searching && (
              <div className="flex justify-center mt-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#5ba3c9] border-t-transparent"></div>
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-[#dce8ef]/60 rounded-lg max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result._id || result.id}
                    onClick={() => startDirectConversation(result._id || result.id)}
                    className="flex items-center space-x-3 px-4 py-2.5 hover:bg-[#f0f5f8] cursor-pointer transition-colors border-b border-[#dce8ef]/40 last:border-0"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#7ab8d4]/30 to-[#5ba3c9]/30 rounded-lg flex items-center justify-center text-[#5ba3c9] font-semibold text-sm">
                      {getInitials(result.name)}
                    </div>
                    <div>
                      <p className="font-medium text-[#2c3e50] text-sm">{result.name}</p>
                      <p className="text-xs text-[#8aa8bc]">{result.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="text-xs text-[#8aa8bc] font-medium px-3 py-2">Chats</p>
          {convLoading ? (
            <div className="flex items-center justify-center h-20">
              <FaSpinner className="animate-spin text-[#5ba3c9] text-xl" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#8aa8bc]">
              <FaRegComment className="text-3xl mb-2 opacity-40" />
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="text-xs">Start a new conversation</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const name = getConversationName(conv)
              const convId = conv.id || conv._id
              const lastMsg = getLastMessage(conv)
              const isActive = convId === conversationId
              
              return (
                <div
                  key={convId}
                  onClick={() => handleConversationClick(conv)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#7ab8d4]/10 to-[#5ba3c9]/10 border border-[#7ab8d4]/30' 
                      : 'hover:bg-[#f0f5f8]'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold flex-shrink-0 ${
                    isActive 
                      ? 'bg-gradient-to-br from-[#7ab8d4] to-[#5ba3c9] text-white shadow-sm shadow-[#7ab8d4]/20' 
                      : 'bg-gradient-to-br from-[#7ab8d4]/30 to-[#5ba3c9]/30 text-[#5ba3c9]'
                  }`}>
                    {getInitials(name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium truncate text-sm ${isActive ? 'text-[#5ba3c9]' : 'text-[#2c3e50]'}`}>
                        {name}
                      </p>
                      {conv.lastMessage?.createdAt && (
                        <span className="text-xs text-[#8aa8bc] whitespace-nowrap ml-2">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#8aa8bc] truncate">{lastMsg}</p>
                  </div>
                  {!isActive && <FaChevronRight className="text-[#8aa8bc] text-xs opacity-40" />}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#dce8ef]/40 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-[#f0f5f8] rounded-lg transition-colors text-[#8aa8bc] hover:text-[#2c3e50]"
            >
              <FaArrowLeft className="text-sm" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-[#7ab8d4]/30 to-[#5ba3c9]/30 rounded-xl flex items-center justify-center text-[#5ba3c9] font-semibold">
              {conversationName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="font-semibold text-[#2c3e50]">{conversationName}</h2>
              <p className="text-xs text-[#8aa8bc]">{messages.length} messages</p>
            </div>
          </div>
          <button 
            onClick={fetchMessages} 
            className="text-[#8aa8bc] hover:text-[#5ba3c9] transition-colors p-2 hover:bg-[#f0f5f8] rounded-lg"
          >
            <FaSpinner className={`text-sm ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#8aa8bc]">
              <FaComments className="text-4xl mb-3 opacity-30" />
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs">Say hello! 👋</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender?._id === (user?._id || JSON.parse(localStorage.getItem('user') || '{}')._id)
              return (
                <div
                  key={message.id || index}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    {!isOwn && (
                      <p className="text-xs text-[#8aa8bc] mb-1 ml-1">{message.sender?.name || 'Unknown'}</p>
                    )}
                    <div className={isOwn 
                      ? 'bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm shadow-[#7ab8d4]/20' 
                      : 'bg-white border border-[#dce8ef]/60 text-[#2c3e50] rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm'
                    }>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/70' : 'text-[#8aa8bc]'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-[#dce8ef]/40 bg-white flex-shrink-0">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-[#f0f5f8] border border-[#dce8ef]/60 rounded-lg focus:border-[#7ab8d4] focus:ring-2 focus:ring-[#7ab8d4]/20 outline-none transition-all duration-300 text-sm text-[#2c3e50] placeholder:text-[#8aa8bc]"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-5 py-2.5 bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] hover:from-[#6aaac7] hover:to-[#4a96b8] text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#7ab8d4]/20 hover:shadow-md"
            >
              {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane className="text-sm" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <AuthProvider>
      <ChatContent />
    </AuthProvider>
  )
}