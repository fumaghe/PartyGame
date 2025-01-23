// App.tsx
import React, { useState, useEffect } from 'react';
import {
  Player,
  GameState,
  Topic,
  TopicType,
  TopicChoice,
  Language
} from './types';

import { getTopics } from './data/topics';
import { translations } from './i18n/translations';

import PlayerSetup from './components/PlayerSetup';
import TopicCard from './components/TopicCard';
import GameCard from './components/GameCard';
import PlayerRanking from './components/PlayerRanking';
import LanguageToggle from './components/LanguageToggle';
import FailedPopup from './components/FailedPopup';
import GlobalEventPopup from './components/GlobalEventPopup';
import ConfirmResetPopup from './components/ConfirmResetPopup'; // <--- nuovo popup di conferma

import { Sun, Moon } from 'lucide-react';

const globalEvents = [
  "Everyone drinks now!",
  "The next challenge is worth double!",
  "Reveal an embarrassing truth!",
  "The next 'fail' results in an extra drink!",
  "Swap your drink with the person to your left!",
  "The player with the lowest score drinks twice!",
  "Round of Secret Coin Game!",
  "Round of Secret Coin Game!",
  "Round of Secret Coin Game!",
  "Give someone at the table a sexy nickname!",
  "Give a compliment to someone of the opposite sex at the table!",
  "The player with the highest score must give someone a massage!",
  "Everyone must reveal their secret guilty pleasure!",
  "Take a shot without using your hands!",
  "Whisper something provocative in the ear of the person next to you!",
];

// Stato iniziale
const initialGameState: GameState = {
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
  showGlobalEventPopup: false,
  globalEventMessage: null,
  turnsToNextEvent: 0,
  selectedTopicsHistory: [],
};

function App() {
  // Carichiamo gameState + topics da localStorage (se esistono)
  const [gameState, setGameState] = useState<GameState>(() => {
    const storedGame = localStorage.getItem('gameState');
    return storedGame ? JSON.parse(storedGame) : initialGameState;
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    const storedTopics = localStorage.getItem('topics');
    if (storedTopics) {
      return JSON.parse(storedTopics);
    }
    return getTopics();
  });

  // Popup di conferma reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Salvataggio in localStorage
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('topics', JSON.stringify(topics));
  }, [topics]);

  // Gestiamo il dark mode sul body
  useEffect(() => {
    document.body.className = gameState.darkMode ? 'dark' : '';
  }, [gameState.darkMode]);

  const t = translations[gameState.language];

  const toggleDarkMode = () => {
    setGameState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleLanguageChange = (language: Language) => {
    setGameState(prev => ({ ...prev, language }));
  };

  // Apri popup di conferma
  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  // Conferma reset
  const handleConfirmReset = () => {
    resetGame();
    setShowResetConfirm(false);
  };

  // Annulla reset
  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  // Funzione che azzera lo stato
  const resetGame = () => {
    setGameState(initialGameState);
    setTopics(getTopics());
    localStorage.removeItem('gameState');
    localStorage.removeItem('topics');
  };

  // Avvio partita
  const startGame = (players: Player[]) => {
    const randomBetween3and6 = 6 + Math.floor(Math.random() * 5);

    setGameState({
      ...gameState,
      players: players.map(p => ({
        ...p,
        score: 0,
        completedChallenges: 0,
        failedChallenges: 0,
      })),
      gameStarted: true,
      availableTopics: selectRandomTopicChoices([]),
      showGlobalEventPopup: false,
      globalEventMessage: null,
      turnsToNextEvent: randomBetween3and6,
      selectedTopicsHistory: [],
    });
  };

  // Pesca 2 scelte (topic + punti random)
  const selectRandomTopicChoices = (currentHistory: TopicType[]): TopicChoice[] => {
    const historyLimit = 5;
    const maxRepetitions = 2;
    const recentHistory = currentHistory.slice(-historyLimit);

    const topicUsage: { [key in TopicType]?: number } = {};
    recentHistory.forEach(topicId => {
      topicUsage[topicId] = (topicUsage[topicId] || 0) + 1;
    });

    const eligibleTopics = topics.filter(topic => {
      return (topicUsage[topic.id] || 0) < maxRepetitions;
    });

    let selectableTopics = eligibleTopics;
    if (eligibleTopics.length < 2) {
      selectableTopics = topics;
    }

    const shuffled = [...selectableTopics].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 2);

    return selected.map(t => ({
      id: t.id,
      points: 1 + Math.floor(Math.random() * 5),
    }));
  };

  // Resetta carte usate per un topic
  const reshuffleTopicCards = (topicId: TopicType) => {
    const idx = topics.findIndex(t => t.id === topicId);
    if (idx === -1) return;

    const updatedTopics = [...topics];
    const clonedTopic = { ...updatedTopics[idx] };

    clonedTopic.cards = clonedTopic.cards.map(c => ({ ...c, used: false }));
    updatedTopics[idx] = clonedTopic;
    setTopics(updatedTopics);
  };

  // Scegli un topic
  const selectTopic = (choice: TopicChoice) => {
    const topicId = choice.id;
    const idx = topics.findIndex(t => t.id === topicId);
    if (idx === -1) return;

    const updatedTopics = [...topics];
    const selectedTopicData = { ...updatedTopics[idx] };

    let unusedCards = selectedTopicData.cards.filter(c => !c.used);
    if (unusedCards.length === 0) {
      reshuffleTopicCards(topicId);
      unusedCards = selectedTopicData.cards.filter(c => !c.used);
    }

    const randomCard = unusedCards[Math.floor(Math.random() * unusedCards.length)];
    const cardIdx = selectedTopicData.cards.findIndex(c => c.id === randomCard.id);
    if (cardIdx !== -1) {
      selectedTopicData.cards[cardIdx] = { ...selectedTopicData.cards[cardIdx], used: true };
    }
    updatedTopics[idx] = selectedTopicData;
    setTopics(updatedTopics);

    setGameState(prev => ({
      ...prev,
      selectedTopic: choice,
      currentCard: randomCard,
      showCard: true,
    }));
  };

  // Completamento sfida
  const handleComplete = (success: boolean) => {
    const updatedPlayers = [...gameState.players];
    const currentPlayer = updatedPlayers[gameState.currentPlayerIndex];
    const chosenPoints = gameState.selectedTopic?.points || 1;

    if (success) {
      currentPlayer.score += chosenPoints;
      currentPlayer.completedChallenges += 1;
    } else {
      currentPlayer.failedChallenges += 1;
      if (currentPlayer.failedChallenges % 2 === 0) {
        setGameState(prev => ({ ...prev, showFailedPopup: true }));
      }
    }

    let newTurnsToNextEvent = gameState.turnsToNextEvent - 1;
    let newShowGlobalEventPopup = gameState.showGlobalEventPopup;
    let newGlobalEventMessage = gameState.globalEventMessage;

    if (newTurnsToNextEvent <= 0) {
      const eventIndex = Math.floor(Math.random() * globalEvents.length);
      newGlobalEventMessage = globalEvents[eventIndex];
      newShowGlobalEventPopup = true;
      newTurnsToNextEvent = 3 + Math.floor(Math.random() * 4);
    }

    const newHistory = [
      ...gameState.selectedTopicsHistory,
      ...gameState.availableTopics.map(ch => ch.id),
    ];

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      selectedTopic: null,
      currentCard: null,
      showCard: false,
      availableTopics: selectRandomTopicChoices(newHistory),
      showGlobalEventPopup: newShowGlobalEventPopup,
      globalEventMessage: newGlobalEventMessage,
      turnsToNextEvent: newTurnsToNextEvent,
      selectedTopicsHistory: newHistory.length > 5
        ? newHistory.slice(newHistory.length - 5)
        : newHistory,
    }));
  };

  // Chiudi popup fail
  const closeFailedPopup = () => {
    setGameState(prev => ({ ...prev, showFailedPopup: false }));
  };

  // Chiudi popup evento globale
  const closeGlobalEventPopup = () => {
    setGameState(prev => ({ ...prev, showGlobalEventPopup: false, globalEventMessage: null }));
  };

  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------
  if (!gameState.gameStarted) {
    // Schermata di setup
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

          {/* Component per inserire nomi giocatori */}
          <PlayerSetup onStartGame={startGame} darkMode={gameState.darkMode} t={t.playerSetup} />
        </div>
      </div>
    );
  }

  // Schermata di gioco
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const topicChoices = gameState.availableTopics.map(choice => {
    const fullTopic = topics.find(t => t.id === choice.id);
    return {
      ...choice,
      color: fullTopic?.color || 'bg-gray-500',
      icon: fullTopic?.icon || 'AlertCircle',
      displayName: t.topics[choice.id as keyof typeof t.topics],
    };
  });

  return (
    <div
      className={`min-h-screen ${
        gameState.darkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-purple-50 to-blue-50'
      } py-12`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Barra con toggle lingua/darkMode */}
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

        {/* Giocatore corrente */}
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

        {/* Se non abbiamo una carta selezionata, mostra i 2 topic a scelta */}
        {!gameState.showCard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {topicChoices.map(tc => (
              <TopicCard
                key={tc.id}
                topicId={tc.id}
                displayName={tc.displayName}
                color={tc.color}
                icon={tc.icon}
                points={tc.points}
                onClick={() => selectTopic({ id: tc.id, points: tc.points })}
              />
            ))}
          </div>
        ) : (
          <GameCard
            card={gameState.currentCard!}
            color={
              topics.find(t => t.id === gameState.selectedTopic?.id)?.color ||
              'bg-gray-500'
            }
            onComplete={handleComplete}
            darkMode={gameState.darkMode}
            currentLanguage={gameState.language}
            t={t.game}
          />
        )}

        {/* Classifica */}
        <PlayerRanking
          players={gameState.players}
          currentPlayerIndex={gameState.currentPlayerIndex}
          darkMode={gameState.darkMode}
          t={t.game}
        />

        {/* Pulsante RESET -> apre popup di conferma */}
        <div className="text-center mt-8">
          <button
            onClick={handleResetClick}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition-transform hover:scale-105"
          >
            RESET PARTITA
          </button>
        </div>

        {/* Popup di penalità */}
        {gameState.showFailedPopup && (
          <FailedPopup onClose={closeFailedPopup} darkMode={gameState.darkMode} t={t.game} />
        )}

        {/* Popup evento globale */}
        {gameState.showGlobalEventPopup && (
          <GlobalEventPopup
            message={gameState.globalEventMessage!}
            darkMode={gameState.darkMode}
            onClose={closeGlobalEventPopup}
          />
        )}

        {/* Popup di conferma reset */}
        {showResetConfirm && (
          <ConfirmResetPopup
            onConfirm={handleConfirmReset}
            onCancel={handleCancelReset}
            darkMode={gameState.darkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;
