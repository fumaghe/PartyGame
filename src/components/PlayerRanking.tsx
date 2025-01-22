import React from 'react';
import { Player } from '../types';
import { Trophy, Users, CheckCircle2, XCircle } from 'lucide-react';

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
}

export default function PlayerRanking({ players, currentPlayerIndex, darkMode, t }: PlayerRankingProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={`mt-12 max-w-4xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
      <div className="flex items-center gap-2 mb-4">
        <Users size={24} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.players}</h3>
      </div>
      <div className="flex flex-wrap gap-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`px-6 py-3 rounded-xl transition-all ${
              index === currentPlayerIndex
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                : darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {player.name}
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={24} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t.ranking}</h3>
        </div>
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              } animate-fadeIn`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    #{index + 1}
                  </span>
                  <span className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {player.name}
                  </span>
                </div>
                <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {player.score} {t.points}
                </span>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                <h4 className="font-medium mb-1">{t.stats}:</h4>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={16} className="text-green-500" />
                    {player.completedChallenges} {t.completedChallenges}
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle size={16} className="text-red-500" />
                    {player.failedChallenges} {t.failedChallenges}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}