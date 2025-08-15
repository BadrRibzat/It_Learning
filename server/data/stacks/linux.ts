// server/data/stacks/linux.ts
import { Flashcard, QAItem } from '../types';

export const linuxStack = {
  id: 'linux',
  name: {
    en: 'Linux',
    fr: 'Linux',
    es: 'Linux',
    de: 'Linux',
    ar: 'لينكس'
  },
  description: {
    en: 'Open-source operating system used in servers, cloud infrastructure, and development environments.',
    fr: 'Système d\'exploitation open-source utilisé dans les serveurs, l\'infrastructure cloud et les environnements de développement.',
    es: 'Sistema operativo de código abierto utilizado en servidores, infraestructura en la nube y entornos de desarrollo.',
    de: 'Open-Source-Betriebssystem für Server, Cloud-Infrastruktur und Entwicklungsumgebungen.',
    ar: 'نظام تشغيل مفتوح المصدر يستخدم في الخوادم، والبنية التحتية السحابية، وبيئات التطوير.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'linux_pwd',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['navigation', 'path'],
      command: 'pwd',
      explanation_translations: {
        en: 'Print the current working directory.',
        fr: 'Affiche le répertoire de travail courant.',
        es: 'Muestra el directorio de trabajo actual.',
        de: 'Gibt das aktuelle Arbeitsverzeichnis aus.',
        ar: 'يعرض الدليل الحالي للعمل.'
      },
      question_translations: {
        en: 'How do you see your current directory path?',
        fr: 'Comment voir le chemin de votre répertoire courant ?',
        es: '¿Cómo ves la ruta de tu directorio actual?',
        de: 'Wie sieht man den Pfad des aktuellen Verzeichnisses?',
        ar: 'كيف ترى مسار دليلك الحالي؟'
      },
      valid_answers: ['pwd'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'linux_ls_long',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['files', 'list'],
      command: 'ls -la',
      explanation_translations: {
        en: 'List all files, including hidden ones, with detailed information.',
        fr: 'Liste tous les fichiers, y compris les cachés, avec des détails.',
        es: 'Lista todos los archivos, incluidos los ocultos, con información detallada.',
        de: 'Listet alle Dateien, inklusive versteckter, mit Details auf.',
        ar: 'يعرض جميع الملفات، بما في ذلك المخفية، مع معلومات مفصلة.'
      },
      question_translations: {
        en: 'How do you list all files, including hidden ones?',
        fr: 'Comment lister tous les fichiers, y compris les cachés ?',
        es: '¿Cómo listas todos los archivos, incluidos los ocultos?',
        de: 'Wie listet man alle Dateien, inklusive versteckter?',
        ar: 'كيف تعرض جميع الملفات، بما في ذلك المخفية؟'
      },
      valid_answers: ['ls -la', 'ls -al'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'linux_mkdir',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['directories', 'create'],
      command: 'mkdir project',
      explanation_translations: {
        en: 'Create a new directory.',
        fr: 'Crée un nouveau répertoire.',
        es: 'Crea un nuevo directorio.',
        de: 'Erstellt ein neues Verzeichnis.',
        ar: 'ينشئ دليلًا جديدًا.'
      },
      question_translations: {
        en: 'How do you create a directory named "project"?',
        fr: 'Comment créer un répertoire nommé "project" ?',
        es: '¿Cómo creas un directorio llamado "project"?',
        de: 'Wie erstellt man ein Verzeichnis namens "project"?',
        ar: 'كيف تنشئ دليلًا باسم "project"؟'
      },
      valid_answers: ['mkdir project'],
      answer_match: { mode: 'regex', pattern: '^mkdir\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'linux_cp',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['files', 'copy'],
      command: 'cp file.txt /backup/',
      explanation_translations: {
        en: 'Copy a file to another location.',
        fr: 'Copie un fichier vers un autre emplacement.',
        es: 'Copia un archivo a otra ubicación.',
        de: 'Kopiert eine Datei an einen anderen Ort.',
        ar: 'ينسخ ملفًا إلى موقع آخر.'
      },
      question_translations: {
        en: 'How do you copy a file to a backup directory?',
        fr: 'Comment copier un fichier vers un répertoire de sauvegarde ?',
        es: '¿Cómo copias un archivo a un directorio de copia de seguridad?',
        de: 'Wie kopiert man eine Datei in ein Backup-Verzeichnis?',
        ar: 'كيف تنسخ ملفًا إلى دليل نسخ احتياطي؟'
      },
      valid_answers: ['cp file.txt /backup/'],
      answer_match: { mode: 'regex', pattern: '^cp\\s+\\S+\\s+/backup/', case_sensitive: false }
    },
    {
      cardId: 'linux_mv',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['files', 'move'],
      command: 'mv old.txt new.txt',
      explanation_translations: {
        en: 'Move or rename a file.',
        fr: 'Déplacer ou renommer un fichier.',
        es: 'Mueve o renombra un archivo.',
        de: 'Verschiebt oder benennt eine Datei um.',
        ar: 'ينقل أو يُعيد تسمية ملف.'
      },
      question_translations: {
        en: 'How do you rename a file from old.txt to new.txt?',
        fr: 'Comment renommer un fichier de old.txt à new.txt ?',
        es: '¿Cómo renombras un archivo de old.txt a new.txt?',
        de: 'Wie benennt man eine Datei von old.txt in new.txt um?',
        ar: 'كيف تُعيد تسمية ملف من old.txt إلى new.txt؟'
      },
      valid_answers: ['mv old.txt new.txt'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'linux_rm',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['files', 'delete'],
      command: 'rm file.txt',
      explanation_translations: {
        en: 'Delete a file (irreversible).',
        fr: 'Supprimer un fichier (irréversible).',
        es: 'Elimina un archivo (irreversible).',
        de: 'Löscht eine Datei (unwiderruflich).',
        ar: 'يحذف ملفًا (لا يمكن التراجع).'
      },
      question_translations: {
        en: 'How do you delete a file?',
        fr: 'Comment supprimer un fichier ?',
        es: '¿Cómo eliminas un archivo?',
        de: 'Wie löscht man eine Datei?',
        ar: 'كيف تحذف ملفًا؟'
      },
      valid_answers: ['rm file.txt'],
      answer_match: { mode: 'regex', pattern: '^rm\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'linux_rm_recursive',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['directories', 'cleanup'],
      command: 'rm -rf mydir',
      explanation_translations: {
        en: 'Recursively delete a directory and all its contents.',
        fr: 'Supprime récursivement un répertoire et tout son contenu.',
        es: 'Elimina recursivamente un directorio y todo su contenido.',
        de: 'Löscht rekursiv ein Verzeichnis und dessen Inhalt.',
        ar: 'يحذف دليلًا وجميع محتوياته تكرارياً.'
      },
      question_translations: {
        en: 'How do you delete a directory and all its files?',
        fr: 'Comment supprimer un répertoire et tous ses fichiers ?',
        es: '¿Cómo eliminas un directorio y todos sus archivos?',
        de: 'Wie löscht man ein Verzeichnis und alle seine Dateien?',
        ar: 'كيف تحذف دليلًا وجميع ملفاته؟'
      },
      valid_answers: ['rm -rf mydir'],
      answer_match: { mode: 'regex', pattern: '^rm\\s+-rf\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'linux_chmod',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['permissions', 'security'],
      command: 'chmod 755 script.sh',
      explanation_translations: {
        en: 'Change file permissions to rwxr-xr-x.',
        fr: 'Change les permissions du fichier en rwxr-xr-x.',
        es: 'Cambia los permisos del archivo a rwxr-xr-x.',
        de: 'Ändert die Dateiberechtigungen zu rwxr-xr-x.',
        ar: 'يُغيّر أذونات الملف إلى rwxr-xr-x.'
      },
      question_translations: {
        en: 'How do you make a script executable for owner and readable for others?',
        fr: 'Comment rendre un script exécutable pour le propriétaire et lisible pour les autres ?',
        es: '¿Cómo haces un script ejecutable para el propietario y legible para otros?',
        de: 'Wie macht man ein Skript für den Besitzer ausführbar und für andere lesbar?',
        ar: 'كيف تجعل نصًا قابلاً للتنفيذ للمالك وقابل للقراءة للآخرين؟'
      },
      valid_answers: ['chmod 755 script.sh'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'linux_chown',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['permissions', 'ownership'],
      command: 'chown user:group file.txt',
      explanation_translations: {
        en: 'Change the owner and group of a file.',
        fr: 'Change le propriétaire et le groupe d\'un fichier.',
        es: 'Cambia el propietario y grupo de un archivo.',
        de: 'Ändert den Besitzer und die Gruppe einer Datei.',
        ar: 'يُغيّر مالك وجماعة الملف.'
      },
      question_translations: {
        en: 'How do you change the owner and group of a file?',
        fr: 'Comment changer le propriétaire et le groupe d\'un fichier ?',
        es: '¿Cómo cambias el propietario y grupo de un archivo?',
        de: 'Wie ändert man Besitzer und Gruppe einer Datei?',
        ar: 'كيف تُغيّر مالك وجماعة الملف؟'
      },
      valid_answers: ['chown user:group file.txt'],
      answer_match: { mode: 'regex', pattern: '^chown\\s+\\S+:\\S+\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'linux_find',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['search', 'files'],
      command: 'find /home -name "*.log" -mtime -7',
      explanation_translations: {
        en: 'Find all .log files modified in the last 7 days.',
        fr: 'Trouve tous les fichiers .log modifiés dans les 7 derniers jours.',
        es: 'Encuentra todos los archivos .log modificados en los últimos 7 días.',
        de: 'Findet alle .log-Dateien, die in den letzten 7 Tagen geändert wurden.',
        ar: 'يبحث عن جميع ملفات .log المعدّلة في الأيام السبعة الماضية.'
      },
      question_translations: {
        en: 'How do you find log files modified in the last week?',
        fr: 'Comment trouver les fichiers log modifiés dans la dernière semaine ?',
        es: '¿Cómo encuentras archivos log modificados en la última semana?',
        de: 'Wie findet man Log-Dateien, die in der letzten Woche geändert wurden?',
        ar: 'كيف تبحث عن ملفات السجل المعدّلة في الأسبوع الماضي؟'
      },
      valid_answers: ['find /home -name "*.log" -mtime -7'],
      answer_match: { mode: 'regex', pattern: '^find\\s+[^\\s]+\\s+-name\\s+"\\.log"\\s+-mtime\\s+-\\d+', case_sensitive: false }
    }
  ] as Flashcard[],
  qa_mode: [
    {
      qaId: 'linux_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What does `sudo` do?',
        fr: 'Que fait `sudo` ?',
        es: '¿Qué hace `sudo`?',
        de: 'Was bewirkt `sudo`?',
        ar: 'ماذا يفعل `sudo`؟'
      },
      explanation_translations: {
        en: '`sudo` allows a permitted user to execute a command as the superuser or another user.',
        fr: '`sudo` permet à un utilisateur autorisé d\'exécuter une commande en tant que superutilisateur ou autre utilisateur.',
        es: '`sudo` permite a un usuario autorizado ejecutar un comando como superusuario u otro usuario.',
        de: '`sudo` erlaubt einem berechtigten Benutzer, einen Befehl als Superuser oder anderer Benutzer auszuführen.',
        ar: '`sudo` يسمح للمستخدم المسموح له بتنفيذ أمر كمشرف أو مستخدم آخر.'
      },
      valid_answers: ['run as superuser', 'execute as root'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'linux_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'What is the difference between `>` and `>>` in Linux?',
        fr: 'Quelle est la différence entre `>` et `>>` en Linux ?',
        es: '¿Cuál es la diferencia entre `>` y `>>` en Linux?',
        de: 'Was ist der Unterschied zwischen `>` und `>>` in Linux?',
        ar: 'ما الفرق بين `>` و `>>` في لينكس؟'
      },
      explanation_translations: {
        en: '`>` overwrites a file, `>>` appends to it.',
        fr: '`>` écrase un fichier, `>>` ajoute à la fin.',
        es: '`>` sobrescribe un archivo, `>>` añade al final.',
        de: '`>` überschreibt eine Datei, `>>` hängt an.',
        ar: '`>` يُ_OVERWRITE_ ملفًا، `>>` يُضيف إليه.'
      },
      valid_answers: ['overwrite vs append', '> overwrites, >> appends'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'linux_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'How do you check running processes?',
        fr: 'Comment vérifier les processus en cours ?',
        es: '¿Cómo compruebas los procesos en ejecución?',
        de: 'Wie prüft man laufende Prozesse?',
        ar: 'كيف تتحقق من العمليات قيد التشغيل؟'
      },
      explanation_translations: {
        en: 'Use `ps aux` or `top` to view running processes.',
        fr: 'Utilisez `ps aux` ou `top` pour afficher les processus en cours.',
        es: 'Usa `ps aux` o `top` para ver los procesos en ejecución.',
        de: 'Verwende `ps aux` oder `top`, um laufende Prozesse anzuzeigen.',
        ar: 'استخدم `ps aux` أو `top` لعرض العمليات قيد التشغيل.'
      },
      valid_answers: ['ps aux', 'top'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ] as QAItem[]
};
