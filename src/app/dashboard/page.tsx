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
  FaUserPlus,
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
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetchConversations()
    // Close sidebar on mobile by default
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
      if (convId) router.push(`/chat/${convId}`)
    } catch (err) {
      alert('Failed to start conversation')
    }
  }

  const handleConversationClick = (conv: Conversation) => {
    const convId = conv.id || conv._id
    if (convId && convId !== 'undefined') {
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

  return (
    <div className="flex h-screen bg-[#e8f0f5] overflow-hidden">
      {/* Mobile overlay */}
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

        {/* Header */}
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

        {/* Actions */}
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

        {/* Search */}
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
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-2">
          <p className="text-[10px] sm:text-xs text-[#8aa8bc] font-medium px-2 sm:px-3 py-1 sm:py-2">Chats</p>
          {loading ? (
            <div className="flex items-center justify-center h-16 sm:h-20">
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-[#5ba3c9] border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-[#8aa8bc] p-3 sm:p-4">
              <p className="text-center text-xs sm:text-sm">{error}</p>
              <button onClick={fetchConversations} className="text-[#5ba3c9] text-xs sm:text-sm mt-2 hover:underline">
                Try again
              </button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-[#8aa8bc]">
              <FaRegComment className="text-2xl sm:text-3xl mb-1 sm:mb-2 opacity-40" />
              <p className="text-xs sm:text-sm font-medium">No conversations yet</p>
              <p className="text-[10px] sm:text-xs">Start a new conversation!</p>
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
                  className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg hover:bg-[#f0f5f8] cursor-pointer transition-all duration-200"
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-[#7ab8d4]/30 to-[#5ba3c9]/30 rounded-xl flex items-center justify-center text-[#5ba3c9] font-semibold flex-shrink-0 text-sm sm:text-base">
                    {getInitials(name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[#2c3e50] truncate text-xs sm:text-sm">{name}</p>
                      {conv.lastMessage?.createdAt && (
                        <span className="text-[10px] sm:text-xs text-[#8aa8bc] whitespace-nowrap ml-1 sm:ml-2">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#8aa8bc] truncate">{lastMsg}</p>
                  </div>
                  <FaChevronRight className="text-[#8aa8bc] text-[10px] sm:text-xs opacity-40 flex-shrink-0" />
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Main Content - Empty State */}
      <div className="flex-1 flex items-center justify-center bg-[#e8f0f5] p-4">
        <div className="text-center">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white rounded-lg shadow-lg text-[#2c3e50] hover:bg-[#f0f5f8] transition-colors"
          >
            <FaBars className="text-lg" />
          </button>
          
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#7ab8d4]/20 to-[#5ba3c9]/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FaCommentDots className="text-2xl sm:text-3xl text-[#5ba3c9]" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#2c3e50]">Your messages</h2>
          <p className="text-xs sm:text-sm text-[#8aa8bc] mt-1">Select a conversation to start chatting</p>
        </div>
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

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}