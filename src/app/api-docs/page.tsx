import { 
  FaHome, 
  FaKey, 
  FaUsers, 
  FaComments, 
  FaEnvelope, 
  FaPlug, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaCheckCircle,
  FaPlusCircle,
  FaSearch,
  FaUserPlus,
  FaPaperPlane,
  FaClock
} from 'react-icons/fa'
import { MdHttp } from 'react-icons/md'
import { SiSwagger } from 'react-icons/si'
import Link from 'next/link'

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SiSwagger className="text-2xl text-green-500" />
            <h1 className="text-3xl font-bold text-gray-800">API Documentation</h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            Back to Home
          </Link>
        </div>
        <p className="text-gray-600 mb-8">
          REST API for real-time 1-to-1 and group chat application
        </p>

        {/* Base URL */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-center gap-3">
          <MdHttp className="text-blue-600 text-xl" />
          <p className="text-sm text-blue-800">
            <strong>Base URL:</strong>{' '}
            <code className="bg-blue-100 px-2 py-1 rounded font-mono text-sm">
              https://frontend-task-chatapp.onrender.com/api
            </code>
          </p>
        </div>

        {/* Authentication */}
        <section className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaKey className="text-green-600 text-xl" />
            <h2 className="text-2xl font-semibold text-gray-800">Authentication</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">POST</span>
              <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">/auth/login</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Login or register a new user</p>
            <div className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Request:</p>
              <pre className="font-mono text-sm">{`{
  "phone": "+1234567890",
  "name": "John Doe"
}`}</pre>
              <p className="text-gray-400 mt-3 mb-2">Response:</p>
              <pre className="font-mono text-sm">{`{
  "user": {
    "_id": "string",
    "phone": "string",
    "name": "string"
  },
  "token": "jwt_token_here"
}`}</pre>
            </div>
          </div>
        </section>

        {/* Users */}
        <section className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaUsers className="text-blue-600 text-xl" />
            <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded">GET</span>
              <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">/users/search?search={'{query}'}</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Search users by name or phone number</p>
            <div className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Response:</p>
              <pre className="font-mono text-sm">{`{
  "users": [
    {
      "_id": "string",
      "name": "string",
      "phone": "string"
    }
  ]
}`}</pre>
            </div>
          </div>
        </section>

        {/* Conversations */}
        <section className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaComments className="text-purple-600 text-xl" />
            <h2 className="text-2xl font-semibold text-gray-800">Conversations</h2>
          </div>

          {/* GET Conversations */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded">GET</span>
              <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">/conversations</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Get all conversations for the authenticated user</p>
            <div className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Response:</p>
              <pre className="font-mono text-sm">{`{
  "conversations": [
    {
      "_id": "string",
      "name": "string (optional - for groups)",
      "participants": [...],
      "lastMessage": {
        "text": "string",
        "createdAt": "ISO datetime"
      }
    }
  ]
}`}</pre>
            </div>
          </div>

          {/* POST Conversation */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">POST</span>
              <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">/conversations</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Start a 1-on-1 conversation</p>
            <div className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Request:</p>
              <pre className="font-mono text-sm">{`{
  "userId": "user_id_here"
}`}</pre>
            </div>
          </div>

          {/* POST Group */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">POST</span>
              <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">/conversations/group</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Create a group conversation</p>
            <div className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Request:</p>
              <pre className="font-mono text-sm">{`{
  "name": "Project Team",
  "participantIds": ["user_id_1", "user_id_2"]
}`}</pre>
            </div>
          </div>
        </section>

        {/* Messages */}
        <section className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaEnvelope className="text-pink-600 text-xl" />
            <h2 className="text-2xl font-semibold text-gray-800">Messages</h2>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded">GET</span>
              <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">/conversations/{'{id}'}/messages</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Get message history for a conversation</p>
            <div className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Response:</p>
              <pre className="font-mono text-sm">{`{
  "messages": [
    {
      "_id": "string",
      "text": "string",
      "sender": {
        "_id": "string",
        "name": "string"
      },
      "createdAt": "ISO datetime"
    }
  ]
}`}</pre>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">POST</span>
              <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">/messages</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Send a message to a conversation</p>
            <div className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Request:</p>
              <pre className="font-mono text-sm">{`{
  "conversationId": "conversation_id",
  "text": "Hello!"
}`}</pre>
            </div>
          </div>
        </section>

        {/* WebSocket */}
        <section className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaPlug className="text-orange-600 text-xl" />
            <h2 className="text-2xl font-semibold text-gray-800">WebSocket (Socket.io)</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-mono bg-gray-200 px-3 py-2 rounded mb-3">
              io('https://frontend-task-chatapp.onrender.com', {'{ auth: { token } }'})
            </p>
            <div className="space-y-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                <FaPaperPlane className="text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Client → Server:</p>
                  <code className="text-xs bg-green-100 px-2 py-0.5 rounded font-mono">
                    message:send {'{ conversationId, text }'}
                  </code>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
                <FaCheckCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Server → Client:</p>
                  <code className="text-xs bg-blue-100 px-2 py-0.5 rounded font-mono">
                    message:new
                  </code>
                  <span className="text-xs text-gray-600 ml-1">- New message arrived</span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
                <FaCheckCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Server → Client:</p>
                  <code className="text-xs bg-blue-100 px-2 py-0.5 rounded font-mono">
                    conversation:updated
                  </code>
                  <span className="text-xs text-gray-600 ml-1">- Group changed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-yellow-600 text-xl" />
            <h2 className="text-2xl font-semibold text-gray-800">Error Handling</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-green-100 text-green-800 p-2 rounded flex items-center gap-2">
                <FaCheckCircle className="text-green-600" /> 200 - Success
              </div>
              <div className="bg-green-100 text-green-800 p-2 rounded flex items-center gap-2">
                <FaPlusCircle className="text-green-600" /> 201 - Created
              </div>
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded">400 - Bad Request</div>
              <div className="bg-red-100 text-red-800 p-2 rounded">401 - Unauthorized</div>
              <div className="bg-red-100 text-red-800 p-2 rounded">403 - Forbidden</div>
              <div className="bg-red-100 text-red-800 p-2 rounded">404 - Not Found</div>
              <div className="bg-red-100 text-red-800 p-2 rounded col-span-2">500 - Server Error</div>
            </div>
            <div className="mt-3 bg-gray-900 text-white p-4 rounded-lg text-sm">
              <p className="text-gray-400 mb-2">Error Response Format:</p>
              <pre className="font-mono text-sm">{`{
  "message": "Error description here"
}`}</pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            <FaKey className="text-xs text-gray-400" />
            All endpoints except <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">/auth/login</code> require JWT token
          </p>
          <p className="mt-1 flex items-center justify-center gap-1">
            <FaCheckCircle className="text-xs text-gray-400" />
            Authorization: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">Bearer &lt;your-jwt-token&gt;</code>
          </p>
        </div>
      </div>
    </div>
  )
}