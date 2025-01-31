// src/components/GameCard.tsx
import React, { useState } from 'react';
import useSound from 'use-sound';
import { Info } from 'lucide-react';
import { Card, Player } from '../types';

interface GameCardProps {
  card: Card;
  color: string;
  onComplete: (success: boolean, selectedPlayers?: string[], turns?: number) => void;
  darkMode: boolean;
  currentLanguage: 'it' | 'en' | 'fr';
  t: {
    done: string;
    failed: string;
    // Aggiungi altre traduzioni se necessario
  };
  players: Player[]; // Aggiunto per selezionare i giocatori
}

const GameCard: React.FC<GameCardProps> = ({
  card,
  color,
  onComplete,
  darkMode,
  currentLanguage,
  t,
  players,
}) => {
  const [playSuccess] = useSound('/success.mp3', { volume: 0.5 });
  const [playFail] = useSound('/fail.mp3', { volume: 0.5 });

  // Se clicco "Show Answer", apro un popup
  const [showAnswer, setShowAnswer] = useState(false);

  // Stato per Cupido
  const [selectedPlayer1, setSelectedPlayer1] = useState<string>('');
  const [selectedPlayer2, setSelectedPlayer2] = useState<string>('');
  const [turns, setTurns] = useState<number>(1);

  const handleComplete = (success: boolean) => {
    console.log('GameCard handleComplete called with success:', success);
    if (card.type === 'cupido' && success) {
      // Validazione
      if (!selectedPlayer1 || !selectedPlayer2) {
        alert('Please select two different players.');
        return;
      }
      if (selectedPlayer1 === selectedPlayer2) {
        alert('Please select two different players.');
        return;
      }
      if (turns < 1) {
        alert('Please enter at least 1 turn.');
        return;
      }
      console.log('Calling onComplete with:', { success, selectedPlayers: [selectedPlayer1, selectedPlayer2], turns });
      onComplete(success, [selectedPlayer1, selectedPlayer2], turns);
    } else {
      if (success) playSuccess();
      else playFail();
      console.log('Calling onComplete with:', { success });
      onComplete(success);
    }
  };

  // Testo della domanda nella lingua corrente
  const cardText = card.content[currentLanguage];

  // Testo della risposta nella lingua corrente, se disponibile
  const answerText = card.answer ? card.answer[currentLanguage] : null;

  // Gestione dell'input dei turni per prevenire NaN
  const handleTurnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTurns(isNaN(value) ? 1 : value);
  };

  return (
    <div className={`${color} p-8 rounded-2xl shadow-lg max-w-lg mx-auto transform transition-all`}>
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/10'} backdrop-blur-sm rounded-xl p-6 mb-6`}>
        {/* Se è geoguessr, mostra l'immagine */}
        {card.type === 'geoguessr' && card.image ? (
          <img src={`images/${card.image}`} alt="GeoGuessr" className="w-full h-64 object-cover rounded-xl mb-4" />
        ) : card.type === 'cupido' ? (
          // Se è cupido, mostra il testo della sfida
          <p className="text-2xl text-white leading-relaxed">
            {cardText}
          </p>
        ) : (
          // Altri tipi: mostra solo il testo
          <p className="text-2xl text-white leading-relaxed">
            {cardText}
          </p>
        )}
      </div>

      {/* Se il card è cupido, mostra i select per scegliere i giocatori e l'input per i turni */}
      {card.type === 'cupido' && (
        <div className="mb-4 space-y-4">
          <div className="flex flex-col">
            <label className="text-white mb-2">Select Player 1:</label>
            <select
              value={selectedPlayer1}
              onChange={(e) => setSelectedPlayer1(e.target.value)}
              className={`p-2 rounded-md ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
              }`}
            >
              <option value="">-- Select Player --</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-2">Select Player 2:</label>
            <select
              value={selectedPlayer2}
              onChange={(e) => setSelectedPlayer2(e.target.value)}
              className={`p-2 rounded-md ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
              }`}
            >
              <option value="">-- Select Player --</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-2">Number of Turns:</label>
            <input
              type="number"
              min="1"
              value={turns}
              onChange={handleTurnsChange}
              className={`p-2 rounded-md ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
              }`}
            />
          </div>
        </div>
      )}

      {/* Se il card ha una risposta, mostriamo il pulsante "Show Answer" */}
      {answerText && card.type !== 'cupido' && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => setShowAnswer(true)}
            className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-white px-4 py-2 rounded-xl transition-transform font-semibold hover:scale-105"
          >
            <Info size={20} />
            Show Answer
          </button>
        </div>
      )}

      {/* Bottoni Done / Failed */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleComplete(true)}
          className="flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm text-white px-6 py-4 rounded-xl transition-transform font-semibold hover:scale-105"
        >
          {t.done}
        </button>
        <button
          onClick={() => handleComplete(false)}
          className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white px-6 py-4 rounded-xl transition-transform font-semibold hover:scale-105"
        >
          {t.failed}
        </button>
      </div>

      {/* Popup con la risposta */}
      {showAnswer && answerText && card.type !== 'cupido' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-md w-full rounded-2xl shadow-xl p-6 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Answer</h2>
            <p className="mb-6">{answerText}</p>
            <button
              onClick={() => setShowAnswer(false)}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;
