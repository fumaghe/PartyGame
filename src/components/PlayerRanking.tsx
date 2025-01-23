// src/components/PlayerRanking.tsx
import React from 'react';
import { Player } from '../types';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerRankingProps {
  players: Player[];
  currentPlayerIndex: number;
  darkMode: boolean;
  t: {
    players: string; // non usato qui, ma se serve lo hai
    ranking: string;
    points: string;
    stats: string;
    completedChallenges: string;
    failedChallenges: string;
  };
}

export default function PlayerRanking({
  players,
  currentPlayerIndex,
  darkMode,
  t
}: PlayerRankingProps) {
  // Ordiniamo i players per punteggio decrescente
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  // Medaglie per prime 3 posizioni
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="mt-12 max-w-4xl mx-auto w-full">
      {/* Titolo della classifica */}
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={28} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
        <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t.ranking}
        </h3>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {sortedPlayers.map((player, index) => {
            const place = medals[index] || `#${index + 1}`;
            const isCurrent =
              players.findIndex((p) => p.id === player.id) === currentPlayerIndex;

            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`relative rounded-xl shadow-md p-6 transition-transform ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}
              >
                {/* Medaglione trasparente in background */}
                <div className="absolute left-4 top-6 opacity-10 text-8xl select-none pointer-events-none">
                  {place}
                </div>

                {/* Testa: Nome + punteggio */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{place}</span>
                    <span className="text-xl font-semibold">{player.name}</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {player.score} {t.points}
                  </div>
                </div>

                {/* Se è il current player, effetto highlight */}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-purple-500 pointer-events-none z-0" />
                )}

                {/* Statistiche */}
                <div className="flex flex-col mt-4 gap-2 relative z-10">
                  <span className="text-sm font-medium text-gray-400">{t.stats}:</span>
                  <div className="flex items-center gap-6">
                    {/* Completate */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <span className="font-semibold text-lg">
                        {player.completedChallenges}
                      </span>
                      <span className="text-gray-400 text-sm">{t.completedChallenges}</span>
                    </div>
                    {/* Fallite */}
                    <div className="flex items-center gap-2">
                      <XCircle size={24} className="text-red-500" />
                      <span className="font-semibold text-lg">
                        {player.failedChallenges}
                      </span>
                      <span className="text-gray-400 text-sm">{t.failedChallenges}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
