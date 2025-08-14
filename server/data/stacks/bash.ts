// server/data/stacks/bash.ts
import { Flashcard, QAItem } from './flashcards';

export const bashStack = {
  id: 'bash',
  name: {
    en: 'Bash',
    fr: 'Bash',
    es: 'Bash',
    de: 'Bash',
    ar: 'باش'
  },
  description: {
    en: 'Unix shell and command language.',
    fr: 'Interpréteur de commandes Unix.',
    es: 'Intérprete de comandos Unix.',
    de: 'Unix-Shell und Befehlssprache.',
    ar: 'مفسر أوامر يونكس.'
  },
  totalCardCount: 3,
  flashcards: [
    {
      cardId: 'bash_ls',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['files', 'list'],
      command: 'ls',
      explanation_translations: {
        en: 'List directory contents.',
        fr: 'Liste le contenu du répertoire.',
        es: 'Lista el contenido del directorio.',
        de: 'Listet Verzeichnisinhalte auf.',
        ar: 'يعرض محتويات الدليل.'
      },
      question_translations: {
        en: 'How do you list files in a directory?',
        fr: 'Comment lister les fichiers d’un répertoire ?',
        es: '¿Cómo listas archivos en un directorio?',
        de: 'Wie listet man Dateien in einem Verzeichnis auf?',
        ar: 'كيف تعرض الملفات في دليل؟'
      },
      valid_answers: ['ls', 'ls -l'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ],
  qa_mode: []
};
