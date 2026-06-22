# Vocaba 🦜

A **Duolingo-inspired AI language learning mobile app** built with Expo + React Native.

Vocaba teaches users languages through interactive, AI-powered lessons — including video lessons with an AI teacher, audio lessons, chat-based AI tutoring, and vocabulary review.

> This is a learning project designed to teach developers how to build a modern AI-powered Expo app **feature by feature**.

---

## ✨ Features

- 🎥 **Video AI Teacher** — AI-powered video lessons using Stream Vision Agents
- 🎧 **Audio Lessons** — Immersive audio-based language practice
- 💬 **AI Chat Tutor** — Real-time chat with an AI language tutor
- 📖 **Vocabulary Review** — Spaced-repetition vocabulary cards
- 🌍 **Language Selection** — Choose your target language
- 🔥 **XP & Streaks** — Local gamification with XP and lesson completion tracking
- 🔐 **Authentication** — Powered by Clerk

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) + React Native |
| Language | TypeScript |
| Routing | Expo Router |
| Styling | NativeWind / Tailwind CSS |
| State | Zustand + AsyncStorage |
| Auth | Clerk |
| Real-time / Video | Stream / GetStream |
| AI Video Teacher | Stream Vision Agents |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go app on your device, or an Android/iOS simulator

### Installation

```bash
# Clone the repo
git clone https://github.com/VrajVaghela/vocaba.git
cd vocaba

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

> ⚠️ Never commit secret keys. Backend-only secrets stay server-side.

### Run the app

```bash
npx expo start
```

Then open in:
- **Expo Go** — scan the QR code
- **Android Emulator** — press `a`
- **iOS Simulator** — press `i`
- **Development Build** — see [Expo dev builds](https://docs.expo.dev/develop/development-builds/introduction/)

---

## 📁 Project Structure

```
vocaba/
├── app/               # Expo Router screens & routes
│   ├── (auth)/        # Auth screens (sign in, sign up)
│   ├── (tabs)/        # Main tab navigation
│   └── lesson/        # Lesson screens
├── components/        # Reusable UI components
├── constants/         # App constants & image imports
├── data/              # Hardcoded lesson/language content
├── hooks/             # Custom React hooks
├── lib/               # External service helpers (Clerk, Stream, etc.)
├── store/             # Zustand stores
├── types/             # TypeScript types
└── assets/            # Images, fonts, and other static assets
```

---

## 🧪 Development

```bash
# Lint
npm run lint

# Type check
npm run typecheck
```

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Clerk Docs](https://clerk.com/docs)
- [Stream Docs](https://getstream.io/docs/)

---

## 📄 License

MIT © [Vraj Vaghela](https://github.com/VrajVaghela)
