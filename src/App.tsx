// App.tsx
import React, { useState, useEffect } from 'react';
import { Player, GameState, Card, Topic, TopicType, Language } from './types';
import { getTopics } from './data/topics';
import { translations } from './i18n/translations';
import PlayerSetup from './components/PlayerSetup';
import TopicCard from './components/TopicCard';
import GameCard from './components/GameCard';
import PlayerRanking from './components/PlayerRanking';
import LanguageToggle from './components/LanguageToggle';
import FailedPopup from './components/FailedPopup';
import GlobalEventPopup from './components/GlobalEventPopup'; // <--- Nuovo componente
import { Sun, Moon } from 'lucide-react';

// Possibili eventi casuali che appariranno nel popup globale
const globalEvents = [
  "Everyone drinks now!",
  "The next challenge is worth double!",
  "Reveal an embarrassing truth!",
  "The next 'fail' results in an extra drink!",
  "Swap your drink with the person to your left!",
  "The player with the lowest score drinks twice!",
  "Give someone at the table a sexy nickname!",
  "Give a compliment to someone of the opposite sex at the table!",
  "The player with the highest score must give someone a massage!",
  "Everyone must reveal their secret guilty pleasure!",
  "Take a shot without using your hands!",
  "Whisper something provocative in the ear of the person next to you!",
];

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

    // Aggiunte per l'evento globale a sorpresa
    showGlobalEventPopup: false,
    globalEventMessage: null,
    turnsToNextEvent: 0, // verrà inizializzato quando parte il gioco
  });

  // Stato con i topic correnti (in base alla lingua)
  const [topics, setTopics] = useState<Topic[]>(() => getTopics(gameState.language));

  // Quando cambia la lingua, ricarichiamo i topic
  useEffect(() => {
    setTopics(getTopics(gameState.language));
  }, [gameState.language]);

  // Traduzioni dell'interfaccia
  const t = translations[gameState.language];

  // Per rendere scuro / chiaro il background
  useEffect(() => {
    document.body.className = gameState.darkMode ? 'dark' : '';
  }, [gameState.darkMode]);

  // Funzioni di utilità
  const toggleDarkMode = () => {
    setGameState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleLanguageChange = (language: Language) => {
    setGameState(prev => ({ ...prev, language }));
  };

  // Avvio del gioco
  const startGame = (players: Player[]) => {
    // Decidiamo quanti turni mancano al prossimo evento globale random, es. tra 3 e 6
    const randomBetween3and6 = 6 + Math.floor(Math.random() * 5); // 3..6

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
      // inizializzo i campi dell'evento globale
      showGlobalEventPopup: false,
      globalEventMessage: null,
      turnsToNextEvent: randomBetween3and6,
    });
  };

  // Selezione random di 2 topic dall'intero array di topics (uguale probabilità, senza contare quante carte abbiano)
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

  // Scelta di un topic e di una carta casuale al suo interno
  const selectTopic = (topicId: TopicType) => {
    const selectedTopic = topics.find(t => t.id === topicId);
    if (!selectedTopic) return;

    let unusedCards = selectedTopic.cards.filter(card => !card.used);

    if (unusedCards.length === 0) {
      // Se le carte sono tutte usate, rimettiamo "used = false"
      reshuffleTopicCards(topicId);
      unusedCards = selectedTopic.cards;
    }

    // Pesca una carta random tra quelle non usate
    const randomCard = unusedCards[Math.floor(Math.random() * unusedCards.length)];

    // Contrassegna come usata
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

  // Quando un giocatore completa/falla una sfida
  const handleComplete = (success: boolean) => {
    const updatedPlayers = [...gameState.players];
    const currentPlayer = updatedPlayers[gameState.currentPlayerIndex];

    if (success) {
      currentPlayer.score += 1;
      currentPlayer.completedChallenges += 1;
    } else {
      currentPlayer.failedChallenges += 1;
      // Mostra il popup "Failed" se i fail totali del giocatore sono multipli di 2
      if (currentPlayer.failedChallenges % 2 === 0) {
        setGameState(prev => ({ ...prev, showFailedPopup: true }));
      }
    }

    // Gestione dell'evento globale a sorpresa
    let newTurnsToNextEvent = gameState.turnsToNextEvent - 1;
    let newShowGlobalEventPopup = gameState.showGlobalEventPopup;
    let newGlobalEventMessage = gameState.globalEventMessage;

    // Se arriva a 0, estraiamo un evento e mostriamo popup
    if (newTurnsToNextEvent <= 0) {
      const eventIndex = Math.floor(Math.random() * globalEvents.length);
      newGlobalEventMessage = globalEvents[eventIndex];
      newShowGlobalEventPopup = true;
      // Ripristiniamo un nuovo random tra 3 e 6
      newTurnsToNextEvent = 3 + Math.floor(Math.random() * 4);
    }

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      selectedTopic: null,
      currentCard: null,
      showCard: false,
      availableTopics: selectRandomTopics(),
      // aggiorniamo stato dell'evento globale
      showGlobalEventPopup: newShowGlobalEventPopup,
      globalEventMessage: newGlobalEventMessage,
      turnsToNextEvent: newTurnsToNextEvent,
    }));
  };

  const closeFailedPopup = () => {
    setGameState(prev => ({ ...prev, showFailedPopup: false }));
  };

  // Chiude l'evento globale a sorpresa
  const closeGlobalEventPopup = () => {
    setGameState(prev => ({
      ...prev,
      showGlobalEventPopup: false,
      globalEventMessage: null
    }));
  };

  // Se il gioco non è iniziato, mostriamo la schermata di setup giocatori
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
  
  // Troviamo i topic da mostrare in base alle 2 scelte random
  const availableTopicObjects = topics
    .filter(top => gameState.availableTopics.includes(top.id))
    .map(topic => ({
      ...topic,
      // Nome localizzato
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
        {/* Barra in alto con toggle lingua e dark mode */}
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

        {/* Nome del giocatore corrente + prompt */}
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

        {/* Se non è stata scelta una carta, mostriamo i 2 topic random; altrimenti la card da completare */}
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

        {/* Classifica giocatori */}
        <PlayerRanking
          players={gameState.players}
          currentPlayerIndex={gameState.currentPlayerIndex}
          darkMode={gameState.darkMode}
          t={t.game}
        />

        {/* Popup di penalità se un giocatore totalizza un fail multiplo di 2 */}
        {gameState.showFailedPopup && (
          <FailedPopup onClose={closeFailedPopup} darkMode={gameState.darkMode} t={t.game} />
        )}

        {/* Popup globale per l'evento a sorpresa */}
        {gameState.showGlobalEventPopup && (
          <GlobalEventPopup
            message={gameState.globalEventMessage!}
            darkMode={gameState.darkMode}
            onClose={closeGlobalEventPopup}
          />
        )}
      </div>
    </div>
  );
}

export default App;
