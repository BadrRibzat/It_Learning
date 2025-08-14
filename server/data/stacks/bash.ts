// server/data/stacks/bash.ts
import { Flashcard, QAItem } from '../flashcards';

export const bashStack = {
  id: 'bash',
  name: { en: 'Bash', fr: 'Bash', es: 'Bash', de: 'Bash', ar: 'باش' },
  description: {
    en: 'Unix shell and command language for scripting and automation.',
    fr: 'Interpréteur de commandes Unix pour les scripts et l\'automatisation.',
    es: 'Intérprete de comandos Unix para scripts y automatización.',
    de: 'Unix-Shell und Befehlssprache für Skripte und Automatisierung.',
    ar: 'مفسر أوامر يونكس للبرمجة النصية والأتمتة.'
  },
  totalCardCount: 15, // Realistic count
  flashcards: [
    // === File & Directory Ops ===
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
    },
    {
      cardId: 'bash_cd',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['navigation'],
      command: 'cd /path',
      explanation_translations: {
        en: 'Change the current directory.',
        fr: 'Change le répertoire courant.',
        es: 'Cambia el directorio actual.',
        de: 'Wechselt das aktuelle Verzeichnis.',
        ar: 'يغير الدليل الحالي.'
      },
      question_translations: {
        en: 'How do you change to a different directory?',
        fr: 'Comment changer de répertoire ?',
        es: '¿Cómo cambias a un directorio diferente?',
        de: 'Wie wechselt man in ein anderes Verzeichnis?',
        ar: 'كيف تنتقل إلى دليل مختلف؟'
      },
      valid_answers: ['cd /path', 'cd ..', 'cd ~'],
      answer_match: { mode: 'regex', pattern: '^cd\\s+', case_sensitive: false }
    },
    {
      cardId: 'bash_grep_recursive',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['search', 'files'],
      command: 'grep -r "pattern" /path',
      explanation_translations: {
        en: 'Recursively search for a pattern in files.',
        fr: 'Recherche récursive d\'un motif dans les fichiers.',
        es: 'Búsqueda recursiva de un patrón en archivos.',
        de: 'Rekursiv nach einem Muster in Dateien suchen.',
        ar: 'يبحث تكرارياً عن نمط في الملفات.'
      },
      question_translations: {
        en: 'How do you search for a string across all files in a directory?',
        fr: 'Comment rechercher une chaîne dans tous les fichiers d\'un répertoire ?',
        es: '¿Cómo buscas una cadena en todos los archivos de un directorio?',
        de: 'Wie sucht man nach einem String in allen Dateien eines Verzeichnisses?',
        ar: 'كيف تبحث عن سلسلة في جميع الملفات داخل دليل؟'
      },
      valid_answers: ['grep -r "pattern" /path'],
      answer_match: { mode: 'regex', pattern: '^grep\\s+-r\\s+"[^"]+"\\s+', case_sensitive: false }
    },
    {
      cardId: 'bash_find_delete',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['files', 'cleanup'],
      command: 'find /path -name "*.tmp" -delete',
      explanation_translations: {
        en: 'Find and delete all .tmp files recursively.',
        fr: 'Trouver et supprimer tous les fichiers .tmp de manière récursive.',
        es: 'Encuentra y elimina todos los archivos .tmp recursivamente.',
        de: 'Finde und lösche alle .tmp-Dateien rekursiv.',
        ar: 'يبحث ويحذف جميع ملفات .tmp تكرارياً.'
      },
      question_translations: {
        en: 'How do you delete all .tmp files in a directory tree?',
        fr: 'Comment supprimer tous les fichiers .tmp dans une arborescence ?',
        es: '¿Cómo eliminas todos los archivos .tmp en un árbol de directorios?',
        de: 'Wie löscht man alle .tmp-Dateien in einer Verzeichnisstruktur?',
        ar: 'كيف تحذف جميع ملفات .tmp في شجرة دليل؟'
      },
      valid_answers: ['find /path -name "*.tmp" -delete'],
      answer_match: { mode: 'regex', pattern: '^find\\s+[^\\s]+\\s+-name\\s+"\\.tmp"\\s+-delete', case_sensitive: false }
    },
    {
      cardId: 'bash_pipe_grep',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['pipes', 'filtering'],
      command: 'ps aux | grep nginx',
      explanation_translations: {
        en: 'List all processes and filter for nginx.',
        fr: 'Liste tous les processus et filtre pour nginx.',
        es: 'Lista todos los procesos y filtra por nginx.',
        de: 'Listet alle Prozesse auf und filtert nach nginx.',
        ar: 'يعرض جميع العمليات وينقّي لـ nginx.'
      },
      question_translations: {
        en: 'How do you check if nginx is running?',
        fr: 'Comment vérifier si nginx est en cours d\'exécution ?',
        es: '¿Cómo verificas si nginx está en ejecución?',
        de: 'Wie prüft man, ob nginx läuft?',
        ar: 'كيف تتحقق إذا كان nginx قيد التشغيل؟'
      },
      valid_answers: ['ps aux | grep nginx'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ],
  qa_mode: [
    {
      qaId: 'bash_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What does `chmod +x script.sh` do?',
        fr: 'Que fait `chmod +x script.sh` ?',
        es: '¿Qué hace `chmod +x script.sh`?',
        de: 'Was bewirkt `chmod +x script.sh`?',
        ar: 'ماذا يفعل `chmod +x script.sh`؟'
      },
      explanation_translations: {
        en: 'Makes the script executable.',
        fr: 'Rend le script exécutable.',
        es: 'Hace que el script sea ejecutable.',
        de: 'Macht das Skript ausführbar.',
        ar: 'يجعل النص البرمجي قابلاً للتنفيذ.'
      },
      valid_answers: ['makes it executable', 'adds execute permission'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'bash_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'What is the difference between `$@` and `$*` in a Bash script?',
        fr: 'Quelle est la différence entre `$@` et `$*` dans un script Bash ?',
        es: '¿Cuál es la diferencia entre `$@` y `$*` en un script Bash?',
        de: 'Was ist der Unterschied zwischen `$@` und `$*` in einem Bash-Skript?',
        ar: 'ما الفرق بين `$@` و `$*` في نص باش؟'
      },
      explanation_translations: {
        en: '`$@` treats each argument as separate, while `$*` treats them as a single string.',
        fr: '`$@` traite chaque argument séparément, `$*` les traite comme une seule chaîne.',
        es: '`$@` trata cada argumento por separado, `$*` los trata como una sola cadena.',
        de: '`$@` behandelt jedes Argument separat, `$*` als einzelnen String.',
        ar: '`$@` يعامل كل وسيطة على حدة، بينما `$*` يعاملها كسلسلة واحدة.'
      },
      valid_answers: ['@ separate, * single', 'dollar at vs dollar star'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ]
};
