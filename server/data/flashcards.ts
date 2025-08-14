import { nanoid } from 'nanoid';

export type Lang = 'en' | 'fr' | 'es' | 'de' | 'ar';

export interface Flashcard {
  cardId: string;
  type: 'flashcard';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  command: string; // ALWAYS ENGLISH
  explanation_translations: Record<Lang, string>;
  question_translations: Record<Lang, string>;
  hints_translations?: Record<Lang, string>;
  example_output?: string;
  valid_answers: string[];
  answer_match: any; // see validate.ts
  createdAt?: string;
  notes_translations?: Record<Lang, string>;
}

export interface QAItem {
  qaId: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  question_translations: Record<Lang, string>;
  explanation_translations?: Record<Lang, string>;
  valid_answers: string[];
  answer_match: any;
}

export interface Stack {
  id: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  totalCardCount: number;
  flashcards: Flashcard[];
  qa_mode: QAItem[];
}

export interface FlashcardsPayload {
  stacks: Stack[];
  ui_translations: {
    languages_supported: Lang[];
    strings: Record<string, Record<Lang, string>>;
  };
}

export const data: FlashcardsPayload = {
  stacks: [
    // === Docker (sample few; extend with hundreds on your side) ===
    {
      id: 'docker',
      name: { en: 'Docker', fr: 'Docker', es: 'Docker', de: 'Docker', ar: 'دوكر' },
      description: {
        en: 'Containerisation platform for packaging apps.',
        fr: "Plateforme de conteneurisation pour empaqueter des applications.",
        es: "Plataforma de contenedores para empaquetar aplicaciones.",
        de: "Container-Plattform zum Verpacken von Anwendungen.",
        ar: "منصة حاويات لحزم التطبيقات."
      },
      totalCardCount: 3,
      flashcards: [
        {
          cardId: 'docker_ls_images',
          type: 'flashcard',
          difficulty: 'intermediate',
          tags: ['images', 'inspect'],
          command: 'docker images',
          explanation_translations: {
            en: 'Shows existing Docker images on the host.',
            fr: "Affiche les images Docker existantes sur l'hôte.",
            es: 'Muestra las imágenes Docker existentes en el host.',
            de: 'Zeigt vorhandene Docker-Images auf dem Host an.',
            ar: 'يعرض صور دوكر الموجودة على المضيف.'
          },
          question_translations: {
            en: 'How do we check existing Docker images?',
            fr: 'Comment vérifier les images Docker existantes ?',
            es: '¿Cómo comprobamos las imágenes Docker existentes?',
            de: 'Wie prüfen wir vorhandene Docker-Images?',
            ar: 'كيف نتحقق من صور دوكر الموجودة؟'
          },
          valid_answers: ['docker images', 'docker image ls'],
          answer_match: { mode: 'normalized', case_sensitive: false, normalize_whitespace: true },
          createdAt: new Date().toISOString()
        },
        {
          cardId: 'docker_ps',
          type: 'flashcard',
          difficulty: 'basic',
          tags: ['containers', 'status'],
          command: 'docker ps',
          explanation_translations: {
            en: 'Lists all running containers.',
            fr: "Liste tous les conteneurs en cours d'exécution.",
            es: 'Lista todos los contenedores en ejecución.',
            de: 'Listet alle laufenden Container auf.',
            ar: 'يعرض جميع الحاويات قيد التشغيل.'
          },
          question_translations: {
            en: 'How to list running Docker containers?',
            fr: 'Comment lister les conteneurs Docker en cours ?',
            es: '¿Cómo listar contenedores Docker en ejecución?',
            de: 'Wie listet man laufende Docker-Container auf?',
            ar: 'كيف نعرض الحاويات دوكر قيد التشغيل؟'
          },
          valid_answers: ['docker ps', 'docker container ls'],
          answer_match: { mode: 'normalized', case_sensitive: false, normalize_whitespace: true }
        },
        {
          cardId: 'docker_inspect_image',
          type: 'flashcard',
          difficulty: 'advanced',
          tags: ['inspect', 'images'],
          command: 'docker image inspect <IMAGE>',
          explanation_translations: {
            en: 'Shows low-level information on a Docker image.',
            fr: "Affiche des informations détaillées sur une image Docker.",
            es: 'Muestra información de bajo nivel sobre una imagen Docker.',
            de: 'Zeigt Low-Level-Informationen zu einem Docker-Image an.',
            ar: 'يعرض معلومات منخفضة المستوى عن صورة دوكر.'
          },
          question_translations: {
            en: 'How do you inspect metadata for an image?',
            fr: "Comment inspecter les métadonnées d'une image ?",
            es: '¿Cómo inspeccionas los metadatos de una imagen?',
            de: 'Wie inspiziert man Metadaten für ein Image?',
            ar: 'كيف تفحص بيانات التعريف لصورة؟'
          },
          valid_answers: ['docker image inspect <IMAGE>', 'docker inspect <IMAGE>'],
          answer_match: { mode: 'regex', pattern: '^docker\\s+(image\\s+inspect|inspect)\\s+\\S+', case_sensitive: false }
        }
      ],
      qa_mode: [
        {
          qaId: 'docker_qa_1',
          difficulty: 'advanced',
          question_translations: {
            en: 'What exit code does `docker run` propagate if the container command fails?',
            fr: 'Quel code de sortie `docker run` retourne si la commande du conteneur échoue ?',
            es: '¿Qué código de salida devuelve `docker run` si falla el comando del contenedor?',
            de: 'Welchen Exit-Code gibt `docker run` zurück, wenn der Container-Befehl fehlschlägt?',
            ar: 'ما رمز الخروج الذي يعيد `docker run` إذا فشل أمر الحاوية؟'
          },
          explanation_translations: {
            en: 'It exits with the same status code as the containerized process.',
            fr: 'Se termine avec le même code de statut que le processus conteneurisé.',
            es: 'Finaliza con el mismo código de salida que el proceso en el contenedor.',
            de: 'Beendet sich mit dem gleichen Exit-Code wie der Container-Prozess.',
            ar: 'تنتهي بنفس كود الخروج لعملية الحاوية.'
          },
          valid_answers: ['container exit code', "the container's exit code", 'same exit code as container process'],
          answer_match: { mode: 'normalized', case_sensitive: false, normalize_whitespace: true }
        }
      ]
    },

    // === Git (sample) ===
    {
      id: 'git',
      name: { en: 'Git', fr: 'Git', es: 'Git', de: 'Git', ar: 'جِت' },
      description: {
        en: 'Distributed version control system.',
        fr: 'Système de contrôle de version distribué.',
        es: 'Sistema de control de versiones distribuido.',
        de: 'Verteiltes Versionsverwaltungssystem.',
        ar: 'نظام تحكم بالإصدارات موزع.'
      },
      totalCardCount: 2,
      flashcards: [
        {
          cardId: 'git_clone',
          type: 'flashcard',
          difficulty: 'basic',
          tags: ['clone', 'repo'],
          command: 'git clone <repo-url>',
          explanation_translations: {
            en: 'Clone a repository from a remote URL.',
            fr: 'Cloner un dépôt depuis une URL distante.',
            es: 'Clonar un repositorio desde una URL remota.',
            de: 'Repository von einer Remote-URL klonen.',
            ar: 'استنساخ مستودع من عنوان بعيد.'
          },
          question_translations: {
            en: 'How do you clone a remote repository?',
            fr: 'Comment cloner un dépôt distant ?',
            es: '¿Cómo clonas un repositorio remoto?',
            de: 'Wie klont man ein Remote-Repository?',
            ar: 'كيف تستنسخ مستودع بعيد؟'
          },
          valid_answers: ['git clone <repo-url>'],
          answer_match: { mode: 'regex', pattern: '^git\\s+clone\\s+\\S+', case_sensitive: false }
        },
        {
          cardId: 'git_rebase_interactive',
          type: 'flashcard',
          difficulty: 'advanced',
          tags: ['history', 'rebase'],
          command: 'git rebase -i <base>',
          explanation_translations: {
            en: 'Interactively rewrite commits to squash, reorder, or edit history.',
            fr: "Réécrire interactivement les commits pour fusionner, réordonner ou modifier l'historique.",
            es: 'Reescribir commits de forma interactiva para squash, reordenar o editar historial.',
            de: 'Commits interaktiv umschreiben (squashen, umordnen, bearbeiten).',
            ar: 'إعادة كتابة الالتزامات تفاعليًا لدمجها أو إعادة ترتيبها أو تحرير التاريخ.'
          },
          question_translations: {
            en: 'Which command lets you interactively squash commits?',
            fr: 'Quelle commande permet de squash-er les commits ?',
            es: '¿Qué comando permite hacer squash de commits interactivamente?',
            de: 'Welcher Befehl ermöglicht interaktives Squashen von Commits?',
            ar: 'أي أمر يسمح بدمج الالتزامات تفاعليًا؟'
          },
          valid_answers: ['git rebase -i <base>'],
          answer_match: { mode: 'normalized', case_sensitive: false, normalize_whitespace: true }
        }
      ],
      qa_mode: []
    }
  ],
  ui_translations: {
    languages_supported: ['en', 'fr', 'es', 'de', 'ar'],
    strings: {
      login: { en: 'Login', fr: 'Connexion', es: 'Iniciar sesión', de: 'Anmelden', ar: 'تسجيل الدخول' },
      register: { en: 'Register', fr: "S'inscrire", es: 'Registrarse', de: 'Registrieren', ar: 'تسجيل' },
      flashcard_mode: { en: 'Flashcard Mode', fr: 'Mode Flashcards', es: 'Modo Flashcards', de: 'Karten-Modus', ar: 'وضع الفلاش كارد' },
      qa_mode: { en: 'QA Mode', fr: 'Mode Q/A', es: 'Modo Q/A', de: 'QA-Modus', ar: 'وضع سؤال/جواب' },
      reset_progress_confirm: {
        en: 'Do you really want to reset your progress? This cannot be undone.',
        fr: 'Voulez-vous vraiment réinitialiser votre progression ? Action irréversible.',
        es: '¿Seguro que quieres reiniciar tu progreso? No se puede deshacer.',
        de: 'Möchten Sie Ihren Fortschritt wirklich zurücksetzen? Dies kann nicht rückgängig gemacht werden.',
        ar: 'هل تريد حقًا إعادة تعيين تقدمك؟ لا يمكن التراجع عن ذلك.'
      }
    }
  }
};

