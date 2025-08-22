import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/LanguageSelector/LanguageSelector.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';
const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];
const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);
        setIsOpen(false);
        // Update document direction for RTL languages
        if (languageCode === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        }
        else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = languageCode;
        }
    };
    return (_jsxs("div", { className: "language-selector", children: [_jsxs("button", { className: "language-toggle", onClick: () => setIsOpen(!isOpen), "aria-label": "Select language", children: [_jsx("span", { className: "language-flag", children: currentLanguage.flag }), _jsx("span", { className: "language-code", children: currentLanguage.code.toUpperCase() }), _jsx("span", { className: `dropdown-arrow ${isOpen ? 'open' : ''}`, children: "\u25BC" })] }), isOpen && (_jsx("div", { className: "language-dropdown", children: languages.map((language) => (_jsxs("button", { className: `language-option ${i18n.language === language.code ? 'active' : ''}`, onClick: () => handleLanguageChange(language.code), children: [_jsx("span", { className: "language-flag", children: language.flag }), _jsx("span", { className: "language-name", children: language.name }), i18n.language === language.code && (_jsx("span", { className: "check-mark", children: "\u2713" }))] }, language.code))) }))] }));
};
export default LanguageSelector;
