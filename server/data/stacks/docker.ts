// server/data/stacks/docker.ts
import { Flashcard, QAItem } from '../flashcards';

export const dockerStack = {
  id: 'docker',
  name: {
    en: 'Docker',
    fr: 'Docker',
    es: 'Docker',
    de: 'Docker',
    ar: 'دوكر'
  },
  description: {
    en: 'Containerization platform for developing, shipping, and running applications.',
    fr: 'Plateforme de conteneurisation pour développer, déployer et exécuter des applications.',
    es: 'Plataforma de contenedores para desarrollar, enviar y ejecutar aplicaciones.',
    de: 'Container-Plattform zur Entwicklung, Bereitstellung und Ausführung von Anwendungen.',
    ar: 'منصة توحيد لتطوير ونشر وتشغيل التطبيقات.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'docker_ps',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['containers', 'status'],
      command: 'docker ps',
      explanation_translations: {
        en: 'List all running containers.',
        fr: 'Liste tous les conteneurs en cours d\'exécution.',
        es: 'Lista todos los contenedores en ejecución.',
        de: 'Listet alle laufenden Container auf.',
        ar: 'يعرض جميع الحاويات قيد التشغيل.'
      },
      question_translations: {
        en: 'How do you list running Docker containers?',
        fr: 'Comment lister les conteneurs Docker en cours ?',
        es: '¿Cómo listas los contenedores Docker en ejecución?',
        de: 'Wie listet man laufende Docker-Container auf?',
        ar: 'كيف تعرض الحاويات دوكر قيد التشغيل؟'
      },
      valid_answers: ['docker ps', 'docker container ls'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'docker_images',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['images', 'inspect'],
      command: 'docker images',
      explanation_translations: {
        en: 'Show all Docker images on the host.',
        fr: 'Affiche toutes les images Docker sur l\'hôte.',
        es: 'Muestra todas las imágenes Docker en el host.',
        de: 'Zeigt alle Docker-Images auf dem Host an.',
        ar: 'يعرض جميع صور دوكر على المضيف.'
      },
      question_translations: {
        en: 'How do you check existing Docker images?',
        fr: 'Comment vérifier les images Docker existantes ?',
        es: '¿Cómo compruebas las imágenes Docker existentes?',
        de: 'Wie prüft man vorhandene Docker-Images?',
        ar: 'كيف تتحقق من صور دوكر الموجودة؟'
      },
      valid_answers: ['docker images', 'docker image ls'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'docker_run',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['run', 'container'],
      command: 'docker run nginx',
      explanation_translations: {
        en: 'Run a container from an image.',
        fr: 'Exécute un conteneur à partir d\'une image.',
        es: 'Ejecuta un contenedor desde una imagen.',
        de: 'Startet einen Container aus einem Image.',
        ar: 'يشغّل حاوية من صورة.'
      },
      question_translations: {
        en: 'How do you run a container from the nginx image?',
        fr: 'Comment exécuter un conteneur à partir de l\'image nginx ?',
        es: '¿Cómo ejecutas un contenedor desde la imagen nginx?',
        de: 'Wie startet man einen Container aus dem nginx-Image?',
        ar: 'كيف تشغل حاوية من صورة nginx؟'
      },
      valid_answers: ['docker run nginx'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'docker_run_detached',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['run', 'background'],
      command: 'docker run -d --name myapp nginx',
      explanation_translations: {
        en: 'Run a container in detached mode with a custom name.',
        fr: 'Exécute un conteneur en mode détaché avec un nom personnalisé.',
        es: 'Ejecuta un contenedor en modo desacoplado con un nombre personalizado.',
        de: 'Startet einen Container im Hintergrund mit einem benutzerdefinierten Namen.',
        ar: 'يشغّل حاوية في الوضع المعزول مع اسم مخصص.'
      },
      question_translations: {
        en: 'How do you run a named container in the background?',
        fr: 'Comment exécuter un conteneur nommé en arrière-plan ?',
        es: '¿Cómo ejecutas un contenedor nombrado en segundo plano?',
        de: 'Wie startet man einen benannten Container im Hintergrund?',
        ar: 'كيف تشغل حاوية باسم في الخلفية؟'
      },
      valid_answers: ['docker run -d --name myapp'],
      answer_match: { mode: 'regex', pattern: '^docker\\s+run\\s+-d\\s+--name\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'docker_exec',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['exec', 'shell'],
      command: 'docker exec -it myapp sh',
      explanation_translations: {
        en: 'Open an interactive shell inside a running container.',
        fr: 'Ouvre un shell interactif dans un conteneur en cours d\'exécution.',
        es: 'Abre un shell interactivo dentro de un contenedor en ejecución.',
        de: 'Öffnet eine interaktive Shell in einem laufenden Container.',
        ar: 'يفتح واجهة سطر أوامر تفاعلية داخل حاوية قيد التشغيل.'
      },
      question_translations: {
        en: 'How do you access a shell inside a running container?',
        fr: 'Comment accéder à un shell dans un conteneur en cours ?',
        es: '¿Cómo accedes a un shell dentro de un contenedor en ejecución?',
        de: 'Wie greift man auf eine Shell in einem laufenden Container zu?',
        ar: 'كيف تدخل إلى واجهة أوامر داخل حاوية قيد التشغيل؟'
      },
      valid_answers: ['docker exec -it myapp sh', 'docker exec -it myapp bash'],
      answer_match: { mode: 'regex', pattern: '^docker\\s+exec\\s+-it\\s+\\S+\\s+(sh|bash)', case_sensitive: false }
    },
    {
      cardId: 'docker_build',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['build', 'image'],
      command: 'docker build -t myapp:v1 .',
      explanation_translations: {
        en: 'Build a Docker image from a Dockerfile in the current directory.',
        fr: 'Construit une image Docker à partir d\'un Dockerfile dans le répertoire courant.',
        es: 'Construye una imagen Docker desde un Dockerfile en el directorio actual.',
        de: 'Erstellt ein Docker-Image aus einem Dockerfile im aktuellen Verzeichnis.',
        ar: 'يبني صورة دوكر من ملف Dockerfile في الدليل الحالي.'
      },
      question_translations: {
        en: 'How do you build a Docker image with a tag?',
        fr: 'Comment construire une image Docker avec un tag ?',
        es: '¿Cómo construyes una imagen Docker con una etiqueta?',
        de: 'Wie baut man ein Docker-Image mit einem Tag?',
        ar: 'كيف تبني صورة دوكر مع وسم؟'
      },
      valid_answers: ['docker build -t myapp:v1 .'],
      answer_match: { mode: 'regex', pattern: '^docker\\s+build\\s+-t\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'docker_volume',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['volumes', 'data'],
      command: 'docker run -v /host/path:/container/path nginx',
      explanation_translations: {
        en: 'Mount a host directory as a volume in the container.',
        fr: 'Monte un répertoire hôte comme un volume dans le conteneur.',
        es: 'Monta un directorio del host como volumen en el contenedor.',
        de: 'Hängt ein Host-Verzeichnis als Volume in den Container ein.',
        ar: 'يربط دليل المضيف كمجلد في الحاوية.'
      },
      question_translations: {
        en: 'How do you share a directory between host and container?',
        fr: 'Comment partager un répertoire entre l\'hôte et le conteneur ?',
        es: '¿Cómo compartes un directorio entre el host y el contenedor?',
        de: 'Wie teilt man ein Verzeichnis zwischen Host und Container?',
        ar: 'كيف تشارك دليلًا بين المضيف والحاوية؟'
      },
      valid_answers: ['docker run -v /host:/container'],
      answer_match: { mode: 'regex', pattern: '^docker\\s+run\\s+-v\\s+', case_sensitive: false }
    },
    {
      cardId: 'docker_network',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['network', 'connect'],
      command: 'docker network create mynet',
      explanation_translations: {
        en: 'Create a custom Docker network for container communication.',
        fr: 'Crée un réseau Docker personnalisé pour la communication entre conteneurs.',
        es: 'Crea una red Docker personalizada para la comunicación entre contenedores.',
        de: 'Erstellt ein benutzerdefiniertes Docker-Netzwerk für die Container-Kommunikation.',
        ar: 'ينشئ شبكة دوكر مخصصة للتواصل بين الحاويات.'
      },
      question_translations: {
        en: 'How do you create a custom Docker network?',
        fr: 'Comment créer un réseau Docker personnalisé ?',
        es: '¿Cómo creas una red Docker personalizada?',
        de: 'Wie erstellt man ein benutzerdefiniertes Docker-Netzwerk?',
        ar: 'كيف تنشئ شبكة دوكر مخصصة؟'
      },
      valid_answers: ['docker network create mynet'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'docker_compose',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['compose', 'multi-container'],
      command: 'docker-compose up',
      explanation_translations: {
        en: 'Start services defined in docker-compose.yml.',
        fr: 'Démarre les services définis dans docker-compose.yml.',
        es: 'Inicia los servicios definidos en docker-compose.yml.',
        de: 'Startet die in docker-compose.yml definierten Dienste.',
        ar: 'يشغّل الخدمات المحددة في ملف docker-compose.yml.'
      },
      question_translations: {
        en: 'How do you start all services in a compose file?',
        fr: 'Comment démarrer tous les services d\'un fichier compose ?',
        es: '¿Cómo inicias todos los servicios en un archivo compose?',
        de: 'Wie startet man alle Dienste in einer Compose-Datei?',
        ar: 'كيف تبدأ جميع الخدمات في ملف compose؟'
      },
      valid_answers: ['docker-compose up', 'docker compose up'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'docker_logs',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['logs', 'debug'],
      command: 'docker logs myapp',
      explanation_translations: {
        en: 'View logs from a running container.',
        fr: 'Affiche les journaux d\'un conteneur en cours d\'exécution.',
        es: 'Muestra los registros de un contenedor en ejecución.',
        de: 'Zeigt Protokolle eines laufenden Containers an.',
        ar: 'يعرض السجلات من حاوية قيد التشغيل.'
      },
      question_translations: {
        en: 'How do you check the logs of a container?',
        fr: 'Comment consulter les journaux d\'un conteneur ?',
        es: '¿Cómo revisas los registros de un contenedor?',
        de: 'Wie prüft man die Protokolle eines Containers?',
        ar: 'كيف تتحقق من سجلات حاوية؟'
      },
      valid_answers: ['docker logs myapp'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ],
  qa_mode: [
    {
      qaId: 'docker_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?',
        fr: 'Quelle est la différence entre `CMD` et `ENTRYPOINT` dans un Dockerfile ?',
        es: '¿Cuál es la diferencia entre `CMD` y `ENTRYPOINT` en un Dockerfile?',
        de: 'Was ist der Unterschied zwischen `CMD` und `ENTRYPOINT` in einem Dockerfile?',
        ar: 'ما الفرق بين `CMD` و `ENTRYPOINT` في ملف Dockerfile؟'
      },
      explanation_translations: {
        en: '`CMD` provides defaults, `ENTRYPOINT` defines the executable. `CMD` can be overridden at runtime.',
        fr: '`CMD` fournit des valeurs par défaut, `ENTRYPOINT` définit l\'exécutable. `CMD` peut être remplacé au runtime.',
        es: '`CMD` proporciona valores por defecto, `ENTRYPOINT` define el ejecutable. `CMD` puede sobrescribirse en tiempo de ejecución.',
        de: '`CMD` liefert Standardwerte, `ENTRYPOINT` definiert die ausführbare Datei. `CMD` kann zur Laufzeit überschrieben werden.',
        ar: '`CMD` يوفر افتراضيات، `ENTRYPOINT` يعرّف القابل للتنفيذ. يمكن تجاوز `CMD` أثناء التشغيل.'
      },
      valid_answers: ['cmd defaults, entrypoint executable', 'cmd overridable'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'docker_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'Why use multi-stage builds in Docker?',
        fr: 'Pourquoi utiliser des builds multi-étapes dans Docker ?',
        es: '¿Por qué usar builds multi-etapa en Docker?',
        de: 'Warum mehrstufige Builds in Docker verwenden?',
        ar: 'لماذا تستخدم البناء متعدد المراحل في دوكر؟'
      },
      explanation_translations: {
        en: 'To reduce final image size by separating build-time and runtime dependencies.',
        fr: 'Réduire la taille finale de l\'image en séparant les dépendances de build et d\'exécution.',
        es: 'Reducir el tamaño final de la imagen separando dependencias de compilación y ejecución.',
        de: 'Um die endgültige Image-Größe zu reduzieren, indem Build- und Laufzeitabhängigkeiten getrennt werden.',
        ar: 'لتقليل حجم الصورة النهائية بفصل تبعيات البناء عن التبعيات أثناء التشغيل.'
      },
      valid_answers: ['reduce image size', 'separate build and runtime'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'docker_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'What does `docker pull` do?',
        fr: 'Que fait `docker pull` ?',
        es: '¿Qué hace `docker pull`?',
        de: 'Was bewirkt `docker pull`?',
        ar: 'ماذا يفعل `docker pull`؟'
      },
      explanation_translations: {
        en: 'Downloads an image from a registry.',
        fr: 'Télécharge une image depuis un registre.',
        es: 'Descarga una imagen desde un registro.',
        de: 'Lädt ein Image aus einer Registry herunter.',
        ar: 'يحمل صورة من سجل.'
      },
      valid_answers: ['downloads image', 'pulls from registry'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ]
};
