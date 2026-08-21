import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <div className="text-6xl mb-4">💬</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ChatApp</h1>
        <p className="text-gray-600 mb-6">Your modern messaging platform</p>
        <Link
          href="/auth/login"
          className="block w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </div>
    </main>
  )
}