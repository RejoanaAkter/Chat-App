'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../services/api'
import { AuthProvider, useAuth } from '../../context/AuthContext'

interface Conversation {
  id: string
  _id?: string
  name?: string
  participants: { _id: string; name: string; phone?: string }[]
  lastMessage?: { content: string; timestamp: string }
}

interface User {
  _id: string
  name: string
  phone: string
}

function DashboardContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searching, setSearching] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupParticipants, setGroupParticipants] = useState<User[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/conversations')
      
      let conversationsData: Conversation[] = []
      
      if (Array.isArray(response.data)) {
        conversationsData = response.data
      } else if (response.data?.conversations && Array.isArray(response.data.conversations)) {
        conversationsData = response.data.conversations
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        conversationsData = response.data.data
      }
      
      // Ensure each conversation has an id
      conversationsData = conversationsData.map((conv: any) => ({
        ...conv,
        id: conv.id || conv._id || conv.conversationId
      }))
      
      setConversations(conversationsData)
    } catch (err: any) {
      console.error('Error fetching conversations:', err)
      setError('Failed to load conversations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const response = await api.get(`/users/search?search=${query}`)
      
      let usersData: User[] = []
      if (Array.isArray(response.data)) {
        usersData = response.data
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        usersData = response.data.users
      }
      
      const currentUserId = user?._id
      usersData = usersData.filter((u: any) => u._id !== currentUserId)
      
      setSearchResults(usersData)
    } catch (err) {
      console.error('Error searching users:', err)
    } finally {
      setSearching(false)
    }
  }

  const startDirectConversation = async (userId: string) => {
    try {
      const response = await api.post('/conversations', { userId })
      
      setShowNewChat(false)
      setSearchTerm('')
      setSearchResults([])
      await fetchConversations()
      
      const conversationId = response.data?.id || response.data?.conversation?.id || response.data?._id
      if (conversationId) {
        router.push(`/chat/${conversationId}`)
      } else {
        alert('Conversation created but failed to get ID')
      }
    } catch (err) {
      console.error('Error starting conversation:', err)
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
        participantIds: groupParticipants.map(p => p._id)
      })
      
      setShowGroupModal(false)
      setGroupName('')
      setGroupParticipants([])
      await fetchConversations()
      
      const conversationId = response.data?.id || response.data?.conversation?.id || response.data?._id
      if (conversationId) {
        router.push(`/chat/${conversationId}`)
      } else {
        alert('Group created but failed to get ID')
      }
    } catch (err) {
      console.error('Error creating group:', err)
      alert('Failed to create group')
    }
  }

  const getConversationName = (conv: Conversation) => {
    if (conv.name) return conv.name
    const otherParticipants = conv.participants?.filter(p => p._id !== user?._id) || []
    return otherParticipants.length > 0 ? otherParticipants[0].name : 'Unknown'
  }

  const getConversationAvatar = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || '?'
  }

  const getLastMessage = (conv: Conversation) => {
    return conv.lastMessage?.content || 'No messages yet'
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const handleConversationClick = (conv: Conversation) => {
    const convId = conv.id || conv._id
    if (convId && convId !== 'undefined') {
      router.push(`/chat/${convId}`)
    } else {
      alert('This conversation has an invalid ID')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full sm:w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-800 truncate max-w-[120px]">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-gray-500 truncate max-w-[120px]">
                  {user?.phone || ''}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            {showNewChat ? '✕ Cancel' : '💬 New Conversation'}
          </button>
          <button
            onClick={() => setShowGroupModal(true)}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm"
          >
            👥 Create Group
          </button>
        </div>

        {/* Search */}
        {showNewChat && (
          <div className="px-4 pb-4">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                searchUsers(e.target.value)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
            />
            {searching && (
              <div className="mt-2 flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result._id}
                    onClick={() => startDirectConversation(result._id)}
                    className="px-4 py-3 hover:bg-purple-50 cursor-pointer flex items-center space-x-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {result.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{result.name}</p>
                      <p className="text-xs text-gray-500">{result.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {searchTerm && searchResults.length === 0 && !searching && (
              <p className="text-sm text-gray-500 text-center mt-2">No users found</p>
            )}
          </div>
        )}

        {/* Group Modal */}
        {showGroupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create Group</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Project Team"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Participants
                  </label>
                  <input
                    type="text"
                    placeholder="Search users..."
                    onChange={(e) => searchUsers(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  {searchResults.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                      {searchResults
                        .filter(u => u._id !== user?._id)
                        .filter(u => !groupParticipants.find(p => p._id === u._id))
                        .map((result) => (
                          <div
                            key={result._id}
                            onClick={() => {
                              setGroupParticipants([...groupParticipants, result])
                              setSearchResults([])
                            }}
                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center space-x-3 border-b border-gray-100 last:border-0"
                          >
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
                              {result.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{result.name}</p>
                              <p className="text-xs text-gray-500">{result.phone}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {groupParticipants.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {groupParticipants.map((p) => (
                      <span
                        key={p._id}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {p.name}
                        <button
                          onClick={() =>
                            setGroupParticipants(
                              groupParticipants.filter(g => g._id !== p._id)
                            )
                          }
                          className="ml-2 text-purple-500 hover:text-purple-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => {
                      setShowGroupModal(false)
                      setGroupName('')
                      setGroupParticipants([])
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createGroup}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
              <p className="text-center">{error}</p>
              <button
                onClick={fetchConversations}
                className="mt-2 text-purple-600 hover:text-purple-700 text-sm"
              >
                Try again
              </button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <p className="text-4xl mb-2">💭</p>
              <p className="text-center font-medium">No conversations yet</p>
              <p className="text-sm text-center">Start a new conversation or create a group!</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const name = getConversationName(conv)
              const convId = conv.id || conv._id
              return (
                <div
                  key={convId}
                  onClick={() => handleConversationClick(conv)}
                  className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {getConversationAvatar(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-800 truncate">
                          {name}
                        </p>
                        {conv.lastMessage?.timestamp && (
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                            {new Date(conv.lastMessage.timestamp).toLocaleTimeString(
                              [],
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {getLastMessage(conv)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="hidden sm:flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-semibold text-gray-700">Your messages</h2>
          <p className="text-gray-500 mt-2">Select a conversation to start chatting</p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}