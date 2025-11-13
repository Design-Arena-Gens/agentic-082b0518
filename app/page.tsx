'use client'

import { useState } from 'react'
import VideoGenerator from '@/components/VideoGenerator'
import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'chat'>('generate')

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            AI Video Generator
          </h1>
          <p className="text-lg md:text-xl text-blue-200">
            Powered by Veo3 - Create stunning videos from text
          </p>
        </header>

        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-1 inline-flex">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'generate'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Video Generator
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              AI Chat
            </button>
          </div>
        </div>

        {activeTab === 'generate' ? <VideoGenerator /> : <ChatInterface />}
      </div>
    </main>
  )
}
