import { Language } from '../types/learning';

export const languages: Language[] = [
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    color: '#FF9F1C', // Warm yellow-orange
    welcomeMessage: '¡Hola! Bienvenido a Vocaba.',
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    color: '#3A86C8', // Royal blue
    welcomeMessage: 'Bonjour ! Bienvenue chez Vocaba.',
  },
  {
    id: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    color: '#E63946', // Sakura red
    welcomeMessage: 'こんにちは！ボカバへようこそ。',
  },
];
