'use client'

import { useState } from 'react'

type Duration = 88 | 60 | 180 | 300 | 600
type AspectRatio = '16:9' | '9:16'

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState<Duration>(88)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideos, setGeneratedVideos] = useState<Array<{
    id: string
    prompt: string
    duration: number
    aspectRatio: string
    url: string
    thumbnail: string
    timestamp: Date
  }>>([])
  const [error, setError] = useState('')

  const durations: Duration[] = [88, 60, 180, 300, 600]
  const aspectRatios: AspectRatio[] = ['16:9', '9:16']

  const getDurationLabel = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m`
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a video description')
      return
    }

    setIsGenerating(true)
    setError('')

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

      setGeneratedVideos([
        {
          id: data.id,
          prompt,
          duration,
          aspectRatio,
          url: data.videoUrl,
          thumbnail: data.thumbnailUrl,
          timestamp: new Date(),
        },
        ...generatedVideos,
      ])

      setPrompt('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Generation Panel */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Create Video</h2>

        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-2">
            Video Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your video... e.g., 'A serene sunset over a mountain lake with birds flying'"
            className="w-full h-32 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">
            Duration
          </label>
          <div className="grid grid-cols-5 gap-2">
            {durations.map((dur) => (
              <button
                key={dur}
                onClick={() => setDuration(dur)}
                disabled={isGenerating}
                className={`py-3 px-2 rounded-lg font-semibold transition-all ${
                  duration === dur
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } disabled:opacity-50`}
              >
                {getDurationLabel(dur)}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-2 gap-4">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                disabled={isGenerating}
                className={`py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-3 ${
                  aspectRatio === ratio
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } disabled:opacity-50`}
              >
                <div
                  className={`border-2 border-current ${
                    ratio === '16:9' ? 'w-8 h-5' : 'w-5 h-8'
                  }`}
                />
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating Video...
            </span>
          ) : (
            'Generate Video'
          )}
        </button>
      </div>

      {/* Generated Videos Panel */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Generated Videos</h2>

        {generatedVideos.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <svg
              className="w-24 h-24 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg">No videos generated yet</p>
            <p className="text-sm mt-2">Your generated videos will appear here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {generatedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all"
              >
                <div className="aspect-video bg-black rounded-lg mb-3 overflow-hidden">
                  <video
                    src={video.url}
                    poster={video.thumbnail}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white text-sm mb-2 line-clamp-2">
                  {video.prompt}
                </p>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>{getDurationLabel(video.duration)}</span>
                  <span>{video.aspectRatio}</span>
                  <span>
                    {video.timestamp.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
