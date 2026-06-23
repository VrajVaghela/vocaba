export interface Language {
  id: string; // e.g., "es", "fr", "ja"
  name: string;
  nativeName: string;
  flag: string; // Emoji flag or icon identifier
  color: string; // Primary hex/theme color for the language UI
  welcomeMessage: string; // Brief welcome message in the language
}

export interface Unit {
  id: string; // e.g., "es-unit-1"
  languageId: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  order: number;
}

export type LessonType = 'video' | 'audio' | 'chat' | 'vocabulary' | 'review';

export interface LessonGoal {
  id: string;
  description: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

export interface PhraseItem {
  id: string;
  phrase: string;
  translation: string;
  pronunciation?: string;
  context?: string;
}

// Activity types for interactive lessons
export type ActivityType = 
  | 'video_lesson'
  | 'audio_lesson'
  | 'chat_tutor'
  | 'vocabulary_match'
  | 'multiple_choice'
  | 'speak_phrase'
  | 'translate';

export interface VideoLessonActivity {
  type: 'video_lesson';
  videoUrl: string; // URL to the stream video resource
  durationSeconds: number;
  teacherName: string;
  title: string;
  transcript?: string;
  aiTeacherPrompt?: string; // Prompt config for Stream Vision Agent AI feedback
}

export interface AudioLessonActivity {
  type: 'audio_lesson';
  audioUrl: string; // URL to the audio stream resource
  durationSeconds: number;
  teacherName: string;
  title: string;
  transcript?: string;
  aiTeacherPrompt?: string; // System prompt config for live audio agent session
}

export interface ChatTutorActivity {
  type: 'chat_tutor';
  scenario: string; // e.g., "At a cafe", "Ordering coffee"
  role: string; // e.g., "Waiter", "Barista"
  systemPrompt: string; // System prompt for the AI Chat Tutor
  initialMessage: string; // AI's opening line
}

export interface VocabularyMatchActivity {
  type: 'vocabulary_match';
  pairs: { word: string; translation: string }[];
}

export interface MultipleChoiceActivity {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface SpeakPhraseActivity {
  type: 'speak_phrase';
  phrase: string;
  translation: string;
  pronunciation?: string;
}

export interface TranslateActivity {
  type: 'translate';
  direction: 'to_target' | 'to_source';
  sentence: string;
  translation: string;
  options?: string[]; // Word bank options (optional)
}

export type ActivityContent =
  | VideoLessonActivity
  | AudioLessonActivity
  | ChatTutorActivity
  | VocabularyMatchActivity
  | MultipleChoiceActivity
  | SpeakPhraseActivity
  | TranslateActivity;

export interface Activity {
  id: string;
  type: ActivityType;
  points: number;
  content: ActivityContent;
}

export interface Lesson {
  id: string; // e.g., "es-unit-1-lesson-1"
  unitId: string;
  title: string;
  description: string;
  type: LessonType;
  xpReward: number;
  durationMinutes: number;
  goals: LessonGoal[];
  activities: Activity[];
  vocabularyList?: VocabularyItem[];
  phrasesList?: PhraseItem[];
  aiTeacherPrompt?: string; // Main system prompt for audio/video lessons
}
