// middleware/i18n.ts
import { Request, Response, NextFunction } from 'express';
import i18next from '../i18n';

export const i18nMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  req.language = lang; // ✅ Now recognized by TypeScript
  i18next.changeLanguage(lang);
  next();
};
