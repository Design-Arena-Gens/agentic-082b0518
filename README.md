# AI Video Generator - Veo3

A modern web application for generating AI videos using Veo3 technology with customizable durations and aspect ratios.

## Features

- **Video Generation**: Create videos from text descriptions
- **Multiple Durations**: 88s, 60s, 3min, 5min, 10min
- **Aspect Ratios**: 16:9 (landscape) and 9:16 (portrait)
- **AI Chat Interface**: Natural language commands for video generation
- **Modern UI**: Beautiful gradient design with glassmorphism effects

## Chat Commands

- `/generate [description]` - Generate a video
- `/duration [seconds]` - Set video duration
- `/ratio [16:9 or 9:16]` - Set aspect ratio
- `/settings` - Show current settings
- `/help` - Show all commands

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Veo3 AI (mock implementation)

## Deployment

Deploy to Vercel:

```bash
vercel deploy --prod
```
