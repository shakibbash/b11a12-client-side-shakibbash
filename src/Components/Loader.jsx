import React from 'react'

const Loader = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 flex items-center justify-center">
  <div className="text-center">
    {/* Animated Logo/Brand */}
    <div className="mb-8">
      <div className="w-20 h-20 mx-auto mb-4 bg-cyan-400 rounded-full flex items-center justify-center animate-pulse">
        <span className="text-3xl font-bold text-indigo-900">F</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">ForumX</h2>
      <p className="text-cyan-400 text-sm">Loading your forum...</p>
    </div>

    {/* Modern Spinner */}
    <div className="relative w-16 h-16 mx-auto mb-6">
      <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
      <div
        className="absolute inset-2 border-2 border-transparent border-t-white rounded-full animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      ></div>
    </div>

    {/* Loading Text Animation */}
    <div className="flex items-center justify-center space-x-1">
      <span className="text-white text-sm">Authenticating</span>
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>

    {/* Progress Bar */}
    <div className="w-64 h-1 bg-white/20 rounded-full mx-auto mt-6 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full animate-pulse"></div>
    </div>
  </div>
</div>

    )
}

export default Loader 