// src/components/Layout/Footer.tsx
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h3>{t('footer.title')}</h3>
          <p>{t('footer.description')}</p>
        </div>
        <div>
          <h4>{t('footer.quick_links')}</h4>
          <ul>
            <li><a href="/">{t('home')}</a></li>
            <li><a href="/features">{t('features')}</a></li>
            <li><a href="/about">{t('about')}</a></li>
          </ul>
        </div>
        <div>
          <h4>{t('footer.contact')}</h4>
          <p>{t('footer.email')}</p>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
