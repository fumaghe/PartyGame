// App.tsx
import React, { useState, useEffect } from 'react';
import { Player, GameState, Card, Topic, TopicType, Language } from './types';
import { getTopics } from './data/topics'; // <--- Import della nuova funzione
import { translations } from './i18n/translations';
import PlayerSetup from './components/PlayerSetup';
import TopicCard from './components/TopicCard';
import GameCard from './components/GameCard';
import PlayerRanking from './components/PlayerRanking';
import LanguageToggle from './components/LanguageToggle';
import FailedPopup from './components/FailedPopup';
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
    language: 'en',
    showFailedPopup: false,
  });

  // Stato che conterrà i topics correnti (in base alla lingua)
  const [topics, setTopics] = useState<Topic[]>(() => getTopics(gameState.language));

  // Quando cambia la lingua in gameState, ricarichiamo i topic
  useEffect(() => {
    setTopics(getTopics(gameState.language));
  }, [gameState.language]);

  // Traduzioni dell'interfaccia
  const t = translations[gameState.language];

  const toggleDarkMode = () => {
    setGameState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleLanguageChange = (language: Language) => {
    setGameState(prev => ({ ...prev, language }));
  };

  const startGame = (players: Player[]) => {
    setGameState({
      ...gameState,
      players: players.map(p => ({
        ...p,
        score: 0,
        completedChallenges: 0,
        failedChallenges: 0,
      })),
      gameStarted: true,
      availableTopics: selectRandomTopics(),
    });
  };

  const selectRandomTopics = () => {
    const shuffled = [...topics].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2).map(t => t.id);
  };

  const reshuffleTopicCards = (topicId: TopicType) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      topic.cards.forEach(card => {
        card.used = false;
      });
    }
  };

  const selectTopic = (topicId: TopicType) => {
    const selectedTopic = topics.find(t => t.id === topicId);
    if (!selectedTopic) return;

    let unusedCards = selectedTopic.cards.filter(card => !card.used);

    if (unusedCards.length === 0) {
      reshuffleTopicCards(topicId);
      unusedCards = selectedTopic.cards;
    }

    const randomCard = unusedCards[Math.floor(Math.random() * unusedCards.length)];

    const cardIndex = selectedTopic.cards.findIndex(c => c.id === randomCard.id);
    if (cardIndex !== -1) {
      selectedTopic.cards[cardIndex].used = true;
    }

    setGameState(prev => ({
      ...prev,
      selectedTopic: topicId,
      currentCard: randomCard,
      showCard: true,
    }));
  };

  const handleComplete = (success: boolean) => {
    const updatedPlayers = [...gameState.players];
    const currentPlayer = updatedPlayers[gameState.currentPlayerIndex];

    if (success) {
      currentPlayer.score += 1;
      currentPlayer.completedChallenges += 1;
    } else {
      currentPlayer.failedChallenges += 1;
      // Mostra popup di penalità se i fail del giocatore sono multipli di 2
      if (currentPlayer.failedChallenges % 2 === 0) {
        setGameState(prev => ({ ...prev, showFailedPopup: true }));
      }
    }

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      selectedTopic: null,
      currentCard: null,
      showCard: false,
      availableTopics: selectRandomTopics(),
    }));
  };

  const closeFailedPopup = () => {
    setGameState(prev => ({ ...prev, showFailedPopup: false }));
  };

  useEffect(() => {
    document.body.className = gameState.darkMode ? 'dark' : '';
  }, [gameState.darkMode]);

  if (!gameState.gameStarted) {
    return (
      <div
        className={`min-h-screen ${
          gameState.darkMode
            ? 'bg-gradient-to-br from-gray-900 to-gray-800'
            : 'bg-gradient-to-br from-purple-50 to-blue-50'
        } py-12`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-end gap-4 mb-4">
            <LanguageToggle
              currentLanguage={gameState.language}
              onLanguageChange={handleLanguageChange}
              darkMode={gameState.darkMode}
            />
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full ${
                gameState.darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-800'
              } shadow-lg`}
            >
              {gameState.darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          <h1
            className={`text-5xl font-bold text-center ${
              gameState.darkMode
                ? 'text-white'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'
            } mb-12`}
          >
            {t.title}
          </h1>
          <PlayerSetup onStartGame={startGame} darkMode={gameState.darkMode} t={t.playerSetup} />
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const availableTopicObjects = topics
    .filter(top => gameState.availableTopics.includes(top.id))
    .map(topic => ({
      ...topic,
      // Per il nome localizzato del topic, puoi usare t.topics[topic.id], se definito
      // Oppure tieni i nomi fissi come impostati in getTopics
      name: t.topics[topic.id as keyof typeof t.topics]
    }));

  return (
    <div
      className={`min-h-screen ${
        gameState.darkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-purple-50 to-blue-50'
      } py-12`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-end gap-4 mb-4">
          <LanguageToggle
            currentLanguage={gameState.language}
            onLanguageChange={handleLanguageChange}
            darkMode={gameState.darkMode}
          />
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
          <h2
            className={`text-4xl font-bold mb-2 ${
              gameState.darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            {currentPlayer.name}
            {t.game.turn}
          </h2>
          <p className={gameState.darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {!gameState.showCard ? t.game.chooseTopicPrompt : t.game.challengePrompt}
          </p>
        </div>

        {!gameState.showCard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {availableTopicObjects.map(topic => (
              <TopicCard key={topic.id} topic={topic} onClick={() => selectTopic(topic.id)} />
            ))}
          </div>
        ) : (
          <GameCard
            card={gameState.currentCard!}
            color={topics.find(t => t.id === gameState.selectedTopic)!.color}
            onComplete={handleComplete}
            darkMode={gameState.darkMode}
            t={t.game}
          />
        )}

        <PlayerRanking
          players={gameState.players}
          currentPlayerIndex={gameState.currentPlayerIndex}
          darkMode={gameState.darkMode}
          t={t.game}
        />

        {gameState.showFailedPopup && (
          <FailedPopup onClose={closeFailedPopup} darkMode={gameState.darkMode} t={t.game} />
        )}
      </div>
    </div>
  );
}

export default App;
