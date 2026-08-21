'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from './../../services/api'
import { AuthProvider, useAuth } from './../../context/AuthContext'

interface Message {
  id: string
  content: string
  sender: { _id: string; name: string }
  timestamp: string
}

function ChatContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const conversationId = params.conversationId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [conversationName, setConversationName] = useState('')
  const [error, setError] = useState('')
  const [isScrolledUp, setIsScrolledUp] = useState(false)
  const [newMessagesCount, setNewMessagesCount] = useState(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!conversationId || conversationId === 'undefined') {
      setError('Invalid conversation ID')
      setLoading(false)
      return
    }
    
    console.log('🔍 Loading conversation:', conversationId)
    fetchMessages()
    
    const interval = setInterval(() => {
      if (isMounted.current && !loading) {
        fetchMessages()
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      console.log('📤 Fetching messages for:', conversationId)
      const response = await api.get(`/conversations/${conversationId}/messages`)
      console.log('📥 Messages response:', response.data)
      
      if (!isMounted.current) return
      
      const data = response.data
      
      let messagesData: Message[] = []
      
      if (data && data.messages) {
        messagesData = data.messages
      } else if (Array.isArray(data)) {
        messagesData = data
      } else if (data && typeof data === 'object') {
        const keys = Object.keys(data)
        for (const key of keys) {
          if (Array.isArray(data[key])) {
            messagesData = data[key]
            break
          }
        }
      }
      
      setMessages(messagesData)
      
      if (data?.conversation) {
        const conv = data.conversation
        if (conv.name) {
          setConversationName(conv.name)
        } else {
          const otherParticipants = conv.participants?.filter((p: any) => p._id !== user?._id) || []
          setConversationName(otherParticipants.length > 0 ? otherParticipants[0].name : 'Unknown')
        }
      }
      
      setError('')
      setLoading(false)
      
    } catch (error: any) {
      console.error('❌ Error fetching messages:', error)
      
      if (!isMounted.current) return
      
      if (error.response?.status === 404) {
        setError('Conversation not found')
      } else if (error.response?.status === 401) {
        setError('Please login again')
        router.push('/auth/login')
      } else {
        setError('Failed to load messages. Please try again.')
      }
      
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    setNewMessagesCount(0)
  }

  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return
    const { scrollTop, scrollHeight, clientHeight } = container
    const atBottom = scrollHeight - scrollTop - clientHeight < 10
    setIsScrolledUp(!atBottom)
    if (atBottom) {
      setNewMessagesCount(0)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending) return
    if (!conversationId || conversationId === 'undefined') {
      alert('Invalid conversation')
      return
    }

    console.log('📝 Sending message:', newMessage.trim())
    setSending(true)
    
    const messageContent = newMessage.trim()
    const tempId = `temp-${Date.now()}`
    
    const tempMessage: Message = {
      id: tempId,
      content: messageContent,
      sender: { _id: user?._id || 'me', name: user?.name || 'You' },
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, tempMessage])
    setNewMessage('')
    scrollToBottom()

    try {
      // ✅ CORRECT: Use /messages endpoint
      console.log('📤 Sending to /messages endpoint')
      const response = await api.post('/messages', {
        conversationId: conversationId,
        content: messageContent
      })
      
      console.log('✅ Message sent:', response.data)
      
      // Refresh messages
      await fetchMessages()
      scrollToBottom()
    } catch (error: any) {
      console.error('❌ Error sending message:', error)
      console.error('Error response:', error.response?.data)
      
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.error?.message || 
                       'Failed to send message. Please try again.'
      
      alert(`Failed to send message: ${errorMsg}`)
      
      setMessages(prev => prev.filter(msg => msg.id !== tempId))
    } finally {
      if (isMounted.current) {
        setSending(false)
      }
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch {
      return 'Invalid time'
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-500">Loading conversation...</p>
        <p className="text-sm text-gray-400 mt-2">Conversation ID: {conversationId}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-90"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col bg-white max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ← Back
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {conversationName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{conversationName || 'Conversation'}</h2>
              <p className="text-sm text-gray-500">
                {messages.length} {messages.length === 1 ? 'message' : 'messages'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-4xl mb-2">💬</p>
              <p>No messages yet</p>
              <p className="text-sm">Say hello! 👋</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender?._id === user?._id
              const isTemp = message.id?.startsWith('temp-')
              return (
                <div
                  key={message.id || index}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    {!isOwn && (
                      <p className="text-xs text-gray-500 mb-1 ml-1">
                        {message.sender?.name || 'Unknown'}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                          : 'bg-white shadow-sm border border-gray-200'
                      } ${isTemp ? 'opacity-70' : ''}`}
                    >
                      <p className="break-words">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-purple-100' : 'text-gray-400'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                        {isTemp && ' ⏳ Sending...'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* New messages notification */}
        {isScrolledUp && newMessagesCount > 0 && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-10"
          >
            ↓ {newMessagesCount} new message{newMessagesCount > 1 ? 's' : ''}
          </button>
        )}

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send'}
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