'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from './../services/api'
import { AuthProvider, useAuth } from './../context/AuthContext'
import { 
  FaCommentDots, 
  FaUser, 
  FaUsers, 
  FaSearch, 
  FaPlus, 
  FaSignOutAlt,
  FaChevronRight,
  FaRegComment,
  FaTimes,
  FaBars
} from 'react-icons/fa'

interface Conversation {
  id: string
  _id?: string
  name?: string
  participants?: { _id: string; name: string; phone?: string }[]
  participant?: { _id: string; name: string; phone?: string }
  lastMessage?: { text?: string; content?: string; createdAt?: string; timestamp?: string }
}

interface User {
  _id: string
  id?: string
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
  const [groupSearchTerm, setGroupSearchTerm] = useState('')
  const [groupSearchResults, setGroupSearchResults] = useState<User[]>([])
  const [groupSearching, setGroupSearching] = useState(false)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(true)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError('')
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
    } catch (err: any) {
      setError('Failed to load conversations')
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
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        usersData = response.data.data
      }
      
      const searchLower = query.toLowerCase().trim()
      const filtered = usersData.filter((u: any) => 
        u.name?.toLowerCase().includes(searchLower) || 
        u.phone?.toLowerCase().includes(searchLower)
      )
      
      const currentUserId = user?._id
      const final = filtered.filter((u: any) => (u._id || u.id) !== currentUserId)
      setSearchResults(final)
    } catch (err) {
      console.error('Error searching:', err)
    } finally {
      setSearching(false)
    }
  }

  const searchGroupUsers = async (query: string) => {
    if (!query.trim()) {
      setGroupSearchResults([])
      return
    }
    setGroupSearching(true)
    try {
      const response = await api.get(`/users/search?search=${query}`)
      let usersData: User[] = []
      if (Array.isArray(response.data)) {
        usersData = response.data
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        usersData = response.data.data
      }
      
      const searchLower = query.toLowerCase().trim()
      const filtered = usersData.filter((u: any) => 
        u.name?.toLowerCase().includes(searchLower) || 
        u.phone?.toLowerCase().includes(searchLower)
      )
      
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

  const getConversationName = (conv: any) => {
    if (conv.name) return conv.name
    
    const participant = conv.participant || conv.participants || []
    if (Array.isArray(participant)) {
      const other = participant.filter((p: any) => p._id !== user?._id)
      if (other.length > 0) return other[0].name || 'Unknown'
    } else if (participant && typeof participant === 'object') {
      if (participant._id !== user?._id) return participant.name || 'Unknown'
    }
    return 'Unknown'
  }

  const getInitials = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || '?'
  }

  const getLastMessage = (conv: Conversation) => {
    return conv.lastMessage?.text || conv.lastMessage?.content || 'No messages yet'
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
        // On mobile, close sidebar when navigating to chat
        if (isMobile) {
          setShowMobileSidebar(false)
        }
        router.push(`/chat/${convId}`)
      }
    } catch (err) {
      alert('Failed to start conversation')
    }
  }

  const handleConversationClick = (conv: Conversation) => {
    const convId = conv.id || conv._id
    if (convId && convId !== 'undefined') {
      // On mobile, close sidebar when navigating to chat
      if (isMobile) {
        setShowMobileSidebar(false)
      }
      router.push(`/chat/${convId}`)
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
        if (isMobile) {
          setShowMobileSidebar(false)
        }
        router.push(`/chat/${convId}`)
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

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar)
  }

  return (
    <div className="flex h-screen bg-[#e8f0f5]">
      {/* Mobile Hamburger Menu - Only visible on mobile when sidebar is hidden */}
      {isMobile && !showMobileSidebar && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-[#dce8ef]/60 text-[#2c3e50]"
        >
          <FaBars className="text-lg" />
        </button>
      )}

      {/* Sidebar - Hidden on mobile when showMobileSidebar is false */}
      <div className={`${
        isMobile 
          ? `fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ${
              showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'relative'
        } w-[380px] min-w-[380px] bg-white border-r border-[#dce8ef]/60 flex flex-col shadow-xl`}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex justify-end p-2 border-b border-[#dce8ef]/40">
            <button
              onClick={toggleSidebar}
              className="p-2 text-[#8aa8bc] hover:text-[#2c3e50] transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        )}

        {/* Header */}
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

        {/* Actions */}
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

        {/* Search - Fixed to stay in sidebar */}
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
                autoFocus
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
            {searchTerm && searchResults.length === 0 && !searching && (
              <p className="text-sm text-[#8aa8bc] text-center mt-2">No users found</p>
            )}
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="text-xs text-[#8aa8bc] font-medium px-3 py-2">Chats</p>
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#5ba3c9] border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#8aa8bc] p-4">
              <p className="text-center text-sm">{error}</p>
              <button onClick={fetchConversations} className="text-[#5ba3c9] text-sm mt-2 hover:underline">
                Try again
              </button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#8aa8bc]">
              <FaRegComment className="text-3xl mb-2 opacity-40" />
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="text-xs">Start a new conversation!</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const name = getConversationName(conv)
              const convId = conv.id || conv._id
              const lastMsg = getLastMessage(conv)
              return (
                <div
                  key={convId}
                  onClick={() => handleConversationClick(conv)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-[#f0f5f8] cursor-pointer transition-all duration-200"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-[#7ab8d4]/30 to-[#5ba3c9]/30 rounded-xl flex items-center justify-center text-[#5ba3c9] font-semibold flex-shrink-0">
                    {getInitials(name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[#2c3e50] truncate text-sm">{name}</p>
                      {conv.lastMessage?.createdAt && (
                        <span className="text-xs text-[#8aa8bc] whitespace-nowrap ml-2">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#8aa8bc] truncate">{lastMsg}</p>
                  </div>
                  <FaChevronRight className="text-[#8aa8bc] text-xs opacity-40" />
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Main Content - Empty State */}
      <div className="flex-1 flex items-center justify-center bg-[#e8f0f5]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#7ab8d4]/20 to-[#5ba3c9]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaCommentDots className="text-3xl text-[#5ba3c9]" />
          </div>
          <h2 className="text-xl font-semibold text-[#2c3e50]">Your messages</h2>
          <p className="text-[#8aa8bc] text-sm mt-1">Select a conversation to start chatting</p>
        </div>
      </div>

      {/* Group Modal - Add this if not already present */}
    {/* Group Modal */}
{showGroupModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
    <div className="bg-white rounded-xl border border-[#b0c8d8]/60 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#b0c8d8]/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3a7a9e] to-[#1a5a7e] rounded-lg flex items-center justify-center text-white">
            <FaUsers className="text-sm" />
          </div>
          <h2 className="text-lg font-semibold text-[#0a1a2a]">Create Group</h2>
        </div>
        <button
          onClick={() => {
            setShowGroupModal(false)
            setGroupName('')
            setGroupParticipants([])
            setGroupSearchTerm('')
            setGroupSearchResults([])
          }}
          className="text-[#4a6a7e] hover:text-red-500 transition-colors p-1"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5 space-y-4">
        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-[#0a1a2a] mb-1.5">
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name..."
            className="w-full px-4 py-2.5 bg-[#d8e4ee] border border-[#b0c8d8]/60 rounded-lg focus:border-[#3a7a9e] focus:ring-2 focus:ring-[#3a7a9e]/20 outline-none transition-all duration-300 text-sm text-[#0a1a2a] placeholder:text-[#6a8aa0]"
          />
        </div>

        {/* Add Participants */}
        <div>
          <label className="block text-sm font-medium text-[#0a1a2a] mb-1.5">
            Add Participants
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a6a7e] text-sm" />
            <input
              type="text"
              value={groupSearchTerm}
              onChange={(e) => {
                setGroupSearchTerm(e.target.value)
                searchGroupUsers(e.target.value)
              }}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#d8e4ee] border border-[#b0c8d8]/60 rounded-lg focus:border-[#3a7a9e] focus:ring-2 focus:ring-[#3a7a9e]/20 outline-none transition-all duration-300 text-sm text-[#0a1a2a] placeholder:text-[#6a8aa0]"
            />
          </div>
          {groupSearching && (
            <div className="flex justify-center mt-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#3a7a9e] border-t-transparent"></div>
            </div>
          )}
          {groupSearchResults.length > 0 && (
            <div className="mt-2 border border-[#b0c8d8]/60 rounded-lg max-h-40 overflow-y-auto">
              {groupSearchResults.map((result) => (
                <div
                  key={result._id || result.id}
                  onClick={() => {
                    setGroupParticipants([...groupParticipants, result])
                    setGroupSearchResults([])
                    setGroupSearchTerm('')
                  }}
                  className="flex items-center space-x-3 px-4 py-2.5 hover:bg-[#c8d6e0] cursor-pointer transition-colors border-b border-[#b0c8d8]/40 last:border-0"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#3a7a9e]/30 to-[#1a5a7e]/30 rounded-lg flex items-center justify-center text-[#3a7a9e] font-semibold text-sm">
                    {getInitials(result.name)}
                  </div>
                  <div>
                    <p className="font-medium text-[#0a1a2a] text-sm">{result.name}</p>
                    <p className="text-xs text-[#4a6a7e]">{result.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Participants */}
        {groupParticipants.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-[#0a1a2a] mb-1.5">
              Selected ({groupParticipants.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {groupParticipants.map((p) => (
                <span
                  key={p._id || p.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#3a7a9e]/10 to-[#1a5a7e]/10 border border-[#3a7a9e]/30 rounded-lg text-sm text-[#0a1a2a]"
                >
                  <span>{p.name}</span>
                  <button
                    onClick={() =>
                      setGroupParticipants(
                        groupParticipants.filter(g => (g._id || g.id) !== (p._id || p.id))
                      )
                    }
                    className="text-[#4a6a7e] hover:text-red-500 transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-3 p-5 border-t border-[#b0c8d8]/40">
        <button
          onClick={() => {
            setShowGroupModal(false)
            setGroupName('')
            setGroupParticipants([])
            setGroupSearchTerm('')
            setGroupSearchResults([])
          }}
          className="px-4 py-2 text-sm text-[#4a6a7e] hover:text-[#0a1a2a] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={createGroup}
          disabled={!groupName.trim() || groupParticipants.length === 0}
          className="px-5 py-2 bg-gradient-to-r from-[#3a7a9e] to-[#1a5a7e] hover:from-[#2a6a8e] hover:to-[#0a4a6e] text-white rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#3a7a9e]/20"
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

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}