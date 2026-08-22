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
  FaComments,
  FaBars,
  FaTimes
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
  const [groupSearchTerm, setGroupSearchTerm] = useState('')
  const [groupSearchResults, setGroupSearchResults] = useState<User[]>([])
  const [groupSearching, setGroupSearching] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(true)

  // Group search function
  const searchGroupUsers = async (query: string) => {
    if (!query.trim()) {
      setGroupSearchResults([])
      return
    }
    setGroupSearching(true)
    try {
      const searchLower = query.toLowerCase().trim()
      const filtered = allUsers.filter((u: any) => {
        const nameMatch = u.name?.toLowerCase().includes(searchLower)
        const phoneMatch = u.phone?.toLowerCase().includes(searchLower)
        return nameMatch || phoneMatch
      })
      const currentUserId = user?._id
      const final = filtered.filter((u: any) => 
        (u._id || u.id) !== currentUserId && 
        !groupParticipants.find(p => (p._id || p.id) === (u._id || u.id))
      )
      setGroupSearchResults(final)
    } catch (err) {
      console.error('Error searching group users:', err)
    } finally {
      setGroupSearching(false)
    }
  }

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

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [conversationId])

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
      setSidebarOpen(false)
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
        setSidebarOpen(false)
      }
    } catch (err) {
      alert('Failed to start conversation')
    }
  }

  const createGroup = async () => {
    if (!groupName.trim() || groupParticipants.length === 0) {
      alert('Please provide group name and at least one participant')
      return
    }

    try {
      const response = await api.post('/conversations/group', {
        name: groupName,
        participantIds: groupParticipants.map(p => p._id || p.id)
      })
      console.log('👥 Group Created:', response.data)
      setShowGroupModal(false)
      setGroupName('')
      setGroupParticipants([])
      setGroupSearchTerm('')
      setGroupSearchResults([])
      await fetchConversations()
      
      const convId = response.data?.id || response.data?._id || response.data?.conversation?.id
      if (convId) {
        router.push(`/chat/${convId}`)
        setSidebarOpen(false)
      }
    } catch (err) {
      console.error('Error creating group:', err)
      alert('Failed to create group. Please try again.')
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
    <div className="flex h-screen bg-[#e8f0f5] overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        w-full max-w-[380px] 
        md:min-w-[380px]
        fixed md:relative
        z-50 h-full
        bg-white
        border-r border-[#dce8ef]/60 
        flex flex-col
        transition-transform duration-300 ease-in-out
        shadow-xl md:shadow-none
      `}>
        {/* Mobile close button */}
        <div className="md:hidden absolute top-4 right-4 z-10">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 bg-white/90 rounded-lg shadow-lg text-[#2c3e50] hover:bg-[#f0f5f8] transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="p-4 sm:p-5 border-b border-[#dce8ef]/40 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-[#7ab8d4] to-[#5ba3c9] rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm shadow-[#7ab8d4]/20 flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#2c3e50] text-sm sm:text-base truncate">{user?.name || 'User'}</p>
                <p className="text-xs sm:text-sm text-[#8aa8bc] truncate">{user?.phone || ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#8aa8bc] hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg flex-shrink-0"
            >
              <FaSignOutAlt className="text-xs sm:text-sm" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-2 flex-shrink-0">
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="w-full bg-[#f0f5f8] hover:bg-[#e8f0f5] text-[#2c3e50] py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#dce8ef]/40"
          >
            <FaPlus className="text-[#5ba3c9] text-xs" />
            {showNewChat ? 'Cancel' : 'New Conversation'}
          </button>
          <button
            onClick={() => setShowGroupModal(true)}
            className="w-full bg-[#f0f5f8] hover:bg-[#e8f0f5] text-[#2c3e50] py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#dce8ef]/40"
          >
            <FaUsers className="text-[#5ba3c9] text-xs" />
            Create Group
          </button>
        </div>

        {showNewChat && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex-shrink-0">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8aa8bc] text-xs sm:text-sm" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  searchUsers(e.target.value)
                }}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-[#f0f5f8] border border-[#dce8ef]/60 rounded-lg focus:border-[#7ab8d4] focus:ring-2 focus:ring-[#7ab8d4]/20 outline-none transition-all duration-300 text-xs sm:text-sm text-[#2c3e50] placeholder:text-[#8aa8bc]"
              />
            </div>
            {searching && (
              <div className="flex justify-center mt-2">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-[#5ba3c9] border-t-transparent"></div>
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-[#dce8ef]/60 rounded-lg max-h-40 sm:max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result._id || result.id}
                    onClick={() => startDirectConversation(result._id || result.id)}
                    className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-[#f0f5f8] cursor-pointer transition-colors border-b border-[#dce8ef]/40 last:border-0"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#7ab8d4]/30 to-[#5ba3c9]/30 rounded-lg flex items-center justify-center text-[#5ba3c9] font-semibold text-xs sm:text-sm flex-shrink-0">
                      {getInitials(result.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#2c3e50] text-xs sm:text-sm truncate">{result.name}</p>
                      <p className="text-[10px] sm:text-xs text-[#8aa8bc] truncate">{result.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-2">
          <p className="text-[10px] sm:text-xs text-[#8aa8bc] font-medium px-2 sm:px-3 py-1 sm:py-2">Chats</p>
          {convLoading ? (
            <div className="flex items-center justify-center h-16 sm:h-20">
              <FaSpinner className="animate-spin text-[#5ba3c9] text-lg sm:text-xl" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-[#8aa8bc]">
              <FaRegComment className="text-2xl sm:text-3xl mb-1 sm:mb-2 opacity-40" />
              <p className="text-xs sm:text-sm font-medium">No conversations yet</p>
              <p className="text-[10px] sm:text-xs">Start a new conversation</p>
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
                  className={`flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#7ab8d4]/10 to-[#5ba3c9]/10 border border-[#7ab8d4]/30' 
                      : 'hover:bg-[#f0f5f8]'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base ${
                    isActive 
                      ? 'bg-gradient-to-br from-[#7ab8d4] to-[#5ba3c9] text-white shadow-sm shadow-[#7ab8d4]/20' 
                      : 'bg-gradient-to-br from-[#7ab8d4]/30 to-[#5ba3c9]/30 text-[#5ba3c9]'
                  }`}>
                    {getInitials(name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium truncate text-xs sm:text-sm ${isActive ? 'text-[#5ba3c9]' : 'text-[#2c3e50]'}`}>
                        {name}
                      </p>
                      {conv.lastMessage?.createdAt && (
                        <span className="text-[10px] sm:text-xs text-[#8aa8bc] whitespace-nowrap ml-1 sm:ml-2">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#8aa8bc] truncate">{lastMsg}</p>
                  </div>
                  {!isActive && <FaChevronRight className="text-[#8aa8bc] text-[10px] sm:text-xs opacity-40 flex-shrink-0" />}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white w-full min-w-0">
        {/* Chat Header */}
        <div className="p-3 sm:p-4 border-b border-[#dce8ef]/40 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 sm:p-2 hover:bg-[#f0f5f8] rounded-lg transition-colors text-[#2c3e50]"
            >
              <FaBars className="text-sm sm:text-base" />
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="p-1.5 sm:p-2 hover:bg-[#f0f5f8] rounded-lg transition-colors text-[#8aa8bc] hover:text-[#2c3e50] hidden sm:block"
            >
              <FaArrowLeft className="text-sm" />
            </button>
            
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#7ab8d4]/30 to-[#5ba3c9]/30 rounded-xl flex items-center justify-center text-[#5ba3c9] font-semibold text-sm sm:text-base flex-shrink-0">
              {conversationName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-[#2c3e50] text-sm sm:text-base truncate">{conversationName}</h2>
              <p className="text-[10px] sm:text-xs text-[#8aa8bc]">{messages.length} messages</p>
            </div>
          </div>
          <button 
            onClick={fetchMessages} 
            className="text-[#8aa8bc] hover:text-[#5ba3c9] transition-colors p-1.5 sm:p-2 hover:bg-[#f0f5f8] rounded-lg flex-shrink-0"
          >
            <FaSpinner className={`text-xs sm:text-sm ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-[#f8fafc]"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#8aa8bc]">
              <FaComments className="text-3xl sm:text-4xl mb-2 sm:mb-3 opacity-30" />
              <p className="text-xs sm:text-sm font-medium">No messages yet</p>
              <p className="text-[10px] sm:text-xs">Say hello! 👋</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender?._id === (user?._id || JSON.parse(localStorage.getItem('user') || '{}')._id)
              return (
                <div
                  key={message.id || index}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    {!isOwn && (
                      <p className="text-[10px] sm:text-xs text-[#8aa8bc] mb-0.5 sm:mb-1 ml-1 truncate">{message.sender?.name || 'Unknown'}</p>
                    )}
                    <div className={isOwn 
                      ? 'bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] text-white rounded-2xl rounded-tr-sm px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm shadow-[#7ab8d4]/20' 
                      : 'bg-white border border-[#dce8ef]/60 text-[#2c3e50] rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm'
                    }>
                      <p className="text-xs sm:text-sm leading-relaxed break-words">{message.content}</p>
                      <p className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 ${isOwn ? 'text-white/70' : 'text-[#8aa8bc]'}`}>
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
        <form onSubmit={sendMessage} className="p-3 sm:p-4 border-t border-[#dce8ef]/40 bg-white flex-shrink-0">
          <div className="flex space-x-1.5 sm:space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#f0f5f8] border border-[#dce8ef]/60 rounded-lg focus:border-[#7ab8d4] focus:ring-2 focus:ring-[#7ab8d4]/20 outline-none transition-all duration-300 text-xs sm:text-sm text-[#2c3e50] placeholder:text-[#8aa8bc]"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] hover:from-[#6aaac7] hover:to-[#4a96b8] text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#7ab8d4]/20 hover:shadow-md flex-shrink-0"
            >
              {sending ? <FaSpinner className="animate-spin text-xs sm:text-sm" /> : <FaPaperPlane className="text-xs sm:text-sm" />}
            </button>
          </div>
        </form>
      </div>

      {/* Group Modal - Responsive */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl border border-[#dce8ef]/60 shadow-xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#dce8ef]/40">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#7ab8d4] to-[#5ba3c9] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <FaUsers className="text-xs sm:text-sm" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-[#2c3e50] truncate">Create Group</h2>
              </div>
              <button
                onClick={() => {
                  setShowGroupModal(false)
                  setGroupName('')
                  setGroupParticipants([])
                  setGroupSearchTerm('')
                  setGroupSearchResults([])
                }}
                className="text-[#8aa8bc] hover:text-red-500 transition-colors p-1 flex-shrink-0"
              >
                <FaTimes className="text-base sm:text-lg" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#2c3e50] mb-1 sm:mb-1.5">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#f0f5f8] border border-[#dce8ef]/60 rounded-lg focus:border-[#7ab8d4] focus:ring-2 focus:ring-[#7ab8d4]/20 outline-none transition-all duration-300 text-xs sm:text-sm text-[#2c3e50] placeholder:text-[#8aa8bc]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#2c3e50] mb-1 sm:mb-1.5">
                  Add Participants
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-[#8aa8bc] text-xs sm:text-sm" />
                  <input
                    type="text"
                    value={groupSearchTerm}
                    onChange={(e) => {
                      setGroupSearchTerm(e.target.value)
                      searchGroupUsers(e.target.value)
                    }}
                    placeholder="Search users..."
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-[#f0f5f8] border border-[#dce8ef]/60 rounded-lg focus:border-[#7ab8d4] focus:ring-2 focus:ring-[#7ab8d4]/20 outline-none transition-all duration-300 text-xs sm:text-sm text-[#2c3e50] placeholder:text-[#8aa8bc]"
                  />
                </div>
                {groupSearching && (
                  <div className="flex justify-center mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-[#5ba3c9] border-t-transparent"></div>
                  </div>
                )}
                {groupSearchResults.length > 0 && (
                  <div className="mt-2 border border-[#dce8ef]/60 rounded-lg max-h-32 sm:max-h-40 overflow-y-auto">
                    {groupSearchResults.map((result) => (
                      <div
                        key={result._id || result.id}
                        onClick={() => {
                          setGroupParticipants([...groupParticipants, result])
                          setGroupSearchResults([])
                          setGroupSearchTerm('')
                        }}
                        className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-[#f0f5f8] cursor-pointer transition-colors border-b border-[#dce8ef]/40 last:border-0"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#7ab8d4]/30 to-[#5ba3c9]/30 rounded-lg flex items-center justify-center text-[#5ba3c9] font-semibold text-xs sm:text-sm flex-shrink-0">
                          {getInitials(result.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#2c3e50] text-xs sm:text-sm truncate">{result.name}</p>
                          <p className="text-[10px] sm:text-xs text-[#8aa8bc] truncate">{result.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {groupParticipants.length > 0 && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#2c3e50] mb-1 sm:mb-1.5">
                    Selected ({groupParticipants.length})
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {groupParticipants.map((p) => (
                      <span
                        key={p._id || p.id}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-[#7ab8d4]/10 to-[#5ba3c9]/10 border border-[#7ab8d4]/30 rounded-lg text-xs sm:text-sm text-[#2c3e50]"
                      >
                        <span className="truncate max-w-[80px] sm:max-w-none">{p.name}</span>
                        <button
                          onClick={() =>
                            setGroupParticipants(
                              groupParticipants.filter(g => (g._id || g.id) !== (p._id || p.id))
                            )
                          }
                          className="text-[#8aa8bc] hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <FaTimes className="text-[10px] sm:text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-5 border-t border-[#dce8ef]/40">
              <button
                onClick={() => {
                  setShowGroupModal(false)
                  setGroupName('')
                  setGroupParticipants([])
                  setGroupSearchTerm('')
                  setGroupSearchResults([])
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#8aa8bc] hover:text-[#2c3e50] transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                disabled={!groupName.trim() || groupParticipants.length === 0}
                className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] hover:from-[#6aaac7] hover:to-[#4a96b8] text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#7ab8d4]/20 order-1 sm:order-2"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
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