import React from 'react';
import { Language } from '../types';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  darkMode: boolean;
}

export default function LanguageToggle({ currentLanguage, onLanguageChange, darkMode }: LanguageToggleProps) {
  return (
    <div className="relative group">
      <button
        className={`p-3 rounded-full ${
          darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
        } shadow-lg hover:scale-105 transition-transform flex items-center gap-2`}
      >
        <Globe size={24} />
        <span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-28 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={`${
          darkMode ? 'bg-gray-700' : 'bg-white'
        } rounded-lg shadow-lg overflow-hidden`}>
          <button
            onClick={() => onLanguageChange('en')}
            className={`w-full px-4 py-2 text-left hover:bg-opacity-10 hover:bg-purple-500 transition-colors ${
              currentLanguage === 'en' ? 'bg-purple-500 bg-opacity-10' : ''
            } ${darkMode ? 'text-white' : 'text-gray-800'}`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => onLanguageChange('fr')}
            className={`w-full px-4 py-2 text-left hover:bg-opacity-10 hover:bg-purple-500 transition-colors ${
              currentLanguage === 'fr' ? 'bg-purple-500 bg-opacity-10' : ''
            } ${darkMode ? 'text-white' : 'text-gray-800'}`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => onLanguageChange('it')}
            className={`w-full px-4 py-2 text-left hover:bg-opacity-10 hover:bg-purple-500 transition-colors ${
              currentLanguage === 'it' ? 'bg-purple-500 bg-opacity-10' : ''
            } ${darkMode ? 'text-white' : 'text-gray-800'}`}
          >
            🇮🇹 Italiano
          </button>
        </div>
      </div>
    </div>
  );
}