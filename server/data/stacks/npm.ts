// server/data/stacks/npm.ts
import { Flashcard, QAItem } from '../flashcards';

export const npmStack = {
  id: 'npm',
  name: {
    en: 'NPM',
    fr: 'NPM',
    es: 'NPM',
    de: 'NPM',
    ar: 'إن بي إم'
  },
  description: {
    en: 'Package manager for Node.js and JavaScript, used to install, manage, and publish packages.',
    fr: 'Gestionnaire de paquets pour Node.js et JavaScript, utilisé pour installer, gérer et publier des paquets.',
    es: 'Administrador de paquetes para Node.js y JavaScript, usado para instalar, gestionar y publicar paquetes.',
    de: 'Paketmanager für Node.js und JavaScript zum Installieren, Verwalten und Veröffentlichen von Paketen.',
    ar: 'مدير الحزم لـ Node.js وJavaScript، يستخدم لتثبيت وإدارة ونشر الحزم.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'npm_install',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['packages', 'install'],
      command: 'npm install',
      explanation_translations: {
        en: 'Install all dependencies listed in package.json.',
        fr: 'Installe toutes les dépendances listées dans package.json.',
        es: 'Instala todas las dependencias listadas en package.json.',
        de: 'Installiert alle in package.json aufgeführten Abhängigkeiten.',
        ar: 'يثبّت جميع التبعيات المدرجة في ملف package.json.'
      },
      question_translations: {
        en: 'How do you install all project dependencies?',
        fr: 'Comment installer toutes les dépendances du projet ?',
        es: '¿Cómo instalas todas las dependencias del proyecto?',
        de: 'Wie installiert man alle Projektabhängigkeiten?',
        ar: 'كيف تثبّت جميع تبعيات المشروع؟'
      },
      valid_answers: ['npm install', 'npm i'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'npm_install_package',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['packages', 'install'],
      command: 'npm install axios',
      explanation_translations: {
        en: 'Install a specific package (e.g., axios) as a dependency.',
        fr: 'Installe un package spécifique (ex: axios) comme dépendance.',
        es: 'Instala un paquete específico (ej: axios) como dependencia.',
        de: 'Installiert ein bestimmtes Paket (z.B. axios) als Abhängigkeit.',
        ar: 'يثبّت حزمة محددة (مثل axios) كتبعية.'
      },
      question_translations: {
        en: 'How do you add the `axios` library to your project?',
        fr: 'Comment ajouter la bibliothèque `axios` à votre projet ?',
        es: '¿Cómo agregas la biblioteca `axios` a tu proyecto?',
        de: 'Wie fügt man die `axios`-Bibliothek zum Projekt hinzu?',
        ar: 'كيف تضيف مكتبة `axios` إلى مشروعك؟'
      },
      valid_answers: ['npm install axios'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'npm_install_dev',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['dev', 'dependencies'],
      command: 'npm install --save-dev eslint',
      explanation_translations: {
        en: 'Install a package as a development dependency.',
        fr: 'Installe un package comme dépendance de développement.',
        es: 'Instala un paquete como dependencia de desarrollo.',
        de: 'Installiert ein Paket als Entwicklungsabhängigkeit.',
        ar: 'يثبّت حزمة كتبعية تطوير.'
      },
      question_translations: {
        en: 'How do you install ESLint for development only?',
        fr: 'Comment installer ESLint uniquement pour le développement ?',
        es: '¿Cómo instalas ESLint solo para desarrollo?',
        de: 'Wie installiert man ESLint nur für die Entwicklung?',
        ar: 'كيف تثبّت ESLint للتطوير فقط؟'
      },
      valid_answers: ['npm install --save-dev eslint', 'npm install -D eslint'],
      answer_match: { mode: 'regex', pattern: '^npm\\s+install\\s+(-D|--save-dev)\\s+eslint', case_sensitive: false }
    },
    {
      cardId: 'npm_init',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['setup', 'project'],
      command: 'npm init',
      explanation_translations: {
        en: 'Initialize a new Node.js project and create package.json.',
        fr: 'Initialise un nouveau projet Node.js et crée package.json.',
        es: 'Inicializa un nuevo proyecto Node.js y crea package.json.',
        de: 'Initialisiert ein neues Node.js-Projekt und erstellt package.json.',
        ar: 'يبدأ مشروع Node.js جديد وينشئ ملف package.json.'
      },
      question_translations: {
        en: 'How do you start a new Node.js project?',
        fr: 'Comment démarrer un nouveau projet Node.js ?',
        es: '¿Cómo inicias un nuevo proyecto Node.js?',
        de: 'Wie startet man ein neues Node.js-Projekt?',
        ar: 'كيف تبدأ مشروع Node.js جديد؟'
      },
      valid_answers: ['npm init'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'npm_run',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['scripts', 'run'],
      command: 'npm run build',
      explanation_translations: {
        en: 'Run a custom script defined in package.json.',
        fr: 'Exécute un script personnalisé défini dans package.json.',
        es: 'Ejecuta un script personalizado definido en package.json.',
        de: 'Führt ein benutzerdefiniertes Skript aus package.json aus.',
        ar: 'يشغّل نصاً مخصصاً محدداً في ملف package.json.'
      },
      question_translations: {
        en: 'How do you run the `build` script in package.json?',
        fr: 'Comment exécuter le script `build` dans package.json ?',
        es: '¿Cómo ejecutas el script `build` en package.json?',
        de: 'Wie führt man das `build`-Skript in package.json aus?',
        ar: 'كيف تشغل نص `build` في ملف package.json؟'
      },
      valid_answers: ['npm run build'],
      answer_match: { mode: 'regex', pattern: '^npm\\s+run\\s+build', case_sensitive: false }
    },
    {
      cardId: 'npm_list',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['inspect', 'dependencies'],
      command: 'npm list',
      explanation_translations: {
        en: 'List installed packages and their dependency tree.',
        fr: 'Liste les packages installés et leur arborescence de dépendances.',
        es: 'Lista los paquetes instalados y su árbol de dependencias.',
        de: 'Listet installierte Pakete und deren Abhängigkeitsbaum auf.',
        ar: 'يعرض الحزم المثبتة وشجرة تبعياتها.'
      },
      question_translations: {
        en: 'How do you see the dependency tree of your project?',
        fr: 'Comment voir l\'arborescence des dépendances de votre projet ?',
        es: '¿Cómo ves el árbol de dependencias de tu proyecto?',
        de: 'Wie sieht man den Abhängigkeitsbaum des Projekts?',
        ar: 'كيف ترى شجرة تبعيات مشروعك؟'
      },
      valid_answers: ['npm list'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'npm_outdated',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['update', 'check'],
      command: 'npm outdated',
      explanation_translations: {
        en: 'Check for outdated packages.',
        fr: 'Vérifie les packages obsolètes.',
        es: 'Comprueba si hay paquetes desactualizados.',
        de: 'Prüft auf veraltete Pakete.',
        ar: 'يتحقق من الحزم القديمة.'
      },
      question_translations: {
        en: 'How do you check which packages need updating?',
        fr: 'Comment vérifier quels packages doivent être mis à jour ?',
        es: '¿Cómo compruebas qué paquetes necesitan actualización?',
        de: 'Wie prüft man, welche Pakete aktualisiert werden müssen?',
        ar: 'كيف تتحقق من الحزم التي تحتاج تحديثاً؟'
      },
      valid_answers: ['npm outdated'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'npm_update',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['update', 'upgrade'],
      command: 'npm update',
      explanation_translations: {
        en: 'Update all packages to their latest compatible versions.',
        fr: 'Met à jour tous les packages vers leurs dernières versions compatibles.',
        es: 'Actualiza todos los paquetes a sus últimas versiones compatibles.',
        de: 'Aktualisiert alle Pakete auf die neuesten kompatiblen Versionen.',
        ar: 'يحدّث جميع الحزم إلى أحدث إصداراتها المتوافقة.'
      },
      question_translations: {
        en: 'How do you update all dependencies to the latest version?',
        fr: 'Comment mettre à jour toutes les dépendances vers la dernière version ?',
        es: '¿Cómo actualizas todas las dependencias a la última versión?',
        de: 'Wie aktualisiert man alle Abhängigkeiten auf die neueste Version?',
        ar: 'كيف تحدّث جميع التبعيات إلى أحدث إصدار؟'
      },
      valid_answers: ['npm update'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'npm_uninstall',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['cleanup', 'remove'],
      command: 'npm uninstall lodash',
      explanation_translations: {
        en: 'Remove a package from your project.',
        fr: 'Supprime un package de votre projet.',
        es: 'Elimina un paquete de tu proyecto.',
        de: 'Entfernt ein Paket aus Ihrem Projekt.',
        ar: 'يحذف حزمة من مشروعك.'
      },
      question_translations: {
        en: 'How do you remove the `lodash` package?',
        fr: 'Comment supprimer le package `lodash` ?',
        es: '¿Cómo eliminas el paquete `lodash`?',
        de: 'Wie entfernt man das `lodash`-Paket?',
        ar: 'كيف تحذف حزمة `lodash`؟'
      },
      valid_answers: ['npm uninstall lodash', 'npm remove lodash'],
      answer_match: { mode: 'regex', pattern: '^npm\\s+(uninstall|remove)\\s+lodash', case_sensitive: false }
    },
    {
      cardId: 'npm_global_install',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['global', 'cli'],
      command: 'npm install -g typescript',
      explanation_translations: {
        en: 'Install a package globally so it can be used as a CLI tool.',
        fr: 'Installe un package globalement pour pouvoir l\'utiliser comme outil CLI.',
        es: 'Instala un paquete globalmente para usarlo como herramienta CLI.',
        de: 'Installiert ein Paket global, sodass es als CLI-Tool verwendet werden kann.',
        ar: 'يثبّت حزمة عالمياً لاستخدامها كأداة سطر أوامر.'
      },
      question_translations: {
        en: 'How do you install TypeScript globally?',
        fr: 'Comment installer TypeScript globalement ?',
        es: '¿Cómo instalas TypeScript globalmente?',
        de: 'Wie installiert man TypeScript global?',
        ar: 'كيف تثبّت بايثون عالمياً؟'
      },
      valid_answers: ['npm install -g typescript'],
      answer_match: { mode: 'regex', pattern: '^npm\\s+install\\s+-g\\s+typescript', case_sensitive: false }
    }
  ],
  qa_mode: [
    {
      qaId: 'npm_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What is the difference between `dependencies` and `devDependencies`?',
        fr: 'Quelle est la différence entre `dependencies` et `devDependencies` ?',
        es: '¿Cuál es la diferencia entre `dependencies` y `devDependencies`?',
        de: 'Was ist der Unterschied zwischen `dependencies` und `devDependencies`?',
        ar: 'ما الفرق بين `dependencies` و `devDependencies`؟'
      },
      explanation_translations: {
        en: '`dependencies` are required for the app to run. `devDependencies` are only needed for development (e.g., linters, bundlers).',
        fr: '`dependencies` sont nécessaires pour que l\'app fonctionne. `devDependencies` sont seulement nécessaires pour le développement (ex: linters, bundlers).',
        es: '`dependencies` son necesarias para que la app funcione. `devDependencies` solo se necesitan para desarrollo (ej: linters, bundlers).',
        de: '`dependencies` werden zum Ausführen der App benötigt. `devDependencies` nur für die Entwicklung (z.B. Linter, Bundler).',
        ar: '`dependencies` مطلوبة لتشغيل التطبيق. `devDependencies` مطلوبة فقط للتطوير (مثل أدوات التحليل، أدوات التجميع).'
      },
      valid_answers: ['runtime vs dev', 'dependencies for prod, devDependencies for dev'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'npm_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'What does `npm ci` do, and when should you use it?',
        fr: 'Que fait `npm ci` et quand devez-vous l\'utiliser ?',
        es: '¿Qué hace `npm ci` y cuándo debes usarlo?',
        de: 'Was bewirkt `npm ci` und wann sollte man es verwenden?',
        ar: 'ماذا يفعل `npm ci`، ومتى يجب استخدامه؟'
      },
      explanation_translations: {
        en: '`npm ci` installs dependencies from package-lock.json, faster and more reliable than `npm install`. Use it in CI/CD pipelines.',
        fr: '`npm ci` installe les dépendances depuis package-lock.json, plus rapide et fiable que `npm install`. À utiliser dans les pipelines CI/CD.',
        es: '`npm ci` instala dependencias desde package-lock.json, más rápido y fiable que `npm install`. Úsalo en pipelines CI/CD.',
        de: '`npm ci` installiert Abhängigkeiten aus package-lock.json, schneller und zuverlässiger als `npm install`. Verwende es in CI/CD-Pipelines.',
        ar: '`npm ci` يثبّت التبعيات من ملف package-lock.json، أسرع وأكثر موثوقية من `npm install`. استخدمه في خطوط أنابيب CI/CD.'
      },
      valid_answers: ['faster install from lockfile', 'use in ci/cd'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'npm_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'What is the purpose of `package-lock.json`?',
        fr: 'Quel est le but de `package-lock.json` ?',
        es: '¿Cuál es el propósito de `package-lock.json`?',
        de: 'Was ist der Zweck von `package-lock.json`?',
        ar: 'ما الغرض من `package-lock.json`؟'
      },
      explanation_translations: {
        en: 'It locks dependency versions to ensure consistent installs across environments.',
        fr: 'Il verrouille les versions des dépendances pour garantir des installations cohérentes entre environnements.',
        es: 'Bloquea las versiones de las dependencias para garantizar instalaciones consistentes entre entornos.',
        de: 'Es fixiert Abhängigkeitsversionen, um konsistente Installationen über Umgebungen hinweg sicherzustellen.',
        ar: 'يُثبّت إصدارات التبعيات لضمان تثبيتات متسقة عبر البيئات.'
      },
      valid_answers: ['lock versions', 'ensure consistent installs'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ]
};
