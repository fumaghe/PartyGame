// src/components/CupidoStatus.tsx
import React from 'react';
import { CupidoRestriction, Player } from '../types';
import { Heart } from 'lucide-react';

interface CupidoStatusProps {
  restrictions: CupidoRestriction[];
  players: Player[];
  darkMode: boolean;
}

const CupidoStatus: React.FC<CupidoStatusProps> = ({
  restrictions,
  players,
  darkMode,
}) => {
  console.log('CupidoStatus Props:', { restrictions, players, darkMode });

  // Funzione per ottenere il nome del giocatore dato l'ID
  const getPlayerName = (id: string) => {
    const player = players.find((p) => p.id === id);
    return player ? player.name : 'Unknown';
  };

  return (
    <div className="mb-8 max-w-sm mx-auto"> {/* Cambiato da max-w-md a max-w-sm */}
      <h3
        className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Cupido Restrictions
      </h3>
      {restrictions.map((restriction, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-4 rounded-xl shadow-md mb-4 ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Heart size={24} className="text-red-500" />
            <span className="font-semibold">
              {getPlayerName(restriction.player1Id)} &amp;{' '}
              {getPlayerName(restriction.player2Id)}
            </span>
          </div>
          <span className="font-medium">
            Turns Left: {restriction.remainingTurns}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CupidoStatus;
