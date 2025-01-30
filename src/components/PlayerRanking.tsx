// src/components/PlayerRanking.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Player } from '../types';
import { Trophy, CheckCircle2, XCircle, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerRankingProps {
  players: Player[];
  currentPlayerIndex: number;
  darkMode: boolean;
  t: {
    players: string;
    ranking: string;
    points: string;
    stats: string;
    completedChallenges: string;
    failedChallenges: string;
  };
  onUpdatePlayerScore: (playerId: string, delta: number) => void;
  onSetPlayerScore: (playerId: string, newScore: number) => void; // Nuova funzione
}

export default function PlayerRanking({
  players,
  currentPlayerIndex,
  darkMode,
  t,
  onUpdatePlayerScore,
  onSetPlayerScore,
}: PlayerRankingProps) {
  // Ordiniamo i players per punteggio decrescente
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  // Medaglie per prime 3 posizioni
  const medals = ["🥇", "🥈", "🥉"];

  // Stato locale per tracciare quale giocatore sta modificando il punteggio
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus sull'input quando viene attivato
  useEffect(() => {
    if (editingPlayerId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingPlayerId]);

  // Funzione per gestire la conferma dell'input
  const handleInputConfirm = (playerId: string) => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onSetPlayerScore(playerId, parsed);
    }
    setEditingPlayerId(null);
    setInputValue('');
  };

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
                  <div className="flex items-center text-lg font-semibold">
                    {/* Condizione per mostrare l'input o il punteggio */}
                    {editingPlayerId === player.id ? (
                      <input
                        ref={inputRef}
                        type="number"
                        min="0"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={() => handleInputConfirm(player.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleInputConfirm(player.id);
                          } else if (e.key === 'Escape') {
                            setEditingPlayerId(null);
                            setInputValue('');
                          }
                        }}
                        className={`w-20 px-2 py-1 rounded-md ${
                          darkMode
                            ? 'bg-gray-700 text-white border border-gray-600'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      />
                    ) : (
                      <span
                        className="mr-2 cursor-pointer hover:underline"
                        onClick={() => {
                          setEditingPlayerId(player.id);
                          setInputValue(player.score.toString());
                        }}
                      >
                        {player.score} {t.points}
                      </span>
                    )}
                    {/* Pulsanti per incrementare/decrementare */}
                    <button
                      onClick={() => onUpdatePlayerScore(player.id, 1)}
                      className={`p-1 rounded-full ${
                        darkMode
                          ? 'bg-gray-700 text-green-400'
                          : 'bg-green-100 text-green-600'
                      } hover:bg-opacity-80 transition`}
                      aria-label={`Incrementa punti di ${player.name}`}
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => onUpdatePlayerScore(player.id, -1)}
                      className={`p-1 rounded-full ${
                        darkMode
                          ? 'bg-gray-700 text-red-400'
                          : 'bg-red-100 text-red-600'
                      } hover:bg-opacity-80 transition ml-2`}
                      aria-label={`Decrementa punti di ${player.name}`}
                    >
                      <Minus size={16} />
                    </button>
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
