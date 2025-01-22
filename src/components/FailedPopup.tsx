import React from 'react';
import { Beer } from 'lucide-react';

interface FailedPopupProps {
  onClose: () => void;
  darkMode: boolean;
  t: {
    failedPopupTitle: string;
    failedPopupMessage: string;
    ok: string;
  };
}

export default function FailedPopup({ onClose, darkMode, t }: FailedPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-2xl p-8 max-w-md mx-4 shadow-xl transform transition-all animate-bounce`}>
        <div className="flex items-center justify-center mb-6">
          <Beer size={48} className="text-amber-500" />
        </div>
        <h3 className={`text-2xl font-bold text-center mb-4 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {t.failedPopupTitle}
        </h3>
        <p className={`text-center mb-6 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {t.failedPopupMessage}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all"
        >
          {t.ok}
        </button>
      </div>
    </div>
  );
}