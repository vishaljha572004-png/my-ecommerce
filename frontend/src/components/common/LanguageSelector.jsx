import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem('appLanguage', newLang);
  };

  return (
    <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-200">
      <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="bg-transparent text-sm outline-none cursor-pointer focus:ring-0"
      >
        <option value="en" className="text-gray-900">English</option>
        <option value="hi" className="text-gray-900">हिंदी</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
