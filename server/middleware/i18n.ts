// middleware/i18n.ts
import { Request, Response, NextFunction } from 'express';
import i18next from 'i18next';

export const i18nMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const acceptLanguage = req.headers['accept-language'] || '';
  const languages = acceptLanguage.split(',').map(l => l.split(';')[0].trim());
  const supportedLanguages = ['en', 'fr', 'es', 'de', 'ar'];
  let lang = 'en'; // default

  for (const l of languages) {
    if (supportedLanguages.includes(l)) {
      lang = l;
      break;
    }
  }

  // Set the language for this request
  req.language = lang;
  
  next();
};
