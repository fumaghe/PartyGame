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
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className={`mt-12 max-w-4xl mx-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90`}>
      
      {/* Players Section */}
      <div className="flex items-center gap-2 mb-4">
        <Users size={28} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
        <h3 className="text-2xl font-bold">{t.players}</h3>
      </div>

      <div className="flex flex-wrap gap-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`px-6 py-4 rounded-xl transition-all ${
              index === currentPlayerIndex
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-110'
                : darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
            }`}
          >
            {player.name}
          </div>
        ))}
      </div>

      {/* Ranking Section */}
      <div className="mt-8 border-t border-gray-600 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={28} className={darkMode ? 'text-yellow-500' : 'text-gray-700'} />
          <h3 className="text-2xl font-bold">{t.ranking}</h3>
        </div>

        <div className="space-y-4">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`relative p-6 rounded-xl transition-transform hover:scale-105 ${
                darkMode
                  ? 'bg-gray-800 text-white border border-gray-700'
                  : 'bg-gray-100 text-gray-900 border border-gray-300'
              } animate-fadeIn`}
            >
              {/* Large Medal in Background */}
              <div className="absolute left-4 top-6 opacity-10 text-8xl select-none">
                {medals[index] || `#${index + 1}`}
              </div>

              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-4">
                  <span className={`font-bold text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {medals[index] || `#${index + 1}`}
                  </span>
                  <span className="font-semibold text-xl">
                    {player.name}
                  </span>
                </div>
                <span className="font-bold text-lg">
                  {player.score} {t.points}
                </span>
              </div>

              {/* Statistics */}
              <div className={`text-lg mt-3 relative z-10 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <h4 className="font-medium mb-2 text-gray-400 text-lg">{t.stats}:</h4>
                <div className="flex gap-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={26} className="text-green-500 drop-shadow-lg" />
                    <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {player.completedChallenges}
                    </span> 
                    <span className="text-gray-400 text-lg">{t.completedChallenges}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <XCircle size={26} className="text-red-500 drop-shadow-lg" />
                    <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {player.failedChallenges}
                    </span> 
                    <span className="text-gray-400 text-lg">{t.failedChallenges}</span>
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
