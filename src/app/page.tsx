'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { 
  FaCommentDots, 
  FaRocket, 
  FaUsers, 
  FaLock, 
  FaMobile, 
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaGithub,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    { icon: FaRocket, title: 'Real-time Messaging', desc: 'Instant delivery with typing indicators' },
    { icon: FaUsers, title: 'Group Chats', desc: 'Create groups with multiple participants' },
    { icon: FaLock, title: 'Secure & Private', desc: 'End-to-end encrypted conversations' },
    { icon: FaMobile, title: 'Cross-Platform', desc: 'Access from any device, anywhere' },
  ]

  return (
    <div className="min-h-screen bg-[#e8f0f5] overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#dce8ef]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7ab8d4] to-[#5ba3c9] rounded-lg flex items-center justify-center shadow-sm shadow-[#7ab8d4]/20">
              <FaCommentDots className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-[#2c3e50]">ChatApp</span>
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] hover:from-[#6aaac7] hover:to-[#4a96b8] text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm shadow-[#7ab8d4]/20 hover:shadow-md hover:shadow-[#7ab8d4]/30"
          >
            Sign In
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#dce8ef]/60 px-3 py-1.5 rounded-full shadow-sm mb-5">
                <span className="w-1.5 h-1.5 bg-[#5ba3c9] rounded-full animate-pulse"></span>
                <span className="text-xs text-[#8aa8bc] font-medium">Live • Real-time messaging</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2c3e50] leading-[1.1]">
                Connect with anyone,
                <br />
                <span className="bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] bg-clip-text text-transparent">instantly.</span>
              </h1>
              
              <p className="text-[#8aa8bc] text-base max-w-md mt-4 leading-relaxed">
                Experience the future of communication with real-time messaging, group chats, and seamless cross-platform support.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] hover:from-[#6aaac7] hover:to-[#4a96b8] text-white rounded-lg font-medium transition-all duration-300 shadow-sm shadow-[#7ab8d4]/20 hover:shadow-md hover:shadow-[#7ab8d4]/30 text-sm"
                >
                  Get Started Free
                  <FaRocket className="text-xs" />
                </Link>
                <a
                  href="#features"
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#dce8ef] text-[#2c3e50] rounded-lg font-medium hover:bg-[#f0f5f8] transition-all duration-300 text-sm"
                >
                  Learn More
                  <FaArrowRight className="text-xs" />
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#5ba3c9] text-sm" />
                  <span className="text-sm text-[#2c3e50] font-medium">10k+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#5ba3c9] text-sm" />
                  <span className="text-sm text-[#2c3e50] font-medium">99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right - Chat Mockup */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-white rounded-xl border border-[#dce8ef]/60 shadow-md shadow-[#c5dde8]/20 p-4">
                {/* Mockup Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#dce8ef]/40">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#7ab8d4] to-[#5ba3c9] rounded-lg flex items-center justify-center">
                    <FaCommentDots className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2c3e50]">ChatApp</p>
                    <p className="text-xs text-[#8aa8bc]">Online • 2 participants</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <span className="w-2 h-2 bg-[#5ba3c9] rounded-full"></span>
                    <span className="w-2 h-2 bg-[#8aa8bc]/40 rounded-full"></span>
                    <span className="w-2 h-2 bg-[#8aa8bc]/40 rounded-full"></span>
                  </div>
                </div>

                {/* Mockup Messages */}
                <div className="space-y-2.5">
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-[#f0f5f8] rounded-lg rounded-tl-sm px-3 py-2">
                      <p className="text-sm text-[#2c3e50]">Hey! How are you?</p>
                      <p className="text-[10px] text-[#8aa8bc] mt-0.5">12:30 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[75%] bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] rounded-lg rounded-tr-sm px-3 py-2">
                      <p className="text-sm text-white">I'm great! Ready to chat 🚀</p>
                      <p className="text-[10px] text-white/70 mt-0.5 text-right">12:31 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-[#f0f5f8] rounded-lg rounded-tl-sm px-3 py-2">
                      <p className="text-sm text-[#2c3e50]">Perfect! Let's go!</p>
                      <p className="text-[10px] text-[#8aa8bc] mt-0.5">12:32 PM</p>
                    </div>
                  </div>
                </div>

                {/* Mockup Input */}
                <div className="mt-3 pt-3 border-t border-[#dce8ef]/40 flex items-center gap-2">
                  <div className="flex-1 bg-[#f0f5f8] rounded-lg px-3 py-1.5">
                    <p className="text-sm text-[#8aa8bc]">Type a message...</p>
                  </div>
                  <button className="w-8 h-8 bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] rounded-lg flex items-center justify-center text-white text-sm shadow-sm shadow-[#7ab8d4]/20">
                    <FaArrowRight />
                  </button>
                </div>
              </div>

              {/* Floating badges */}
              <div className="flex justify-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm border border-[#dce8ef]/60 rounded-full text-xs text-[#2c3e50] shadow-sm">
                  <FaCheckCircle className="text-[#5ba3c9] text-[10px]" />
                  100% Encrypted
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm border border-[#dce8ef]/60 rounded-full text-xs text-[#2c3e50] shadow-sm">
                  <FaPlay className="text-[#5ba3c9] text-[10px]" />
                  Real-time
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-4 sm:px-6 bg-white/50 backdrop-blur-sm border-t border-[#dce8ef]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#2c3e50]">Everything you need</h2>
            <p className="text-[#8aa8bc] text-sm mt-1">Modern features for seamless communication</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#dce8ef]/60 p-5 text-center hover:shadow-md hover:shadow-[#c5dde8]/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#7ab8d4]/20 to-[#5ba3c9]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="text-[#5ba3c9] text-lg" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2c3e50]">{feature.title}</h3>
                  <p className="text-xs text-[#8aa8bc] mt-1">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-[#dce8ef]/60 shadow-md shadow-[#c5dde8]/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-[#2c3e50]">Ready to start chatting?</h2>
            <p className="text-[#8aa8bc] text-sm mt-1 mb-5">Join thousands of users already connected.</p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#7ab8d4] to-[#5ba3c9] hover:from-[#6aaac7] hover:to-[#4a96b8] text-white rounded-lg font-medium transition-all duration-300 shadow-sm shadow-[#7ab8d4]/20 hover:shadow-md hover:shadow-[#7ab8d4]/30 text-sm"
            >
              Create Account
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 px-4 text-center border-t border-[#dce8ef]/40 bg-white/50">
        <div className="flex items-center justify-center gap-4 mb-2">
          <a href="#" className="text-[#8aa8bc] hover:text-[#5ba3c9] transition-colors">
            <FaGithub className="text-sm" />
          </a>
          <a href="#" className="text-[#8aa8bc] hover:text-[#5ba3c9] transition-colors">
            <FaTwitter className="text-sm" />
          </a>
          <a href="#" className="text-[#8aa8bc] hover:text-[#5ba3c9] transition-colors">
            <FaLinkedin className="text-sm" />
          </a>
        </div>
        <p className="text-xs text-[#8aa8bc]">© 2026 ChatApp. Built with ❤️</p>
      </footer>
    </div>
  )
}