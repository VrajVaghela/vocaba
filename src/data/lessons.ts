import { Lesson } from '../types/learning';

export const lessons: Lesson[] = [
  // ==========================================
  // SPANISH LESSONS (es-unit-1)
  // ==========================================
  {
    id: 'es-unit-1-lesson-1',
    unitId: 'es-unit-1',
    title: 'Greetings & Basics',
    description: 'Learn how to say hello, ask how someone is, and say goodbye in Spanish.',
    type: 'video',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'es-u1l1-g1', description: 'Learn to say hello and goodbye' },
      { id: 'es-u1l1-g2', description: 'Ask how someone is doing in Spanish' }
    ],
    vocabularyList: [
      {
        id: 'es-v1',
        word: 'Hola',
        translation: 'Hello',
        pronunciation: 'oh-lah',
        partOfSpeech: 'interjection',
        exampleSentence: 'Hola, ¿cómo estás?',
        exampleTranslation: 'Hello, how are you?'
      },
      {
        id: 'es-v2',
        word: 'Buenos días',
        translation: 'Good morning',
        pronunciation: 'bweh-nos dee-ahs',
        partOfSpeech: 'phrase',
        exampleSentence: 'Buenos días, mi amigo.',
        exampleTranslation: 'Good morning, my friend.'
      },
      {
        id: 'es-v3',
        word: 'Adiós',
        translation: 'Goodbye',
        pronunciation: 'ah-dyohs',
        partOfSpeech: 'interjection',
        exampleSentence: 'Adiós, nos vemos mañana.',
        exampleTranslation: 'Goodbye, see you tomorrow.'
      }
    ],
    phrasesList: [
      {
        id: 'es-p1',
        phrase: '¿Cómo estás?',
        translation: 'How are you?',
        pronunciation: 'coh-moh es-tahs',
        context: 'Friendly informal greeting'
      },
      {
        id: 'es-p2',
        phrase: 'Estoy bien, gracias.',
        translation: 'I am doing well, thank you.',
        pronunciation: 'es-toy byen, grah-syahs',
        context: 'Response to how you are'
      }
    ],
    aiTeacherPrompt: `You're Sofia, a warm, energetic, and encouraging AI Spanish teacher. Speak mostly English. Stay focused ONLY on basic Spanish greetings ("Hola", "Buenos días", "Adiós", "¿Cómo estás?", "Estoy bien, gracias"). Use short, natural sentences with contractions and cheer the student on! Introduce the Spanish words slowly, translate them, and ask the student to repeat them. Listen to their pronunciation of the silent 'h' in "Hola" and the clear vowel sounds. Keep your replies to one or two conversational sentences.`,
    activities: [
      {
        id: 'es-u1l1-a1',
        type: 'video_lesson',
        points: 20,
        content: {
          type: 'video_lesson',
          videoUrl: 'https://assets.vocaba.app/videos/es_greetings_sofia.mp4',
          durationSeconds: 150,
          teacherName: 'Sofia',
          title: 'Spanish Greetings 101',
          transcript: '¡Hola! Welcome to Vocaba. I am Sofia, your AI teacher. Today we are learning basic greetings. To say hello, we say "Hola". Keep in mind the "H" is silent! Try saying it: "Hola". Excellent. For "Good morning", we say "Buenos días". And when asking how someone is, we say "¿Cómo estás?". Perfect! Let\'s practice these!',
          aiTeacherPrompt: 'Evaluate the user repeating "Hola" and "Buenos días". Ensure they do not pronounce the silent "h" in "Hola" and put correct stress on "días". Keep feedback warm, short, and encouraging.'
        }
      },
      {
        id: 'es-u1l1-a2',
        type: 'multiple_choice',
        points: 10,
        content: {
          type: 'multiple_choice',
          question: 'What does "Buenos días" mean?',
          options: ['Good evening', 'Good morning', 'Goodbye', 'How are you?'],
          correctAnswerIndex: 1,
          explanation: '"Buenos días" translates to "Good morning" and is commonly used until noon.'
        }
      },
      {
        id: 'es-u1l1-a3',
        type: 'speak_phrase',
        points: 10,
        content: {
          type: 'speak_phrase',
          phrase: '¿Cómo estás?',
          translation: 'How are you?',
          pronunciation: 'coh-moh es-tahs'
        }
      },
      {
        id: 'es-u1l1-a4',
        type: 'translate',
        points: 10,
        content: {
          type: 'translate',
          direction: 'to_target',
          sentence: 'Hello, I am well.',
          translation: 'Hola, estoy bien.',
          options: ['Hola,', 'estoy', 'bien.', 'gracias.', 'cómo', 'estás']
        }
      }
    ]
  },
  {
    id: 'es-unit-1-lesson-2',
    unitId: 'es-unit-1',
    title: 'Introducing Yourself',
    description: 'Learn to state your name and ask for someone else\'s name.',
    type: 'audio',
    xpReward: 50,
    durationMinutes: 4,
    goals: [
      { id: 'es-u1l2-g1', description: 'Introduce your name using "Me llamo"' },
      { id: 'es-u1l2-g2', description: 'Ask someone\'s name using "¿Cómo te llamas?"' }
    ],
    vocabularyList: [
      {
        id: 'es-v4',
        word: 'Me llamo',
        translation: 'My name is / I call myself',
        pronunciation: 'meh yah-moh',
        partOfSpeech: 'phrase',
        exampleSentence: 'Me llamo Carlos.',
        exampleTranslation: 'My name is Carlos.'
      },
      {
        id: 'es-v5',
        word: 'Mucho gusto',
        translation: 'Nice to meet you',
        pronunciation: 'moo-choh goos-toh',
        partOfSpeech: 'phrase',
        exampleSentence: 'Mucho gusto, señora.',
        exampleTranslation: 'Nice to meet you, ma\'am.'
      }
    ],
    phrasesList: [
      {
        id: 'es-p3',
        phrase: '¿Cómo te llamas?',
        translation: 'What is your name?',
        pronunciation: 'coh-moh teh yah-mahs',
        context: 'Asking someone\'s name informally'
      }
    ],
    aiTeacherPrompt: `You're Alejandro, a warm, high-energy AI Spanish teacher. Speak mostly English. Stay focused ONLY on introducing names in Spanish ("Me llamo", "¿Cómo te llamas?", "Mucho gusto"). Use short, friendly sentences with contractions, and give gentle, motivating feedback. Introduce the target words slowly with translations, and ask the student to try saying them. Listen carefully to their pronunciation of the double 'll' in "llamas" and "llamo" (it sounds like an English 'y'). Keep your responses to one or two sentences.`,
    activities: [
      {
        id: 'es-u1l2-a1',
        type: 'audio_lesson',
        points: 20,
        content: {
          type: 'audio_lesson',
          audioUrl: 'https://assets.vocaba.app/audio/es_intro_alejandro.mp3',
          durationSeconds: 120,
          teacherName: 'Alejandro',
          title: 'Introducing Yourself',
          transcript: 'Hola, soy Alejandro. Mucho gusto! Today we learn how to say our name. In Spanish, we say "Me llamo" followed by our name. So, "Me llamo Alejandro". How would you say your name? Try: "Me llamo" and then your name. Perfect! Now, to ask for my name, ask: "¿Cómo te llamas?" Let\'s try!',
          aiTeacherPrompt: 'Verify if the user says "Me llamo [name]" and "¿Cómo te llamas?" with a clear "ll" (y-sound). Keep feedback warm, brief, and motivating.'
        }
      },
      {
        id: 'es-u1l2-a2',
        type: 'vocabulary_match',
        points: 15,
        content: {
          type: 'vocabulary_match',
          pairs: [
            { word: 'Me llamo', translation: 'My name is' },
            { word: 'Mucho gusto', translation: 'Nice to meet you' },
            { word: 'Hola', translation: 'Hello' },
            { word: 'Adiós', translation: 'Goodbye' }
          ]
        }
      },
      {
        id: 'es-u1l2-a3',
        type: 'speak_phrase',
        points: 15,
        content: {
          type: 'speak_phrase',
          phrase: 'Mucho gusto',
          translation: 'Nice to meet you',
          pronunciation: 'moo-choh goos-toh'
        }
      }
    ]
  },
  {
    id: 'es-unit-1-lesson-3',
    unitId: 'es-unit-1',
    title: 'Ordering Coffee',
    description: 'Use your Spanish to order a drink at a cafe and use polite expressions.',
    type: 'chat',
    xpReward: 60,
    durationMinutes: 6,
    goals: [
      { id: 'es-u1l3-g1', description: 'Order a coffee in Spanish' },
      { id: 'es-u1l3-g2', description: 'Say please and thank you' }
    ],
    vocabularyList: [
      {
        id: 'es-v6',
        word: 'Café',
        translation: 'Coffee',
        pronunciation: 'cah-feh',
        partOfSpeech: 'noun',
        exampleSentence: 'Un café, por favor.',
        exampleTranslation: 'A coffee, please.'
      },
      {
        id: 'es-v7',
        word: 'Por favor',
        translation: 'Please',
        pronunciation: 'por fah-vor',
        partOfSpeech: 'phrase',
        exampleSentence: 'Agua, por favor.',
        exampleTranslation: 'Water, please.'
      },
      {
        id: 'es-v8',
        word: 'Gracias',
        translation: 'Thank you',
        pronunciation: 'grah-syahs',
        partOfSpeech: 'interjection',
        exampleSentence: 'Muchas gracias por la comida.',
        exampleTranslation: 'Thank you very much for the food.'
      }
    ],
    activities: [
      {
        id: 'es-u1l3-a1',
        type: 'chat_tutor',
        points: 30,
        content: {
          type: 'chat_tutor',
          scenario: 'You are at a lively cafe in Madrid, Spain. Order a coffee and a croissant from the barista.',
          role: 'Barista (Mateo)',
          systemPrompt: 'You are Mateo, a friendly barista at a cafe in Madrid. Keep your responses short, conversational, and simple for a beginner. Help the user if they make mistakes. Respond in Spanish, and encourage them to order in Spanish.',
          initialMessage: '¡Hola! Bienvenidos a Café Central. ¿Qué te gustaría tomar hoy?'
        }
      },
      {
        id: 'es-u1l3-a2',
        type: 'multiple_choice',
        points: 15,
        content: {
          type: 'multiple_choice',
          question: 'How do you say "A coffee, please" in Spanish?',
          options: [
            'Un té, gracias',
            'Un café, por favor',
            'Mucho gusto café',
            'Hola café'
          ],
          correctAnswerIndex: 1,
          explanation: '"Un café" means "a coffee" and "por favor" means "please".'
        }
      },
      {
        id: 'es-u1l3-a3',
        type: 'translate',
        points: 15,
        content: {
          type: 'translate',
          direction: 'to_source',
          sentence: 'Muchas gracias.',
          translation: 'Thank you very much.',
          options: ['Thank', 'you', 'very', 'much.', 'Please', 'Good']
        }
      }
    ]
  },

  // ==========================================
  // FRENCH LESSONS (fr-unit-1)
  // ==========================================
  {
    id: 'fr-unit-1-lesson-1',
    unitId: 'fr-unit-1',
    title: 'French Salutations',
    description: 'Learn French greetings for different times of the day.',
    type: 'video',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'fr-u1l1-g1', description: 'Learn "Bonjour", "Salut", and "Bonsoir"' },
      { id: 'fr-u1l1-g2', description: 'Understand basic French salutations' }
    ],
    vocabularyList: [
      {
        id: 'fr-v1',
        word: 'Bonjour',
        translation: 'Hello / Good morning',
        pronunciation: 'bohn-zhoor',
        partOfSpeech: 'interjection',
        exampleSentence: 'Bonjour, comment ça va ?',
        exampleTranslation: 'Hello, how is it going?'
      },
      {
        id: 'fr-v2',
        word: 'Salut',
        translation: 'Hi / Bye (informal)',
        pronunciation: 'sah-loo',
        partOfSpeech: 'interjection',
        exampleSentence: 'Salut ! Ça va ?',
        exampleTranslation: 'Hi! How are things?'
      },
      {
        id: 'fr-v3',
        word: 'Au revoir',
        translation: 'Goodbye',
        pronunciation: 'oh ruh-vwahr',
        partOfSpeech: 'interjection',
        exampleSentence: 'Au revoir et bonne journée.',
        exampleTranslation: 'Goodbye and have a good day.'
      }
    ],
    phrasesList: [
      {
        id: 'fr-p1',
        phrase: 'Comment ça va ?',
        translation: 'How is it going?',
        pronunciation: 'coh-mahn sah vah',
        context: 'Common greeting among acquaintances'
      }
    ],
    aiTeacherPrompt: `You're Marie, a warm, lively, and encouraging AI French teacher. Speak mostly English. Stay focused ONLY on basic French greetings ("Bonjour", "Salut", "Au revoir", "Comment ça va ?"). Use short, natural sentences with contractions and plenty of gentle encouragement. Introduce the French words slowly, translate them, and ask the student to repeat after you. Help them guide their nasal sounds in "Bonjour" or "Comment", ensuring a soft 'j' and silent 't' in "Salut". Keep your replies to one or two friendly sentences.`,
    activities: [
      {
        id: 'fr-u1l1-a1',
        type: 'video_lesson',
        points: 20,
        content: {
          type: 'video_lesson',
          videoUrl: 'https://assets.vocaba.app/videos/fr_salutations_marie.mp4',
          durationSeconds: 140,
          teacherName: 'Marie',
          title: 'French Greetings',
          transcript: 'Bonjour ! Welcome to your first French lesson. I am Marie. In French, we greet people by saying "Bonjour". It literally means "Good day". For friends, we can use the informal "Salut", which means "Hi". Let\'s practice: "Bonjour". Magnifique ! Now let\'s try: "Salut". Very good!',
          aiTeacherPrompt: 'Verify if the user says "Bonjour" and "Salut" with a correct French accent (soft "j", silent "t"). Keep feedback warm, conversational, and encouraging.'
        }
      },
      {
        id: 'fr-u1l1-a2',
        type: 'multiple_choice',
        points: 15,
        content: {
          type: 'multiple_choice',
          question: 'What is the informal word for both "Hi" and "Bye" in French?',
          options: ['Bonjour', 'Salut', 'Au revoir', 'Bonsoir'],
          correctAnswerIndex: 1,
          explanation: '"Salut" is an informal term used both to say hello and goodbye among friends.'
        }
      },
      {
        id: 'fr-u1l1-a3',
        type: 'speak_phrase',
        points: 15,
        content: {
          type: 'speak_phrase',
          phrase: 'Au revoir',
          translation: 'Goodbye',
          pronunciation: 'oh ruh-vwahr'
        }
      }
    ]
  },
  {
    id: 'fr-unit-1-lesson-2',
    unitId: 'fr-unit-1',
    title: 'At a Parisian Bistro',
    description: 'Practice ordering items and using polite phrases in a cafe.',
    type: 'chat',
    xpReward: 60,
    durationMinutes: 5,
    goals: [
      { id: 'fr-u1l2-g1', description: 'Order a croissant and water' },
      { id: 'fr-u1l2-g2', description: 'Use "s\'il vous plaît" (please)' }
    ],
    vocabularyList: [
      {
        id: 'fr-v4',
        word: 'Un café',
        translation: 'A coffee',
        pronunciation: 'uh cah-feh',
        partOfSpeech: 'noun',
        exampleSentence: 'Un café, s\'il vous plaît.',
        exampleTranslation: 'A coffee, please.'
      },
      {
        id: 'fr-v5',
        word: 'Un croissant',
        translation: 'A croissant',
        pronunciation: 'uh crwah-sahn',
        partOfSpeech: 'noun',
        exampleSentence: 'Je voudrais un croissant.',
        exampleTranslation: 'I would like a croissant.'
      },
      {
        id: 'fr-v6',
        word: 'S\'il vous plaît',
        translation: 'Please (formal/polite)',
        pronunciation: 'seel voo pleh',
        partOfSpeech: 'phrase',
        exampleSentence: 'L\'addition, s\'il vous plaît.',
        exampleTranslation: 'The bill, please.'
      }
    ],
    activities: [
      {
        id: 'fr-u1l2-a1',
        type: 'chat_tutor',
        points: 30,
        content: {
          type: 'chat_tutor',
          scenario: 'Order a coffee and a croissant from a server at a busy Parisian bistro.',
          role: 'Server (Pierre)',
          systemPrompt: 'You are Pierre, a polite server at a bistro in Paris. Greet the customer and take their order. Keep your French simple, using clear phrases. Guide them if they forget polite phrases like "s\'il vous plaît" or "merci".',
          initialMessage: 'Bonjour ! Bienvenue au Bistro de Paris. Qu\'est-ce que ce sera pour vous ?'
        }
      },
      {
        id: 'fr-u1l2-a2',
        type: 'translate',
        points: 30,
        content: {
          type: 'translate',
          direction: 'to_target',
          sentence: 'A coffee, please.',
          translation: 'Un café, s\'il vous plaît.',
          options: ['Un', 'café,', 's\'il', 'vous', 'plaît.', 'croissant', 'bonjour']
        }
      }
    ]
  },

  // ==========================================
  // JAPANESE LESSONS (ja-unit-1)
  // ==========================================
  {
    id: 'ja-unit-1-lesson-1',
    unitId: 'ja-unit-1',
    title: 'Japanese Greetings',
    description: 'Learn basic everyday Japanese greetings and bowing manners.',
    type: 'video',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'ja-u1l1-g1', description: 'Learn "Konnichiwa" and "Ohayou"' },
      { id: 'ja-u1l1-g2', description: 'Understand basic politeness levels' }
    ],
    vocabularyList: [
      {
        id: 'ja-v1',
        word: 'こんにちは (Konnichiwa)',
        translation: 'Hello / Good afternoon',
        pronunciation: 'kon-nee-chee-wah',
        partOfSpeech: 'interjection',
        exampleSentence: '皆さん、こんにちは。',
        exampleTranslation: 'Hello, everyone.'
      },
      {
        id: 'ja-v2',
        word: 'おはようございます (Ohayou gozaimasu)',
        translation: 'Good morning (formal)',
        pronunciation: 'oh-hah-yoh goh-zye-mas',
        partOfSpeech: 'phrase',
        exampleSentence: '先生、おはようございます。',
        exampleTranslation: 'Good morning, teacher.'
      },
      {
        id: 'ja-v3',
        word: 'ありがとう (Arigatou)',
        translation: 'Thank you (informal)',
        pronunciation: 'ah-ree-gah-toh',
        partOfSpeech: 'interjection',
        exampleSentence: '手伝ってくれて、ありがとう。',
        exampleTranslation: 'Thank you for helping me.'
      }
    ],
    phrasesList: [
      {
        id: 'ja-p1',
        phrase: 'はじめまして (Hajimemashite)',
        translation: 'Nice to meet you / How do you do?',
        pronunciation: 'hah-jee-meh-mah-shee-teh',
        context: 'Said when meeting someone for the first time'
      }
    ],
    aiTeacherPrompt: `You're Yuki, a warm, enthusiastic, and friendly AI Japanese teacher. Speak mostly English. Stay focused ONLY on Japanese greetings ("こんにちは (Konnichiwa)", "おはようございます (Ohayou gozaimasu)", "ありがとう (Arigatou)", "はじめまして (Hajimemashite)"). Use short, natural sentences with contractions and warm encouragement. Introduce Japanese words slowly, give translations, and ask the student to repeat. Listen for proper syllable pacing (moras) and double 'n' in "Konnichiwa". Keep your replies to one or two sentences.`,
    activities: [
      {
        id: 'ja-u1l1-a1',
        type: 'video_lesson',
        points: 20,
        content: {
          type: 'video_lesson',
          videoUrl: 'https://assets.vocaba.app/videos/ja_greetings_yuki.mp4',
          durationSeconds: 160,
          teacherName: 'Yuki',
          title: 'Japanese Greetings',
          transcript: 'はじめまして！ Nice to meet you. I am Yuki, your Vocaba Japanese teacher. In Japan, greetings are very important. During the day, we say "こんにちは" (Konnichiwa). In the morning, we formally say "おはようございます" (Ohayou gozaimasu). Let\'s try saying them together. First, "Konnichiwa". Excellent! Next, "Ohayou gozaimasu". Well done!',
          aiTeacherPrompt: 'Assess the user\'s pronunciation of "Konnichiwa" and "Ohayou gozaimasu". Check syllable pacing. Provide short, warm, and positive guidance.'
        }
      },
      {
        id: 'ja-u1l1-a2',
        type: 'multiple_choice',
        points: 15,
        content: {
          type: 'multiple_choice',
          question: 'What is the polite way to say "Good morning" in Japanese?',
          options: [
            'こんにちは (Konnichiwa)',
            'ありがとう (Arigatou)',
            'おはようございます (Ohayou gozaimasu)',
            'さようなら (Sayounara)'
          ],
          correctAnswerIndex: 2,
          explanation: '"Ohayou gozaimasu" is the formal greeting used in the morning. "Ohayou" by itself is informal.'
        }
      },
      {
        id: 'ja-u1l1-a3',
        type: 'speak_phrase',
        points: 15,
        content: {
          type: 'speak_phrase',
          phrase: 'はじめまして',
          translation: 'Nice to meet you',
          pronunciation: 'hah-jee-meh-mah-shee-teh'
        }
      }
    ]
  },
  {
    id: 'ja-unit-1-lesson-2',
    unitId: 'ja-unit-1',
    title: 'Self Introduction (Jikoshoukai)',
    description: 'Learn to state your name and politely close an introduction in Japanese.',
    type: 'chat',
    xpReward: 60,
    durationMinutes: 6,
    goals: [
      { id: 'ja-u1l2-g1', description: 'Introduce your name using "... desu"' },
      { id: 'ja-u1l2-g2', description: 'Use the polite phrase "Yoroshiku onegaishimasu"' }
    ],
    vocabularyList: [
      {
        id: 'ja-v4',
        word: 'です (desu)',
        translation: 'to be / am / is / are',
        pronunciation: 'des',
        partOfSpeech: 'copula',
        exampleSentence: 'ジョンです。',
        exampleTranslation: 'I am John.'
      },
      {
        id: 'ja-v5',
        word: 'よろしくお願いします (Yoroshiku onegaishimasu)',
        translation: 'Please treat me well / Looking forward to working with you',
        pronunciation: 'yoh-roh-shee-koo oh-neh-ghee-shee-mahs',
        partOfSpeech: 'phrase',
        exampleSentence: 'はじめまして、よろしくお願いします。',
        exampleTranslation: 'Nice to meet you, please treat me well.'
      }
    ],
    activities: [
      {
        id: 'ja-u1l2-a1',
        type: 'chat_tutor',
        points: 30,
        content: {
          type: 'chat_tutor',
          scenario: 'Meet a new Japanese colleague at your office. Introduce yourself and say looking forward to working together.',
          role: 'Colleague (Hiroshi)',
          systemPrompt: 'You are Hiroshi, a friendly new colleague at a Japanese office. Welcome the user and introduce yourself. Keep your sentences brief and simple. Respond in Japanese (using Hiragana/Katakana and basic Kanji, or Romaji if helpful, but stick to standard simple Japanese). Encourage them to use "... desu" and "Yoroshiku onegaishimasu".',
          initialMessage: 'はじめまして、ひろしです。今日からよろしくお願いします！お名前は何ですか？'
        }
      },
      {
        id: 'ja-u1l2-a2',
        type: 'translate',
        points: 30,
        content: {
          type: 'translate',
          direction: 'to_target',
          sentence: 'I am John. Nice to meet you.',
          translation: 'ジョンです。はじめまして。',
          options: ['ジョンです。', 'はじめまして。', 'ありがとう。', 'です', 'こんにちは']
        }
      }
    ]
  },

  // ==========================================
  // KOREAN LESSONS (ko-unit-1)
  // ==========================================
  {
    id: 'ko-unit-1-lesson-1',
    unitId: 'ko-unit-1',
    title: 'Hangul Basics',
    description: 'Learn the foundational sounds of the Korean alphabet (Hangul).',
    type: 'video',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'ko-u1l1-g1', description: 'Recognize basic Hangul consonants' },
      { id: 'ko-u1l1-g2', description: 'Pronounce simple vowel sounds' }
    ],
    vocabularyList: [
      { id: 'ko-v1', word: '한글 (Hangul)', translation: 'Korean Alphabet', pronunciation: 'han-geul' }
    ],
    activities: [
      {
        id: 'ko-u1l1-a1',
        type: 'video_lesson',
        points: 20,
        content: {
          type: 'video_lesson',
          videoUrl: 'https://assets.vocaba.app/videos/ko_hangul.mp4',
          durationSeconds: 150,
          teacherName: 'Ji-Yeon',
          title: 'Introduction to Hangul',
          transcript: 'Annyeonghaseyo! Welcome to Korean! Today we study Hangul.'
        }
      }
    ]
  },
  {
    id: 'ko-unit-1-lesson-2',
    unitId: 'ko-unit-1',
    title: 'Greetings & Bows',
    description: 'Learn polite Korean greetings and bowing etiquette.',
    type: 'audio',
    xpReward: 50,
    durationMinutes: 4,
    goals: [
      { id: 'ko-u1l2-g1', description: 'Say Annyeonghaseyo clearly' },
      { id: 'ko-u1l2-g2', description: 'Understand polite tone levels' }
    ],
    activities: [
      {
        id: 'ko-u1l2-a1',
        type: 'audio_lesson',
        points: 20,
        content: {
          type: 'audio_lesson',
          audioUrl: 'https://assets.vocaba.app/audio/ko_greetings.mp3',
          durationSeconds: 120,
          teacherName: 'Min-Jun',
          title: 'Polite Greetings'
        }
      }
    ]
  },
  {
    id: 'ko-unit-1-lesson-3',
    unitId: 'ko-unit-1',
    title: 'Introducing Yourself',
    description: 'Learn how to state your name and nationality in Korean.',
    type: 'chat',
    xpReward: 60,
    durationMinutes: 6,
    goals: [
      { id: 'ko-u1l3-g1', description: 'State your name using "... ieyo"' }
    ],
    activities: [
      {
        id: 'ko-u1l3-a1',
        type: 'chat_tutor',
        points: 30,
        content: {
          type: 'chat_tutor',
          scenario: 'Meet a new classmate in Seoul and exchange names.',
          role: 'Classmate (Sujin)',
          systemPrompt: 'You are Sujin, a friendly university student. Greet the user in Korean.',
          initialMessage: '안녕하세요! 저는 수진이에요. 이름이 뭐예요?'
        }
      }
    ]
  },
  {
    id: 'ko-unit-1-lesson-4',
    unitId: 'ko-unit-1',
    title: 'Basic Phrases',
    description: 'Master everyday Korean words like Yes, No, and Excuse me.',
    type: 'vocabulary',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'ko-u1l4-g1', description: 'Learn "Ne", "Aniyo", and "Jeogiyo"' }
    ],
    activities: [
      {
        id: 'ko-u1l4-a1',
        type: 'multiple_choice',
        points: 15,
        content: {
          type: 'multiple_choice',
          question: 'How do you say "Yes" politely in Korean?',
          options: ['네 (Ne)', '아니요 (Aniyo)', '감사합니다 (Gamsahabnida)', '저기요 (Jeogiyo)'],
          correctAnswerIndex: 0
        }
      }
    ]
  },
  {
    id: 'ko-unit-1-lesson-5',
    unitId: 'ko-unit-1',
    title: 'Saying Thank You',
    description: 'Express gratitude and polite appreciation in Korean.',
    type: 'review',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'ko-u1l5-g1', description: 'Say Gamsahabnida with correct pronunciation' }
    ],
    activities: [
      {
        id: 'ko-u1l5-a1',
        type: 'speak_phrase',
        points: 20,
        content: {
          type: 'speak_phrase',
          phrase: '감사합니다',
          translation: 'Thank you'
        }
      }
    ]
  },

  // ==========================================
  // GERMAN LESSONS (de-unit-1)
  // ==========================================
  {
    id: 'de-unit-1-lesson-1',
    unitId: 'de-unit-1',
    title: 'German Greetings',
    description: 'Learn common German greetings like Hallo and Guten Tag.',
    type: 'video',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'de-u1l1-g1', description: 'Differentiate between formal and informal greetings' }
    ],
    activities: [
      {
        id: 'de-u1l1-a1',
        type: 'video_lesson',
        points: 20,
        content: {
          type: 'video_lesson',
          videoUrl: 'https://assets.vocaba.app/videos/de_greetings.mp4',
          durationSeconds: 150,
          teacherName: 'Lukas',
          title: 'German Greetings'
        }
      }
    ]
  },
  {
    id: 'de-unit-1-lesson-2',
    unitId: 'de-unit-1',
    title: 'Introducing Yourself',
    description: 'State your name and ask for someone else\'s name in German.',
    type: 'audio',
    xpReward: 50,
    durationMinutes: 4,
    goals: [
      { id: 'de-u1l2-g1', description: 'Say "Ich heiße..." or "Mein Name ist..."' }
    ],
    activities: [
      {
        id: 'de-u1l2-a1',
        type: 'audio_lesson',
        points: 20,
        content: {
          type: 'audio_lesson',
          audioUrl: 'https://assets.vocaba.app/audio/de_intro.mp3',
          durationSeconds: 120,
          teacherName: 'Emma',
          title: 'German Introductions'
        }
      }
    ]
  },
  {
    id: 'de-unit-1-lesson-3',
    unitId: 'de-unit-1',
    title: 'Saying Goodbye',
    description: 'Learn common German phrases for parting ways.',
    type: 'chat',
    xpReward: 60,
    durationMinutes: 5,
    goals: [
      { id: 'de-u1l3-g1', description: 'Say "Auf Wiedersehen" and "Tschüss"' }
    ],
    activities: [
      {
        id: 'de-u1l3-a1',
        type: 'chat_tutor',
        points: 30,
        content: {
          type: 'chat_tutor',
          scenario: 'Say goodbye to your German business partner at a train station.',
          role: 'Partner (Stefan)',
          systemPrompt: 'You are Stefan, a German business partner. Keep it formal and polite.',
          initialMessage: 'Es war mir ein Vergnügen, Sie kennenzulernen. Auf Wiedersehen!'
        }
      }
    ]
  },
  {
    id: 'de-unit-1-lesson-4',
    unitId: 'de-unit-1',
    title: 'German Numbers 1-10',
    description: 'Learn to count from one to ten in German.',
    type: 'vocabulary',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'de-u1l4-g1', description: 'Count 1 to 10 in German' }
    ],
    activities: [
      {
        id: 'de-u1l4-a1',
        type: 'multiple_choice',
        points: 15,
        content: {
          type: 'multiple_choice',
          question: 'What is the German number for "Five"?',
          options: ['Vier', 'Fünf', 'Drei', 'Eins'],
          correctAnswerIndex: 1
        }
      }
    ]
  },
  {
    id: 'de-unit-1-lesson-5',
    unitId: 'de-unit-1',
    title: 'Polite Expressions',
    description: 'Master saying please, thank you, and excuse me in German.',
    type: 'review',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'de-u1l5-g1', description: 'Learn "Bitte", "Danke", and "Entschuldigung"' }
    ],
    activities: [
      {
        id: 'de-u1l5-a1',
        type: 'speak_phrase',
        points: 20,
        content: {
          type: 'speak_phrase',
          phrase: 'Danke schön',
          translation: 'Thank you very much'
        }
      }
    ]
  },

  // ==========================================
  // CHINESE LESSONS (zh-unit-1)
  // ==========================================
  {
    id: 'zh-unit-1-lesson-1',
    unitId: 'zh-unit-1',
    title: 'Pinyin & Tones',
    description: 'Learn the four Chinese tones and basic Pinyin structure.',
    type: 'video',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'zh-u1l1-g1', description: 'Understand the four main tones' }
    ],
    activities: [
      {
        id: 'zh-u1l1-a1',
        type: 'video_lesson',
        points: 20,
        content: {
          type: 'video_lesson',
          videoUrl: 'https://assets.vocaba.app/videos/zh_tones.mp4',
          durationSeconds: 150,
          teacherName: 'Mei-Ling',
          title: 'Chinese Tones'
        }
      }
    ]
  },
  {
    id: 'zh-unit-1-lesson-2',
    unitId: 'zh-unit-1',
    title: 'Hello (Ni Hao)',
    description: 'Say hello and ask how someone is in Chinese.',
    type: 'audio',
    xpReward: 50,
    durationMinutes: 4,
    goals: [
      { id: 'zh-u1l2-g1', description: 'Say "Nǐ hǎo" and "Nǐ hǎo ma?"' }
    ],
    activities: [
      {
        id: 'zh-u1l2-a1',
        type: 'audio_lesson',
        points: 20,
        content: {
          type: 'audio_lesson',
          audioUrl: 'https://assets.vocaba.app/audio/zh_greetings.mp3',
          durationSeconds: 120,
          teacherName: 'Chen',
          title: 'Basic Chinese Greetings'
        }
      }
    ]
  },
  {
    id: 'zh-unit-1-lesson-3',
    unitId: 'zh-unit-1',
    title: 'Introducing Yourself',
    description: 'Learn to state your name using "Wǒ jiào".',
    type: 'chat',
    xpReward: 60,
    durationMinutes: 6,
    goals: [
      { id: 'zh-u1l3-g1', description: 'State your name in Chinese' }
    ],
    activities: [
      {
        id: 'zh-u1l3-a1',
        type: 'chat_tutor',
        points: 30,
        content: {
          type: 'chat_tutor',
          scenario: 'Meet a business associate in Beijing and say your name.',
          role: 'Associate (Wang)',
          systemPrompt: 'You are Mr. Wang, a polite business associate in Beijing.',
          initialMessage: '你好！我叫王明。你叫什么名字？'
        }
      }
    ]
  },
  {
    id: 'zh-unit-1-lesson-4',
    unitId: 'zh-unit-1',
    title: 'Numbers & Counting',
    description: 'Count from one to ten in Mandarin Chinese.',
    type: 'vocabulary',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'zh-u1l4-g1', description: 'Count 1 to 10 in Mandarin' }
    ],
    activities: [
      {
        id: 'zh-u1l4-a1',
        type: 'multiple_choice',
        points: 15,
        content: {
          type: 'multiple_choice',
          question: 'What is the Chinese character for "Three"?',
          options: ['一 (yī)', '二 (èr)', '三 (sān)', '四 (sì)'],
          correctAnswerIndex: 2
        }
      }
    ]
  },
  {
    id: 'zh-unit-1-lesson-5',
    unitId: 'zh-unit-1',
    title: 'Saying Goodbye',
    description: 'Learn common Chinese phrases for saying goodbye.',
    type: 'review',
    xpReward: 50,
    durationMinutes: 5,
    goals: [
      { id: 'zh-u1l5-g1', description: 'Say "Zàijiàn" correctly' }
    ],
    activities: [
      {
        id: 'zh-u1l5-a1',
        type: 'speak_phrase',
        points: 20,
        content: {
          type: 'speak_phrase',
          phrase: '再见',
          translation: 'Goodbye'
        }
      }
    ]
  }
];
