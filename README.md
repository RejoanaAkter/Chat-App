
# 💬 ChatApp 

A modern, real-time chat application built with Next.js 16, TypeScript, and Tailwind CSS. 
---

## Features

### ✅ Completed Features

| Feature | Description |
|---------|-------------|
|  **Login/Registration** | Login with phone number (auto-registration for new users) |
|  **User Search** | Search users by name or phone number |
|  **1-on-1 Chats** | Start direct conversations with any user |
|  **Group Chats** | Create groups with multiple participants |
|  **Real-time Messaging** | Send and receive messages instantly (polling every 3s) |
|  **Message History** | Full conversation history with timestamps |
|  **Auto-scroll** | Automatically scrolls to latest message |
|  **Smart Scroll** | Doesn't force scroll when user scrolls up |
|  **Responsive UI** | Works on desktop, tablet, and mobile |
|  **API Documentation** | Interactive API docs page |
|  **Landing Page** | Creative showcase of the application |

### 🎨 UI/UX Highlights

- Soothing color palette (soft blue-gray theme)
- Glass-morphism effects
- Smooth animations and transitions
- React Icons for better visual hierarchy
- Modern, clean design

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety and better DX |
| **Tailwind CSS** | Styling and responsive design |
| **Axios** | API calls and HTTP client |
| **Socket.io** | Real-time communication |
| **React Icons** | Modern icon library |
| **Vercel** | Hosting and deployment |

---

##  Architecture

### Folder Structure

### Folder Structure

```
chat-app/
├── src/
│   └── app/
│       ├── (auth)/
│       │   └── login/              # Login page
│       ├── api-docs/               # API documentation page
│       ├── chat/                   # Chat interface
│       │   └── [conversationId]/
│       ├── dashboard/              # Main dashboard
│       ├── components/             # Reusable components
│       ├── context/                # React Context providers
│       │   └── AuthContext.tsx
│       ├── services/               # API services
│       │   └── api.ts
│       ├── types/                  # TypeScript interfaces
│       ├── globals.css             # Global styles
│       ├── layout.tsx              # Root layout
│       └── page.tsx                # Landing page
├── docs/
│   └── api-docs.md                 # API Documentation (Markdown)
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── README.md
```



### State Management

- **React Context API** for authentication state
- **Local state** for UI components
- **LocalStorage** for session persistence

### API Integration

- REST API with JWT authentication
- Token stored in localStorage
- Automatic token injection via Axios interceptors
- Real-time polling for message updates

---


---

##  Issues Encountered & Solutions

| Issue | Solution |
|-------|----------|
| API returns `_id` instead of `id` | Updated all interfaces to use `_id` |
| Search API doesn't filter properly | Added client-side filtering |
| `participant` (singular) vs `participants` | Handled both formats in code |
| Message format uses `text` not `content` | Normalized message data |
| User not showing in search | Created users via API login endpoint |
| Hydration errors | Added `suppressHydrationWarning` |
| PostCSS config issues | Updated for Next.js 16 compatibility |

---

##  Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/chat-app-assignment.git
cd chat-app-assignment

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# http://localhost:3000