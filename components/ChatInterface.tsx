'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI video assistant. I can help you with video generation commands. Try:\n\n• "/generate [description]" - Generate a video\n• "/duration [seconds]" - Set video duration (88, 60, 180, 300, 600)\n• "/ratio [16:9 or 9:16]" - Set aspect ratio\n• "/help" - Show all commands\n\nWhat would you like to create?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [duration, setDuration] = useState(88)
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleCommand = async (input: string) => {
    const trimmedInput = input.trim()

    // Help command
    if (trimmedInput.toLowerCase() === '/help') {
      return {
        content: `**Available Commands:**

• **/generate [description]** - Generate a video from text
  Example: /generate A beautiful sunset over the ocean

• **/duration [seconds]** - Set video duration
  Options: 88, 60, 180, 300, 600
  Example: /duration 180

• **/ratio [aspect]** - Set aspect ratio
  Options: 16:9, 9:16
  Example: /ratio 9:16

• **/settings** - Show current settings

• **/help** - Show this help message

You can also just chat naturally, and I'll help you create videos!`,
      }
    }

    // Settings command
    if (trimmedInput.toLowerCase() === '/settings') {
      return {
        content: `**Current Settings:**
• Duration: ${duration} seconds (${duration >= 60 ? Math.floor(duration / 60) + ' minutes' : duration + ' seconds'})
• Aspect Ratio: ${aspectRatio}`,
      }
    }

    // Duration command
    const durationMatch = trimmedInput.match(/^\/duration\s+(\d+)$/i)
    if (durationMatch) {
      const newDuration = parseInt(durationMatch[1])
      if ([88, 60, 180, 300, 600].includes(newDuration)) {
        setDuration(newDuration)
        return {
          content: `Duration set to ${newDuration} seconds (${newDuration >= 60 ? Math.floor(newDuration / 60) + ' minutes' : newDuration + ' seconds'}) ✓`,
        }
      } else {
        return {
          content: 'Invalid duration. Please choose from: 88, 60, 180, 300, or 600 seconds.',
        }
      }
    }

    // Ratio command
    const ratioMatch = trimmedInput.match(/^\/ratio\s+(16:9|9:16)$/i)
    if (ratioMatch) {
      const newRatio = ratioMatch[1] as '16:9' | '9:16'
      setAspectRatio(newRatio)
      return {
        content: `Aspect ratio set to ${newRatio} ✓`,
      }
    }

    // Generate command
    const generateMatch = trimmedInput.match(/^\/generate\s+(.+)$/i)
    if (generateMatch) {
      const prompt = generateMatch[1]
      try {
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            duration,
            aspectRatio,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate video')
        }

        return {
          content: `Video generated successfully! 🎬

**Prompt:** ${prompt}
**Duration:** ${duration}s
**Aspect Ratio:** ${aspectRatio}
**Video ID:** ${data.id}

Your video is ready! Switch to the "Video Generator" tab to view it.`,
        }
      } catch (err) {
        return {
          content: `Error generating video: ${err instanceof Error ? err.message : 'Unknown error'}`,
        }
      }
    }

    // Natural language processing
    const lowerInput = trimmedInput.toLowerCase()

    if (lowerInput.includes('video') && (lowerInput.includes('create') || lowerInput.includes('generate') || lowerInput.includes('make'))) {
      return {
        content: 'I can help you create a video! Please use the `/generate` command followed by your description.\n\nExample: `/generate A cat playing with a ball of yarn`\n\nOr switch to the "Video Generator" tab for the full interface.',
      }
    }

    if (lowerInput.includes('how') || lowerInput.includes('what')) {
      return {
        content: 'I\'m an AI assistant that helps you generate videos using Veo3 technology. I can:\n\n• Generate videos from text descriptions\n• Customize video duration and aspect ratio\n• Provide guidance on creating great video prompts\n\nType `/help` to see all available commands!',
      }
    }

    // Generic AI response
    return {
      content: 'I\'m here to help you generate videos! Try using `/generate [your description]` to create a video, or type `/help` to see all available commands.',
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await handleCommand(input)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[700px]">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
        <h2 className="text-xl font-bold text-white">AI Chat Assistant</h2>
        <p className="text-sm text-white/80">Commands: /generate, /duration, /ratio, /help</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              <div
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-white/60'
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/20 rounded-2xl p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message or command (e.g., /generate sunset over mountains)..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={2}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}
