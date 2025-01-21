import React, { useState } from 'react';
import { UserPlus, Play, Users } from 'lucide-react';
import { Player } from '../types';

interface PlayerSetupProps {
  onStartGame: (players: Player[]) => void;
  darkMode: boolean;
}

export default function PlayerSetup({ onStartGame, darkMode }: PlayerSetupProps) {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setPlayers([...players, {
        id: crypto.randomUUID(),
        name: playerName.trim(),
        score: 0
      }]);
      setPlayerName('');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-2xl shadow-xl overflow-hidden`}>
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white text-center">
          <Users size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Player Setup</h2>
          <p className="text-purple-100 mt-2">Add at least 2 players to start</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleAddPlayer} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter player name"
                className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
                }`}
              />
              <button
                type="submit"
                className="p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
              >
                <UserPlus size={24} />
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {players.map((player) => (
              <div
                key={player.id}
                className={`px-4 py-3 rounded-xl flex justify-between items-center animate-fadeIn ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
                }`}
              >
                <span className="font-medium">{player.name}</span>
                <button
                  onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => players.length >= 2 && onStartGame(players)}
            disabled={players.length < 2}
            className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
          >
            <Play size={20} />
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}