// server/data/flashcards.ts
import { allStacks } from './index';
import { FlashcardsPayload } from './types';

export const data: FlashcardsPayload = {
  stacks: allStacks,
  ui_translations: {
    languages_supported: ['en', 'fr', 'es', 'de', 'ar'],
    strings: {
      login: {
        en: 'Login',
        fr: 'Connexion',
        es: 'Iniciar sesión',
        de: 'Anmelden',
        ar: 'تسجيل الدخول'
      },
      register: {
        en: 'Register',
        fr: "S'inscrire",
        es: 'Registrarse',
        de: 'Registrieren',
        ar: 'تسجيل'
      },
      flashcard_mode: {
        en: 'Flashcard Mode',
        fr: 'Mode Flashcards',
        es: 'Modo Flashcards',
        de: 'Karten-Modus',
        ar: 'وضع الفلاش كارد'
      },
      qa_mode: {
        en: 'QA Mode',
        fr: 'Mode Q/A',
        es: 'Modo Q/A',
        de: 'QA-Modus',
        ar: 'وضع سؤال/جواب'
      },
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
