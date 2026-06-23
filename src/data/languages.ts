import { Language } from '../types/learning';

export const languages: Language[] = [
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    color: '#FF9F1C', // Warm yellow-orange
    welcomeMessage: '¡Hola! Bienvenido a Vocaba.',
    learnersCount: '28.4M learners',
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    color: '#3A86C8', // Royal blue
    welcomeMessage: 'Bonjour ! Bienvenue chez Vocaba.',
    learnersCount: '19.4M learners',
  },
  {
    id: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    color: '#E63946', // Sakura red
    welcomeMessage: 'こんにちは！ボカバへようこそ。',
    learnersCount: '12.7M learners',
  },
  {
    id: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    color: '#4D8BFF', // Blue
    welcomeMessage: '안녕하세요! 보카바에 오신 것을 환영합니다.',
    learnersCount: '9.3M learners',
  },
  {
    id: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    color: '#333333', // Charcoal/Dark
    welcomeMessage: 'Hallo! Willkommen bei Vocaba.',
    learnersCount: '8.1M learners',
  },
  {
    id: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    color: '#FF3B30', // Red
    welcomeMessage: '你好！欢迎来到Vocaba。',
    learnersCount: '7.4M learners',
  },
];
