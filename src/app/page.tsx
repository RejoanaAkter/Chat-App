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
    <div className="min-h-screen bg-[#c8d6e0] overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#b0c8d8]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3a7a9e] to-[#1a5a7e] rounded-lg flex items-center justify-center shadow-sm shadow-[#3a7a9e]/20">
              <FaCommentDots className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-[#0a1a2a]">ChatApp</span>
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#3a7a9e] to-[#1a5a7e] hover:from-[#2a6a8e] hover:to-[#0a4a6e] text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm shadow-[#3a7a9e]/20 hover:shadow-md"
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
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#b0c8d8]/60 px-3 py-1.5 rounded-full shadow-sm mb-5">
                <span className="w-1.5 h-1.5 bg-[#3a7a9e] rounded-full animate-pulse"></span>
                <span className="text-xs text-[#4a6a7e] font-medium">Live • Real-time messaging</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-[#0a1a2a] leading-[1.1]">
                Connect with anyone,
                <br />
                <span className="bg-gradient-to-r from-[#3a7a9e] to-[#1a5a7e] bg-clip-text text-transparent">instantly.</span>
              </h1>
              
              <p className="text-[#4a6a7e] text-base max-w-md mt-4 leading-relaxed">
                Experience the future of communication with real-time messaging, group chats, and seamless cross-platform support.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#3a7a9e] to-[#1a5a7e] hover:from-[#2a6a8e] hover:to-[#0a4a6e] text-white rounded-lg font-medium transition-all duration-300 shadow-sm shadow-[#3a7a9e]/20 hover:shadow-md text-sm"
                >
                  Get Started Free
                  <FaRocket className="text-xs" />
                </Link>
                <a
                  href="#features"
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#b0c8d8] text-[#0a1a2a] rounded-lg font-medium hover:bg-[#d8e4ee] transition-all duration-300 text-sm"
                >
                  Learn More
                  <FaArrowRight className="text-xs" />
                </a>
              </div>

              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#3a7a9e] text-sm" />
                  <span className="text-sm text-[#0a1a2a] font-medium">10k+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#3a7a9e] text-sm" />
                  <span className="text-sm text-[#0a1a2a] font-medium">99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right - Chat Mockup */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-white rounded-xl border border-[#b0c8d8]/60 shadow-md shadow-[#8aa8bc]/20 p-4">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#b0c8d8]/40">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#3a7a9e] to-[#1a5a7e] rounded-lg flex items-center justify-center">
                    <FaCommentDots className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0a1a2a]">ChatApp</p>
                    <p className="text-xs text-[#4a6a7e]">Online • 2 participants</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <span className="w-2 h-2 bg-[#3a7a9e] rounded-full"></span>
                    <span className="w-2 h-2 bg-[#4a6a7e]/40 rounded-full"></span>
                    <span className="w-2 h-2 bg-[#4a6a7e]/40 rounded-full"></span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-[#d8e4ee] rounded-lg rounded-tl-sm px-3 py-2">
                      <p className="text-sm text-[#0a1a2a]">Hey! How are you?</p>
                      <p className="text-[10px] text-[#4a6a7e] mt-0.5">12:30 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[75%] bg-gradient-to-r from-[#3a7a9e] to-[#1a5a7e] rounded-lg rounded-tr-sm px-3 py-2">
                      <p className="text-sm text-white">I'm great! Ready to chat 🚀</p>
                      <p className="text-[10px] text-white/70 mt-0.5 text-right">12:31 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-[#d8e4ee] rounded-lg rounded-tl-sm px-3 py-2">
                      <p className="text-sm text-[#0a1a2a]">Perfect! Let's go!</p>
                      <p className="text-[10px] text-[#4a6a7e] mt-0.5">12:32 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#b0c8d8]/40 flex items-center gap-2">
                  <div className="flex-1 bg-[#d8e4ee] rounded-lg px-3 py-1.5">
                    <p className="text-sm text-[#4a6a7e]">Type a message...</p>
                  </div>
                  <button className="w-8 h-8 bg-gradient-to-r from-[#3a7a9e] to-[#1a5a7e] rounded-lg flex items-center justify-center text-white text-sm shadow-sm shadow-[#3a7a9e]/20">
                    <FaArrowRight />
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm border border-[#b0c8d8]/60 rounded-full text-xs text-[#0a1a2a] shadow-sm">
                  <FaCheckCircle className="text-[#3a7a9e] text-[10px]" />
                  100% Encrypted
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm border border-[#b0c8d8]/60 rounded-full text-xs text-[#0a1a2a] shadow-sm">
                  <FaPlay className="text-[#3a7a9e] text-[10px]" />
                  Real-time
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-4 sm:px-6 bg-white/50 backdrop-blur-sm border-t border-[#b0c8d8]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0a1a2a]">Everything you need</h2>
            <p className="text-[#4a6a7e] text-sm mt-1">Modern features for seamless communication</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#b0c8d8]/60 p-5 text-center hover:shadow-md hover:shadow-[#8aa8bc]/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3a7a9e]/20 to-[#1a5a7e]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="text-[#3a7a9e] text-lg" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0a1a2a]">{feature.title}</h3>
                  <p className="text-xs text-[#4a6a7e] mt-1">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-[#b0c8d8]/60 shadow-md shadow-[#8aa8bc]/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-[#0a1a2a]">Ready to start chatting?</h2>
            <p className="text-[#4a6a7e] text-sm mt-1 mb-5">Join thousands of users already connected.</p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#3a7a9e] to-[#1a5a7e] hover:from-[#2a6a8e] hover:to-[#0a4a6e] text-white rounded-lg font-medium transition-all duration-300 shadow-sm shadow-[#3a7a9e]/20 hover:shadow-md text-sm"
            >
              Create Account
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 px-4 text-center border-t border-[#b0c8d8]/40 bg-white/50">
        <div className="flex items-center justify-center gap-4 mb-2">
          <a href="#" className="text-[#4a6a7e] hover:text-[#3a7a9e] transition-colors">
            <FaGithub className="text-sm" />
          </a>
          <a href="#" className="text-[#4a6a7e] hover:text-[#3a7a9e] transition-colors">
            <FaTwitter className="text-sm" />
          </a>
          <a href="#" className="text-[#4a6a7e] hover:text-[#3a7a9e] transition-colors">
            <FaLinkedin className="text-sm" />
          </a>
        </div>
        <p className="text-xs text-[#4a6a7e]">© 2026 ChatApp. Built with ❤️</p>
      </footer>
    </div>
  )
}