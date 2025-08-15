// server/data/stacks/python.ts
import { Flashcard, QAItem } from '../types';

export const pythonStack = {
  id: 'python',
  name: {
    en: 'Python',
    fr: 'Python',
    es: 'Python',
    de: 'Python',
    ar: 'بايثون'
  },
  description: {
    en: 'High-level programming language for scripting, automation, and backend development.',
    fr: 'Langage de programmation haut niveau pour les scripts, l\'automatisation et le développement backend.',
    es: 'Lenguaje de programación de alto nivel para scripts, automatización y desarrollo backend.',
    de: 'Hochsprachliches Programmiersprache für Skripte, Automatisierung und Backend-Entwicklung.',
    ar: 'لغة برمجة عالية المستوى للنصوص البرمجية، والأتمتة، وتطوير الواجهات الخلفية.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'python_run_script',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['run', 'execute'],
      command: 'python script.py',
      explanation_translations: {
        en: 'Run a Python script from the command line.',
        fr: 'Exécute un script Python depuis la ligne de commande.',
        es: 'Ejecuta un script Python desde la línea de comandos.',
        de: 'Führt ein Python-Skript von der Kommandozeile aus.',
        ar: 'يشغّل نص بايثون من سطر الأوامر.'
      },
      question_translations: {
        en: 'How do you run a Python script named `app.py`?',
        fr: 'Comment exécuter un script Python nommé `app.py` ?',
        es: '¿Cómo ejecutas un script Python llamado `app.py`?',
        de: 'Wie führt man ein Python-Skript namens `app.py` aus?',
        ar: 'كيف تشغل نص بايثون باسم `app.py`؟'
      },
      valid_answers: ['python app.py'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'python_interactive',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['shell', 'repl'],
      command: 'python',
      explanation_translations: {
        en: 'Start the Python interactive shell (REPL).',
        fr: 'Démarre l\'interpréteur interactif Python (REPL).',
        es: 'Inicia el intérprete interactivo de Python (REPL).',
        de: 'Startet die interaktive Python-Shell (REPL).',
        ar: 'يبدأ واجهة بايثون التفاعلية (REPL).'
      },
      question_translations: {
        en: 'How do you open the Python interactive shell?',
        fr: 'Comment ouvrir l\'interpréteur interactif Python ?',
        es: '¿Cómo abres el intérprete interactivo de Python?',
        de: 'Wie öffnet man die interaktive Python-Shell?',
        ar: 'كيف تفتح واجهة بايثون التفاعلية؟'
      },
      valid_answers: ['python'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'pip_install',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['packages', 'install'],
      command: 'pip install requests',
      explanation_translations: {
        en: 'Install a Python package using pip.',
        fr: 'Installe un package Python avec pip.',
        es: 'Instala un paquete Python usando pip.',
        de: 'Installiert ein Python-Paket mit pip.',
        ar: 'يثبّت حزمة بايثون باستخدام pip.'
      },
      question_translations: {
        en: 'How do you install the `requests` library?',
        fr: 'Comment installer la bibliothèque `requests` ?',
        es: '¿Cómo instalas la biblioteca `requests`?',
        de: 'Wie installiert man die `requests`-Bibliothek?',
        ar: 'كيف تثبّت مكتبة `requests`؟'
      },
      valid_answers: ['pip install requests'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'pip_list',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['packages', 'inspect'],
      command: 'pip list',
      explanation_translations: {
        en: 'List all installed Python packages.',
        fr: 'Liste tous les packages Python installés.',
        es: 'Lista todos los paquetes Python instalados.',
        de: 'Listet alle installierten Python-Pakete auf.',
        ar: 'يعرض جميع حزم بايثون المثبتة.'
      },
      question_translations: {
        en: 'How do you see all installed Python packages?',
        fr: 'Comment voir tous les packages Python installés ?',
        es: '¿Cómo ves todos los paquetes Python instalados?',
        de: 'Wie sieht man alle installierten Python-Pakete?',
        ar: 'كيف ترى جميع حزم بايثون المثبتة؟'
      },
      valid_answers: ['pip list'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'virtualenv_create',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['env', 'isolation'],
      command: 'python -m venv myenv',
      explanation_translations: {
        en: 'Create a virtual environment named `myenv`.',
        fr: 'Crée un environnement virtuel nommé `myenv`.',
        es: 'Crea un entorno virtual llamado `myenv`.',
        de: 'Erstellt eine virtuelle Umgebung namens `myenv`.',
        ar: 'ينشئ بيئة افتراضية باسم `myenv`.'
      },
      question_translations: {
        en: 'How do you create a Python virtual environment?',
        fr: 'Comment créer un environnement virtuel Python ?',
        es: '¿Cómo creas un entorno virtual de Python?',
        de: 'Wie erstellt man eine virtuelle Python-Umgebung?',
        ar: 'كيف تنشئ بيئة افتراضية لبايثون؟'
      },
      valid_answers: ['python -m venv myenv'],
      answer_match: { mode: 'regex', pattern: '^python\\s+-m\\s+venv\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'virtualenv_activate',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['env', 'activate'],
      command: 'source myenv/bin/activate',
      explanation_translations: {
        en: 'Activate a Python virtual environment on Linux/macOS.',
        fr: 'Active un environnement virtuel Python sur Linux/macOS.',
        es: 'Activa un entorno virtual de Python en Linux/macOS.',
        de: 'Aktiviert eine virtuelle Python-Umgebung unter Linux/macOS.',
        ar: 'يُفعّل بيئة افتراضية لبايثون على لينكس/ماك.'
      },
      question_translations: {
        en: 'How do you activate a virtual environment on Linux?',
        fr: 'Comment activer un environnement virtuel sous Linux ?',
        es: '¿Cómo activas un entorno virtual en Linux?',
        de: 'Wie aktiviert man eine virtuelle Umgebung unter Linux?',
        ar: 'كيف تفعّل بيئة افتراضية على لينكس؟'
      },
      valid_answers: ['source myenv/bin/activate'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'pip_freeze',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['dependencies', 'export'],
      command: 'pip freeze > requirements.txt',
      explanation_translations: {
        en: 'Export installed packages to a requirements file.',
        fr: 'Exporte les packages installés vers un fichier requirements.',
        es: 'Exporta los paquetes instalados a un archivo requirements.',
        de: 'Exportiert installierte Pakete in eine requirements-Datei.',
        ar: 'يُصدّر الحزم المثبتة إلى ملف متطلبات.'
      },
      question_translations: {
        en: 'How do you save your project dependencies?',
        fr: 'Comment sauvegarder les dépendances de votre projet ?',
        es: '¿Cómo guardas las dependencias de tu proyecto?',
        de: 'Wie speichert man die Projektabhängigkeiten?',
        ar: 'كيف تحفظ تبعيات مشروعك؟'
      },
      valid_answers: ['pip freeze > requirements.txt'],
      answer_match: { mode: 'regex', pattern: '^pip\\s+freeze\\s+>\\s+requirements\\.txt', case_sensitive: false }
    },
    {
      cardId: 'python_version',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['version', 'check'],
      command: 'python --version',
      explanation_translations: {
        en: 'Check the installed Python version.',
        fr: 'Vérifie la version de Python installée.',
        es: 'Comprueba la versión de Python instalada.',
        de: 'Überprüft die installierte Python-Version.',
        ar: 'يتحقق من إصدار بايثون المثبت.'
      },
      question_translations: {
        en: 'How do you check your Python version?',
        fr: 'Comment vérifier votre version de Python ?',
        es: '¿Cómo compruebas tu versión de Python?',
        de: 'Wie prüft man die Python-Version?',
        ar: 'كيف تتحقق من إصدار بايثون لديك؟'
      },
      valid_answers: ['python --version'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'python_module',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['run', 'module'],
      command: 'python -m http.server 8000',
      explanation_translations: {
        en: 'Run a built-in HTTP server on port 8000.',
        fr: 'Exécute un serveur HTTP intégré sur le port 8000.',
        es: 'Ejecuta un servidor HTTP integrado en el puerto 8000.',
        de: 'Startet einen integrierten HTTP-Server auf Port 8000.',
        ar: 'يشغّل خادم HTTP مدمجًا على المنفذ 8000.'
      },
      question_translations: {
        en: 'How do you start a simple HTTP server in Python?',
        fr: 'Comment démarrer un serveur HTTP simple en Python ?',
        es: '¿Cómo inicias un servidor HTTP simple en Python?',
        de: 'Wie startet man einen einfachen HTTP-Server in Python?',
        ar: 'كيف تبدأ خادم HTTP بسيط في بايثون؟'
      },
      valid_answers: ['python -m http.server 8000'],
      answer_match: { mode: 'regex', pattern: '^python\\s+-m\\s+http\\.server\\s+\\d+', case_sensitive: false }
    },
    {
      cardId: 'pip_install_requirements',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['dependencies', 'install'],
      command: 'pip install -r requirements.txt',
      explanation_translations: {
        en: 'Install all packages listed in requirements.txt.',
        fr: 'Installe tous les packages listés dans requirements.txt.',
        es: 'Instala todos los paquetes listados en requirements.txt.',
        de: 'Installiert alle in requirements.txt aufgeführten Pakete.',
        ar: 'يثبّت جميع الحزم المدرجة في requirements.txt.'
      },
      question_translations: {
        en: 'How do you install dependencies from a requirements file?',
        fr: 'Comment installer les dépendances depuis un fichier requirements ?',
        es: '¿Cómo instalas dependencias desde un archivo requirements?',
        de: 'Wie installiert man Abhängigkeiten aus einer requirements-Datei?',
        ar: 'كيف تثبّت التبعيات من ملف متطلبات؟'
      },
      valid_answers: ['pip install -r requirements.txt'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ] as Flashcard[],
  qa_mode: [
    {
      qaId: 'python_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What is the purpose of `__init__.py` in a Python package?',
        fr: 'Quel est le but de `__init__.py` dans un package Python ?',
        es: '¿Cuál es el propósito de `__init__.py` en un paquete Python?',
        de: 'Was ist der Zweck von `__init__.py` in einem Python-Paket?',
        ar: 'ما الغرض من `__init__.py` في حزمة بايثون؟'
      },
      explanation_translations: {
        en: 'It marks a directory as a Python package and can contain initialization code.',
        fr: 'Il marque un répertoire comme package Python et peut contenir du code d\'initialisation.',
        es: 'Marca un directorio como paquete Python y puede contener código de inicialización.',
        de: 'Es markiert ein Verzeichnis als Python-Paket und kann Initialisierungscode enthalten.',
        ar: 'يُعدّ دليلًا كحزمة بايثون ويمكن أن يحتوي على كود تهيئة.'
      },
      valid_answers: ['marks as package', 'initialization code'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'python_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'What is the difference between `list` and `tuple` in Python?',
        fr: 'Quelle est la différence entre `list` et `tuple` en Python ?',
        es: '¿Cuál es la diferencia entre `list` y `tuple` en Python?',
        de: 'Was ist der Unterschied zwischen `list` und `tuple` in Python?',
        ar: 'ما الفرق بين `list` و `tuple` في بايثون؟'
      },
      explanation_translations: {
        en: 'Lists are mutable, tuples are immutable. Tuples are faster and can be used as dictionary keys.',
        fr: 'Les listes sont mutables, les tuples sont immuables. Les tuples sont plus rapides et peuvent être utilisés comme clés de dictionnaire.',
        es: 'Las listas son mutables, las tuplas son inmutables. Las tuplas son más rápidas y pueden usarse como claves de diccionario.',
        de: 'Listen sind veränderbar, Tupel nicht. Tupel sind schneller und können als Dictionary-Schlüssel verwendet werden.',
        ar: 'القوائم قابلة للتغيير، أما الأصناف فهي غير قابلة للتغيير. الأصناف أسرع ويمكن استخدامها كمفاتيح قاموس.'
      },
      valid_answers: ['list mutable, tuple immutable', 'tuple immutable'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'python_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'How do you comment a single line in Python?',
        fr: 'Comment commenter une seule ligne en Python ?',
        es: '¿Cómo comentas una sola línea en Python?',
        de: 'Wie kommentiert man eine einzelne Zeile in Python?',
        ar: 'كيف تعلّق على سطر واحد في بايثون؟'
      },
      explanation_translations: {
        en: 'Use the `#` symbol at the beginning of the line.',
        fr: 'Utilisez le symbole `#` au début de la ligne.',
        es: 'Usa el símbolo `#` al principio de la línea.',
        de: 'Verwende das `#`-Symbol am Anfang der Zeile.',
        ar: 'استخدم رمز `#` في بداية السطر.'
      },
      valid_answers: ['# comment', 'hash symbol'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ] as QAItem[]
};
