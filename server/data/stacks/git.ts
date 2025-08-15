// server/data/stacks/git.ts
import { Flashcard, QAItem } from '../types';

export const gitStack = {
  id: 'git',
  name: {
    en: 'Git',
    fr: 'Git',
    es: 'Git',
    de: 'Git',
    ar: 'جِت'
  },
  description: {
    en: 'Distributed version control system for tracking code changes.',
    fr: 'Système de contrôle de version distribué pour suivre les modifications de code.',
    es: 'Sistema de control de versiones distribuido para rastrear cambios en el código.',
    de: 'Verteiltes Versionskontrollsystem zur Nachverfolgung von Codeänderungen.',
    ar: 'نظام تحكم بالإصدارات موزع لتتبع تغييرات الكود.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'git_clone',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['repo', 'setup'],
      command: 'git clone <repo-url>',
      explanation_translations: {
        en: 'Clone a remote repository to your local machine.',
        fr: 'Cloner un dépôt distant vers votre machine locale.',
        es: 'Clona un repositorio remoto a tu máquina local.',
        de: 'Klont ein Remote-Repository auf deine lokale Maschine.',
        ar: 'يستنسخ مستودع بعيد إلى جهازك المحلي.'
      },
      question_translations: {
        en: 'How do you copy a remote Git repository locally?',
        fr: 'Comment copier un dépôt Git distant localement ?',
        es: '¿Cómo copias un repositorio Git remoto localmente?',
        de: 'Wie kopiert man ein entferntes Git-Repository lokal?',
        ar: 'كيف تنسخ مستودع جيت بعيد محلياً؟'
      },
      valid_answers: ['git clone <repo-url>'],
      answer_match: { mode: 'regex', pattern: '^git\\s+clone\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'git_status',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['status', 'check'],
      command: 'git status',
      explanation_translations: {
        en: 'Show the working tree status (modified, staged, untracked files).',
        fr: 'Affiche l\'état de l\'arborescence de travail.',
        es: 'Muestra el estado del árbol de trabajo (archivos modificados, staged, sin seguimiento).',
        de: 'Zeigt den Status des Arbeitsverzeichnisses an.',
        ar: 'يعرض حالة شجرة العمل (الملفات المعدلة، المؤقتة، غير المتعقبة).'
      },
      question_translations: {
        en: 'How do you see which files have been modified?',
        fr: 'Comment voir quels fichiers ont été modifiés ?',
        es: '¿Cómo ves qué archivos han sido modificados?',
        de: 'Wie sieht man, welche Dateien geändert wurden?',
        ar: 'كيف ترى الملفات التي تم تعديلها؟'
      },
      valid_answers: ['git status'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'git_add',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['staging', 'index'],
      command: 'git add .',
      explanation_translations: {
        en: 'Stage all modified and new files for the next commit.',
        fr: 'Prépare tous les fichiers modifiés et nouveaux pour le prochain commit.',
        es: 'Prepara todos los archivos modificados y nuevos para el próximo commit.',
        de: 'Staged alle geänderten und neuen Dateien für den nächsten Commit.',
        ar: 'يُعدّ جميع الملفات المعدلة والجديدة للالتزام التالي.'
      },
      question_translations: {
        en: 'How do you stage all changes for commit?',
        fr: 'Comment préparer tous les changements pour un commit ?',
        es: '¿Cómo preparas todos los cambios para un commit?',
        de: 'Wie staged man alle Änderungen für einen Commit?',
        ar: 'كيف تُعدّ جميع التغييرات للالتزام؟'
      },
      valid_answers: ['git add .', 'git add --all'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'git_commit',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['commit', 'history'],
      command: 'git commit -m "Fix login bug"',
      explanation_translations: {
        en: 'Record changes to the repository with a descriptive message.',
        fr: 'Enregistrer les modifications avec un message descriptif.',
        es: 'Registra los cambios en el repositorio con un mensaje descriptivo.',
        de: 'Änderungen mit einer beschreibenden Nachricht speichern.',
        ar: 'يسجل التغييرات في المستودع مع رسالة وصفية.'
      },
      question_translations: {
        en: 'How do you save staged changes with a message?',
        fr: 'Comment sauvegarder les changements avec un message ?',
        es: '¿Cómo guardas los cambios con un mensaje?',
        de: 'Wie speichert man gestagte Änderungen mit einer Nachricht?',
        ar: 'كيف تحفظ التغييرات المؤقتة مع رسالة؟'
      },
      valid_answers: ['git commit -m "message"'],
      answer_match: { mode: 'regex', pattern: '^git\\s+commit\\s+-m\\s+"[^"]+"', case_sensitive: false }
    },
    {
      cardId: 'git_push',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['remote', 'sync'],
      command: 'git push origin main',
      explanation_translations: {
        en: 'Upload local commits to the remote repository.',
        fr: 'Envoyer les commits locaux vers le dépôt distant.',
        es: 'Sube los commits locales al repositorio remoto.',
        de: 'Lädt lokale Commits zum Remote-Repository hoch.',
        ar: 'يرفع الالتزامات المحلية إلى المستودع البعيد.'
      },
      question_translations: {
        en: 'How do you send your commits to GitHub?',
        fr: 'Comment envoyer vos commits vers GitHub ?',
        es: '¿Cómo envías tus commits a GitHub?',
        de: 'Wie sendet man seine Commits an GitHub?',
        ar: 'كيف ترسل التزاماتك إلى جيتهب؟'
      },
      valid_answers: ['git push origin main', 'git push'],
      answer_match: { mode: 'regex', pattern: '^git\\s+push(\\s+origin\\s+\\S+)?', case_sensitive: false }
    },
    {
      cardId: 'git_pull',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['sync', 'update'],
      command: 'git pull',
      explanation_translations: {
        en: 'Fetch and merge changes from the remote branch.',
        fr: 'Récupère et fusionne les changements depuis la branche distante.',
        es: 'Obtiene y fusiona cambios desde la rama remota.',
        de: 'Holt und merged Änderungen vom Remote-Zweig.',
        ar: 'يجلب ويُدمج التغييرات من الفرع البعيد.'
      },
      question_translations: {
        en: 'How do you update your local branch with remote changes?',
        fr: 'Comment mettre à jour votre branche locale avec les changements distants ?',
        es: '¿Cómo actualizas tu rama local con cambios remotos?',
        de: 'Wie aktualisiert man den lokalen Branch mit Remote-Änderungen?',
        ar: 'كيف تحدّث فرعك المحلي بالتغيرات البعيدة؟'
      },
      valid_answers: ['git pull'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'git_branch',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['branches', 'list'],
      command: 'git branch',
      explanation_translations: {
        en: 'List all local branches.',
        fr: 'Liste toutes les branches locales.',
        es: 'Lista todas las ramas locales.',
        de: 'Listet alle lokalen Branches auf.',
        ar: 'يعرض جميع الفروع المحلية.'
      },
      question_translations: {
        en: 'How do you see all local Git branches?',
        fr: 'Comment voir toutes les branches Git locales ?',
        es: '¿Cómo ves todas las ramas Git locales?',
        de: 'Wie sieht man alle lokalen Git-Branches?',
        ar: 'كيف ترى جميع فروع جيت المحلية؟'
      },
      valid_answers: ['git branch'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'git_checkout',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['switch', 'branch'],
      command: 'git checkout feature/login',
      explanation_translations: {
        en: 'Switch to a different branch.',
        fr: 'Changer de branche.',
        es: 'Cambia a una rama diferente.',
        de: 'Wechselt zu einem anderen Branch.',
        ar: 'ينتقل إلى فرع مختلف.'
      },
      question_translations: {
        en: 'How do you switch to the login feature branch?',
        fr: 'Comment changer vers la branche de fonctionnalité login ?',
        es: '¿Cómo cambias a la rama de funcionalidad login?',
        de: 'Wie wechselt man zum Login-Feature-Branch?',
        ar: 'كيف تنتقل إلى فرع ميزة تسجيل الدخول؟'
      },
      valid_answers: ['git checkout feature/login'],
      answer_match: { mode: 'regex', pattern: '^git\\s+checkout\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'git_merge',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['merge', 'integration'],
      command: 'git merge feature/login',
      explanation_translations: {
        en: 'Merge a branch into the current branch.',
        fr: 'Fusionne une branche dans la branche courante.',
        es: 'Fusiona una rama en la rama actual.',
        de: 'Merged einen Branch in den aktuellen Branch.',
        ar: 'يدمج فرعاً في الفرع الحالي.'
      },
      question_translations: {
        en: 'How do you integrate changes from a feature branch?',
        fr: 'Comment intégrer les changements d\'une branche de fonctionnalité ?',
        es: '¿Cómo integras cambios de una rama de funcionalidad?',
        de: 'Wie integriert man Änderungen aus einem Feature-Branch?',
        ar: 'كيف تدمج التغييرات من فرع ميزة؟'
      },
      valid_answers: ['git merge feature/login'],
      answer_match: { mode: 'regex', pattern: '^git\\s+merge\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'git_rebase_interactive',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['history', 'clean'],
      command: 'git rebase -i HEAD~3',
      explanation_translations: {
        en: 'Interactively rebase the last 3 commits to squash, edit, or reorder.',
        fr: 'Rebase interactif des 3 derniers commits pour squash, éditer ou réordonner.',
        es: 'Rebase interactivo de los últimos 3 commits para squash, editar o reordenar.',
        de: 'Interaktives Rebase der letzten 3 Commits zum Squashen, Bearbeiten oder Neuanordnen.',
        ar: 'إعادة تأسيس تفاعلية لأخر 3 التزامات لدمجها أو تعديلها أو إعادة ترتيبها.'
      },
      question_translations: {
        en: 'How do you clean up your commit history before a PR?',
        fr: 'Comment nettoyer votre historique de commits avant une PR ?',
        es: '¿Cómo limpias tu historial de commits antes de un PR?',
        de: 'Wie bereinigt man den Commit-Verlauf vor einem PR?',
        ar: 'كيف تنظف سجل التزاماتك قبل طلب سحب؟'
      },
      valid_answers: ['git rebase -i HEAD~3'],
      answer_match: { mode: 'regex', pattern: '^git\\s+rebase\\s+-i\\s+HEAD~\\d+', case_sensitive: false }
    }
  ] as Flashcard[],
  qa_mode: [
    {
      qaId: 'git_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What is the difference between `git pull` and `git fetch`?',
        fr: 'Quelle est la différence entre `git pull` et `git fetch` ?',
        es: '¿Cuál es la diferencia entre `git pull` y `git fetch`?',
        de: 'Was ist der Unterschied zwischen `git pull` und `git fetch`?',
        ar: 'ما الفرق بين `git pull` و `git fetch`؟'
      },
      explanation_translations: {
        en: '`git fetch` downloads changes but doesn\'t merge them. `git pull` fetches and merges automatically.',
        fr: '`git fetch` télécharge les changements sans les fusionner. `git pull` les récupère et les fusionne automatiquement.',
        es: '`git fetch` descarga cambios pero no los fusiona. `git pull` los descarga y fusiona automáticamente.',
        de: '`git fetch` lädt Änderungen herunter, merged aber nicht. `git pull` holt und merged automatisch.',
        ar: '`git fetch` يحمل التغييرات لكن لا يدمجها. `git pull` يجلب ويُدمج تلقائياً.'
      },
      valid_answers: ['fetch downloads, pull merges', 'pull = fetch + merge'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'git_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'What does `git reflog` show?',
        fr: 'Que montre `git reflog` ?',
        es: '¿Qué muestra `git reflog`?',
        de: 'Was zeigt `git reflog` an?',
        ar: 'ماذا يعرض `git reflog`؟'
      },
      explanation_translations: {
        en: 'All local actions on the repository, including commits, resets, and checkouts.',
        fr: 'Toutes les actions locales sur le dépôt, y compris commits, resets et checkouts.',
        es: 'Todas las acciones locales en el repositorio, incluyendo commits, resets y checkouts.',
        de: 'Alle lokalen Aktionen im Repository, einschließlich Commits, Resets und Checkouts.',
        ar: 'جميع الإجراءات المحلية على المستودع، بما في ذلك الالتزامات، إعادة التعيين، والتنقل بين الفروع.'
      },
      valid_answers: ['local actions', 'full history including resets'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'git_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'How do you undo the last commit but keep changes staged?',
        fr: 'Comment annuler le dernier commit mais garder les changements staged ?',
        es: '¿Cómo deshaces el último commit pero mantienes los cambios staged?',
        de: 'Wie hebt man den letzten Commit rückgängig, behält aber die gestagten Änderungen?',
        ar: 'كيف تلغي آخر التزام لكن تحفظ التغييرات مؤقتة؟'
      },
      explanation_translations: {
        en: 'Use `git reset --soft HEAD~1` to undo the commit but keep changes staged.',
        fr: 'Utilisez `git reset --soft HEAD~1` pour annuler le commit mais garder les changements staged.',
        es: 'Usa `git reset --soft HEAD~1` para deshacer el commit pero mantener los cambios staged.',
        de: 'Verwende `git reset --soft HEAD~1`, um den Commit rückgängig zu machen, aber die Änderungen gestaged zu lassen.',
        ar: 'استخدم `git reset --soft HEAD~1` لإلغاء الالتزام لكن تحفظ التغييرات مؤقتة.'
      },
      valid_answers: ['git reset --soft HEAD~1'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ] as QAItem[]
};
