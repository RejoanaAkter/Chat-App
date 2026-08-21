export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📚 API Documentation</h1>
          <a
            href="/"
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            ← Back to Home
          </a>
        </div>
        <p className="text-gray-600 mb-8">
          REST API for real-time 1-to-1 and group chat application
        </p>

        {/* Base URL */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            <strong>Base URL:</strong>{' '}
            <code className="bg-blue-100 px-2 py-1 rounded">
              https://frontend-task-chatapp.onrender.com/api
            </code>
          </p>
        </div>

        {/* Authentication */}
        <section className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔐 Authentication</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
              <code className="text-sm font-mono">/auth/login</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Login or register a new user</p>
            <div className="bg-gray-800 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Request:</p>
              <pre>{`{
  "phone": "+1234567890",
  "name": "John Doe"
}`}</pre>
              <p className="text-gray-400 mt-3 mb-2">Response:</p>
              <pre>{`{
  "user": {
    "id": "string",
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
          <h2 className="text-2xl font-semibold mb-4">👤 Users</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
              <code className="text-sm font-mono">/users/search?search={'{query}'}</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Search users by name or phone number</p>
            <div className="bg-gray-800 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Response:</p>
              <pre>{`{
  "users": [
    {
      "id": "string",
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
          <h2 className="text-2xl font-semibold mb-4">💬 Conversations</h2>

          {/* GET Conversations */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
              <code className="text-sm font-mono">/conversations</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Get all conversations for the authenticated user</p>
            <div className="bg-gray-800 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Response:</p>
              <pre>{`{
  "conversations": [
    {
      "id": "string",
      "name": "string (optional - for groups)",
      "participants": [...],
      "lastMessage": {
        "content": "string",
        "timestamp": "ISO datetime"
      }
    }
  ]
}`}</pre>
            </div>
          </div>

          {/* POST Conversation */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
              <code className="text-sm font-mono">/conversations</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Start a 1-on-1 conversation</p>
            <div className="bg-gray-800 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Request:</p>
              <pre>{`{
  "userId": "user_id_here"
}`}</pre>
            </div>
          </div>

          {/* POST Group */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
              <code className="text-sm font-mono">/conversations/group</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Create a group conversation</p>
            <div className="bg-gray-800 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Request:</p>
              <pre>{`{
  "name": "Project Team",
  "participantIds": ["user_id_1", "user_id_2"]
}`}</pre>
            </div>
          </div>
        </section>

        {/* Messages */}
        <section className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">✉️ Messages</h2>

          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
              <code className="text-sm font-mono">/conversations/{'{id}'}/messages</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Get message history for a conversation</p>
            <div className="bg-gray-800 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Response:</p>
              <pre>{`{
  "messages": [
    {
      "id": "string",
      "content": "string",
      "sender": {
        "id": "string",
        "name": "string"
      },
      "timestamp": "ISO datetime"
    }
  ]
}`}</pre>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
              <code className="text-sm font-mono">/conversations/{'{id}'}/messages</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Send a message to a conversation</p>
            <div className="bg-gray-800 text-white p-4 rounded-lg text-sm overflow-x-auto">
              <p className="text-gray-400 mb-2">Request:</p>
              <pre>{`{
  "content": "Hello!"
}`}</pre>
            </div>
          </div>
        </section>

        {/* WebSocket */}
        <section className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔌 WebSocket (Socket.io)</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm font-mono mb-2">
              io('https://frontend-task-chatapp.onrender.com', {'{ auth: { token } }'})
            </p>
            <div className="space-y-2 mt-3">
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <p className="text-sm">
                  <strong>Client → Server:</strong>{' '}
                  <code className="bg-green-100 px-2 py-0.5 rounded text-xs">
                    message:send {'{ conversationId, text }'}
                  </code>
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <p className="text-sm">
                  <strong>Server → Client:</strong>{' '}
                  <code className="bg-blue-100 px-2 py-0.5 rounded text-xs">
                    message:new
                  </code>
                  {' '}- New message arrived
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <p className="text-sm">
                  <strong>Server → Client:</strong>{' '}
                  <code className="bg-blue-100 px-2 py-0.5 rounded text-xs">
                    conversation:updated
                  </code>
                  {' '}- Group changed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">⚠️ Error Handling</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-green-100 text-green-800 p-2 rounded">200 - Success</div>
              <div className="bg-green-100 text-green-800 p-2 rounded">201 - Created</div>
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded">400 - Bad Request</div>
              <div className="bg-red-100 text-red-800 p-2 rounded">401 - Unauthorized</div>
              <div className="bg-red-100 text-red-800 p-2 rounded">403 - Forbidden</div>
              <div className="bg-red-100 text-red-800 p-2 rounded">404 - Not Found</div>
              <div className="bg-red-100 text-red-800 p-2 rounded col-span-2">500 - Server Error</div>
            </div>
            <div className="mt-3 bg-gray-800 text-white p-4 rounded-lg text-sm">
              <p className="text-gray-400 mb-2">Error Response Format:</p>
              <pre>{`{
  "message": "Error description here"
}`}</pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>📌 All endpoints except <code className="bg-gray-100 px-2 py-0.5 rounded">/auth/login</code> require JWT token</p>
          <p className="mt-1">Authorization: <code className="bg-gray-100 px-2 py-0.5 rounded">Bearer &lt;your-jwt-token&gt;</code></p>
        </div>
      </div>
    </div>
  )
}