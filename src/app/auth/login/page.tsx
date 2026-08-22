'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from './../../context/AuthContext'
import Link from 'next/link'
import { FaPhone, FaUser, FaArrowRight, FaSpinner, FaCommentDots, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

function LoginForm() {
  const router = useRouter()
  const { login, loading } = useAuth()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isFocused, setIsFocused] = useState({ phone: false, name: false })
  
  const [phoneError, setPhoneError] = useState('')
  const [nameError, setNameError] = useState('')
  const [touched, setTouched] = useState({ phone: false, name: false })

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      setPhoneError('Phone number is required')
      return false
    }
    const digits = value.replace(/[^0-9]/g, '')
    if (digits.length < 10) {
      setPhoneError('Enter a valid phone number')
      return false
    }
    setPhoneError('')
    return true
  }

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError('Name is required')
      return false
    }
    if (value.trim().length < 2) {
      setNameError('Name must be at least 2 characters')
      return false
    }
    if (value.trim().length > 50) {
      setNameError('Name must be less than 50 characters')
      return false
    }
    setNameError('')
    return true
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    if (touched.phone) {
      validatePhone(value)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (touched.name) {
      validateName(value)
    }
  }

  const handleBlur = (field: 'phone' | 'name') => {
    setTouched({ ...touched, [field]: true })
    if (field === 'phone') {
      validatePhone(phone)
    } else {
      validateName(name)
    }
  }

  const isPhoneValid = phoneError === '' && phone.trim().length > 0
  const isNameValid = nameError === '' && name.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    setTouched({ phone: true, name: true })
    const isPhoneValid = validatePhone(phone)
    const isNameValid = validateName(name)
    
    if (!isPhoneValid || !isNameValid) {
      return
    }
    
    const result = await login(phone, name)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c8d6e0] p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#b0c8d8]/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8aa8bc]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#b0c8d8]/20 rounded-full blur-3xl"></div>
      
      <div className="absolute top-20 left-10 w-2.5 h-2.5 bg-[#8aa8bc]/50 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-3 h-3 bg-[#6a8aa0]/40 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#8aa8bc]/30 rounded-full animate-pulse delay-500"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-xl border border-[#b0c8d8]/60 shadow-md shadow-[#8aa8bc]/20 p-8 transition-all duration-300">
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="relative inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3a7a9e] to-[#1a5a7e] rounded-xl flex items-center justify-center mx-auto shadow-sm shadow-[#3a7a9e]/20">
                <FaCommentDots className="text-2xl text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#0a1a2a] mt-4">Welcome back</h1>
            <p className="text-[#4a6a7e] text-sm mt-1">Sign in to continue chatting</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200/60 text-red-500 px-4 py-2.5 rounded-lg mb-4 text-sm flex items-center gap-2">
              <FaExclamationCircle className="text-red-400 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a6a7e] z-10 pointer-events-none">
                  <FaPhone className={`text-sm transition-colors duration-300 ${isFocused.phone ? 'text-[#3a7a9e]' : ''}`} />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={() => setIsFocused({ ...isFocused, phone: true })}
                  onBlur={() => {
                    setIsFocused({ ...isFocused, phone: false })
                    handleBlur('phone')
                  }}
                  placeholder="Phone Number"
                  className={`w-full pl-10 pr-3 py-2.5 bg-[#d8e4ee] border rounded-lg focus:bg-white focus:ring-2 outline-none transition-all duration-300 text-[#0a1a2a] placeholder:text-[#6a8aa0] text-sm ${
                    touched.phone && phoneError
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-200/30'
                      : touched.phone && isPhoneValid
                      ? 'border-[#3a7a9e] focus:border-[#3a7a9e] focus:ring-[#3a7a9e]/30'
                      : 'border-[#b0c8d8] focus:border-[#3a7a9e] focus:ring-[#3a7a9e]/20'
                  }`}
                />
                <label className={`absolute -top-2 left-3 px-1.5 text-[10px] font-medium transition-all duration-300 bg-white rounded ${
                  isFocused.phone ? 'text-[#3a7a9e]' : touched.phone && phoneError ? 'text-red-400' : 'text-[#4a6a7e]'
                }`}>
                  Phone
                </label>
                {touched.phone && isPhoneValid && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <FaCheckCircle className="text-[#3a7a9e] text-sm" />
                  </div>
                )}
                {touched.phone && phoneError && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <FaExclamationCircle className="text-red-400 text-sm" />
                  </div>
                )}
              </div>
              {touched.phone && phoneError && (
                <p className="text-xs text-red-400 mt-1.5 ml-1">{phoneError}</p>
              )}
            </div>

            {/* Name Input */}
            <div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a6a7e] z-10 pointer-events-none">
                  <FaUser className={`text-sm transition-colors duration-300 ${isFocused.name ? 'text-[#3a7a9e]' : ''}`} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onFocus={() => setIsFocused({ ...isFocused, name: true })}
                  onBlur={() => {
                    setIsFocused({ ...isFocused, name: false })
                    handleBlur('name')
                  }}
                  placeholder="Your Name"
                  className={`w-full pl-10 pr-3 py-2.5 bg-[#d8e4ee] border rounded-lg focus:bg-white focus:ring-2 outline-none transition-all duration-300 text-[#0a1a2a] placeholder:text-[#6a8aa0] text-sm ${
                    touched.name && nameError
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-200/30'
                      : touched.name && isNameValid
                      ? 'border-[#3a7a9e] focus:border-[#3a7a9e] focus:ring-[#3a7a9e]/30'
                      : 'border-[#b0c8d8] focus:border-[#3a7a9e] focus:ring-[#3a7a9e]/20'
                  }`}
                />
                <label className={`absolute -top-2 left-3 px-1.5 text-[10px] font-medium transition-all duration-300 bg-white rounded ${
                  isFocused.name ? 'text-[#3a7a9e]' : touched.name && nameError ? 'text-red-400' : 'text-[#4a6a7e]'
                }`}>
                  Name
                </label>
                {touched.name && isNameValid && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <FaCheckCircle className="text-[#3a7a9e] text-sm" />
                  </div>
                )}
                {touched.name && nameError && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <FaExclamationCircle className="text-red-400 text-sm" />
                  </div>
                )}
              </div>
              {touched.name && nameError && (
                <p className="text-xs text-red-400 mt-1.5 ml-1">{nameError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#3a7a9e] to-[#1a5a7e] hover:from-[#2a6a8e] hover:to-[#0a4a6e] text-white py-2.5 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#3a7a9e]/20 hover:shadow-md text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Get Started
                  <FaArrowRight className="transition-transform duration-300" />
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 text-center">
            <p className="text-xs text-[#4a6a7e]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#3a7a9e] rounded-full animate-pulse"></span>
                New number? Auto-registered
              </span>
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-1 text-xs text-[#4a6a7e] hover:text-[#3a7a9e] mt-3 transition-colors duration-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}