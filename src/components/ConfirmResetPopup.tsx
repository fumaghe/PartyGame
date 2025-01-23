// src/components/ConfirmResetPopup.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmResetPopupProps {
  onConfirm: () => void;
  onCancel: () => void;
  darkMode: boolean;
  title: string;    // testo del titolo (es. t.game.confirmResetTitle)
  message: string;  // testo del messaggio (es. t.game.confirmResetMessage)
  yesLabel: string; // testo del pulsante conferma (es. t.game.confirmResetYes)
  noLabel: string;  // testo del pulsante annulla (es. t.game.confirmResetNo)
}

export default function ConfirmResetPopup({
  onConfirm,
  onCancel,
  darkMode,
  title,
  message,
  yesLabel,
  noLabel
}: ConfirmResetPopupProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`mx-4 p-6 rounded-lg shadow-xl ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } max-w-sm w-full`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-md font-semibold ${
                darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
              } hover:scale-105 transition-transform`}
            >
              {noLabel}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-transform"
            >
              {yesLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
