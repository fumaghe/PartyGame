import React, { useState, useEffect } from 'react';
import { Player, GameState, Card, TopicType } from './types';
import { topics } from './data/topics';
import PlayerSetup from './components/PlayerSetup';
import TopicCard from './components/TopicCard';
import GameCard from './components/GameCard';
import PlayerRanking from './components/PlayerRanking';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    availableTopics: [],
    selectedTopic: null,
    currentCard: null,
    gameStarted: false,
    showCard: false,
    darkMode: false,
  });

  const toggleDarkMode = () => {
    setGameState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const startGame = (players: Player[]) => {
    setGameState({
      ...gameState,
      players,
      gameStarted: true,
      availableTopics: selectRandomTopics(),
    });
  };

  const selectRandomTopics = () => {
    const shuffled = [...topics].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2).map(topic => topic.id);
  };

  const selectTopic = (topicId: TopicType) => {
    const selectedTopic = topics.find(t => t.id === topicId);
    if (!selectedTopic) return; // Guard clause to prevent undefined access

    const unusedCards = selectedTopic.cards.filter(card => !card.used);
    if (unusedCards.length === 0) return; // Guard clause if no cards are available

    const randomCard = unusedCards[Math.floor(Math.random() * unusedCards.length)];
    
    // Mark the card as used in the topics array
    const cardIndex = selectedTopic.cards.findIndex(c => c.id === randomCard.id);
    if (cardIndex !== -1) {
      selectedTopic.cards[cardIndex].used = true;
    }

    setGameState({
      ...gameState,
      selectedTopic: topicId,
      currentCard: randomCard,
      showCard: true,
    });
  };

  const handleComplete = (success: boolean) => {
    const updatedPlayers = [...gameState.players];
    if (success) {
      updatedPlayers[gameState.currentPlayerIndex].score += 1;
    }

    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: (gameState.currentPlayerIndex + 1) % gameState.players.length,
      selectedTopic: null,
      currentCard: null,
      showCard: false,
      availableTopics: selectRandomTopics(),
    });
  };

  useEffect(() => {
    document.body.className = gameState.darkMode ? 'dark' : '';
  }, [gameState.darkMode]);

  if (!gameState.gameStarted) {
    return (
      <div className={`min-h-screen ${
        gameState.darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-purple-50 to-blue-50'
      } py-12`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full ${
                gameState.darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-800'
              } shadow-lg`}
            >
              {gameState.darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          <h1 className={`text-5xl font-bold text-center ${
            gameState.darkMode
              ? 'text-white'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'
          } mb-12`}>
            Party Card Game
          </h1>
          <PlayerSetup onStartGame={startGame} darkMode={gameState.darkMode} />
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const availableTopicObjects = topics.filter(t => gameState.availableTopics.includes(t.id));

  return (
    <div className={`min-h-screen ${
      gameState.darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-purple-50 to-blue-50'
    } py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full ${
              gameState.darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-800'
            } shadow-lg`}
          >
            {gameState.darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-2 ${
            gameState.darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {currentPlayer.name}'s Turn
          </h2>
          <p className={gameState.darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {!gameState.showCard ? 'Choose your topic' : 'Complete your challenge'}
          </p>
        </div>

        {!gameState.showCard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {availableTopicObjects.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => selectTopic(topic.id)}
              />
            ))}
          </div>
        ) : (
          <GameCard
            card={gameState.currentCard!}
            color={topics.find(t => t.id === gameState.selectedTopic)!.color}
            onComplete={handleComplete}
            darkMode={gameState.darkMode}
          />
        )}

        <PlayerRanking 
          players={gameState.players}
          currentPlayerIndex={gameState.currentPlayerIndex}
          darkMode={gameState.darkMode}
        />
      </div>
    </div>
  );
}

export default App;