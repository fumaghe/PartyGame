import React from 'react';
import { Player } from '../types';
import { Trophy, Users } from 'lucide-react';

interface PlayerRankingProps {
  players: Player[];
  currentPlayerIndex: number;
  darkMode: boolean;
}

export default function PlayerRanking({ players, currentPlayerIndex, darkMode }: PlayerRankingProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={`mt-12 max-w-4xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
      <div className="flex items-center gap-2 mb-4">
        <Users size={24} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Players</h3>
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
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Ranking</h3>
        </div>
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              } animate-fadeIn`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  #{index + 1}
                </span>
                <span className={darkMode ? 'text-white' : 'text-gray-800'}>
                  {player.name}
                </span>
              </div>
              <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {player.score} points
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}