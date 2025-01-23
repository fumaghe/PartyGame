// src/components/GameCard.tsx
import React from 'react';
import { Card, Language } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';
import useSound from 'use-sound';

interface GameCardProps {
  card: Card;
  color: string;
  onComplete: (success: boolean) => void;
  darkMode: boolean;
  currentLanguage: Language; // <--- per mostrare la lingua giusta
  t: {
    done: string;
    failed: string;
  };
}

export default function GameCard({
  card,
  color,
  onComplete,
  darkMode,
  currentLanguage,
  t
}: GameCardProps) {
  const [playSuccess] = useSound('/success.mp3', { volume: 0.5 });
  const [playFail] = useSound('/fail.mp3', { volume: 0.5 });

  const handleComplete = (success: boolean) => {
    if (success) playSuccess();
    else playFail();
    onComplete(success);
  };

  // Testo localizzato
  const cardText = card.content[currentLanguage];

  return (
    <div className={`${color} p-8 rounded-2xl shadow-lg max-w-lg mx-auto transform transition-all animate-cardFlip`}>
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/10'} backdrop-blur-sm rounded-xl p-6 mb-6`}>
        <p className="text-2xl text-white leading-relaxed">{cardText}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleComplete(true)}
          className="flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm text-white px-6 py-4 rounded-xl transition-transform font-semibold hover:scale-105"
        >
          <CheckCircle2 size={20} />
          {t.done}
        </button>
        <button
          onClick={() => handleComplete(false)}
          className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white px-6 py-4 rounded-xl transition-transform font-semibold hover:scale-105"
        >
          <XCircle size={20} />
          {t.failed}
        </button>
      </div>
    </div>
  );
}
