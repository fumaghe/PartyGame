// src/App.tsx
import React, { useState, useEffect } from 'react';
import {
  Player,
  GameState,
  Topic,
  TopicType,
  TopicChoice,
  Language,
  CupidoRestriction,
  Card,
} from './types';
import { getTopics } from './data/topics';
import { translations } from './i18n/translations';

import PlayerSetup from './components/PlayerSetup';
import LanguageToggle from './components/LanguageToggle';
import PlayerRanking from './components/PlayerRanking';
import TopicCard from './components/TopicCard';
import GameCard from './components/GameCard';
import FailedPopup from './components/FailedPopup';
import GlobalEventPopup from './components/GlobalEventPopup';
import ConfirmResetPopup from './components/ConfirmResetPopup';
import CupidoStatus from './components/CupidoStatus';

import { Sun, Moon } from 'lucide-react';

// Eventi globali random
const globalEvents = [
  "Everyone drinks now!",
  "The next challenge is worth double sips!",
  "Reveal an embarrassing truth!",
  "The next 'fail' results in an extra drink!",
  "Swap your drink with the person to your left!",
  "The player with the lowest score drinks twice!",
  "Round of Secret Coin Game!",
  "Give a compliment to someone of the opposite sex at the table!",
  "The player with the highest score must give someone a massage!",
  "Everyone must reveal their secret guilty pleasure!",
  "Take a shot without using your hands!",
  "Whisper something provocative in the ear of the person next to you!",
  "The last person who took a drink must whisper something dirty to the person on their right!",
  "Everyone sends a flirty text to the last person they matched with on a dating app, if they have one!",
  "Swap an item of clothing with the person sitting across from you!",
  "The person at the 4th place must play 'Guess the body part' with the last one on the ranking!",
  "The people on odd ranking must read the last message received!",
  "Look everyone in the face without speaking the first person to laugh must take a drink!",
  "The next 'fail' results in the loser giving a 10-second lap dance!",
  "Choose a person and describe their best feature… in the most seductive way possible!",
  "The first and last place must swap their points!",
  "The second place loses 5 points, the second to last gains 5!",
  "Pick a card! If the card is even you get the points, if it's odd you lose them!",
  "The player in third place must give half of their points to the person in last place!",
  "Whoever has an odd-numbered score must take a drink and lose 3 points!",
  "The person in second place can challenge the person in first to a mini-game choose by others for a points swap!",
  "The person with the highest score must gift 10 points to someone they think deserves it!",
  "Everyone must talk in a fake accent for the next round, failure means a drink!",
  "For the next turn, no one can use the word 'drink'—if you do, you take one!",
  "Everyone who has an even number of letters in their first name must take a drink!",
  "The next person who laughs must take 2 sips!",
  "Each person must name a celebrity starting with the last letter of the previous one’s name—whoever hesitates drinks!",
  "The player in last place must give the player in first place a seductive compliment!",
  "Play a round of Pullman Game",
  "Play a round of Pullman Game",
  "Everyone must close their eyes—on the count of three, point to the player you think has the best 'game.' Majority vote gives away 5 points!",
  "Last place chooses: Swap scores with another player OR take three sips!",
  "The last place can bet 5 points and challenge anyone to a Rock, Paper, Scissors duel! Winner takes all!",
  "The player with the highest score must spin a bottle: whoever it lands on steals 7 points!",
  "The person in second-to-last place can take 3 points from the person of their choice!",
  "The first player to finish their drink earns 5 points but must take another drink!",
  "Whoever has the most unread messages on their phone loses 4 points!",
];

// Stato iniziale del gioco
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
  cupidoRestrictions: [],
  turnCounter: 0, // Inizializzato
};

function App() {
  // Carichiamo da localStorage oppure stato iniziale
  const [gameState, setGameState] = useState<GameState>(() => {
    const stored = localStorage.getItem('gameState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...initialGameState,
          ...parsed,
          cupidoRestrictions: Array.isArray(parsed.cupidoRestrictions)
            ? parsed.cupidoRestrictions
            : [],
          turnCounter: typeof parsed.turnCounter === 'number' ? parsed.turnCounter : 0,
        };
      } catch (error) {
        console.error('Error parsing gameState from localStorage:', error);
        return initialGameState;
      }
    }
    return initialGameState;
  });

  // Carichiamo i topics (tutti, con le lingue) da localStorage o generiamo
  const [topics, setTopics] = useState<Topic[]>(() => {
    const stored = localStorage.getItem('topics');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : getTopics();
      } catch (error) {
        console.error('Error parsing topics from localStorage:', error);
        return getTopics();
      }
    }
    return getTopics();
  });

  // Popup di conferma reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Salviamo in localStorage ogni volta che cambia
  useEffect(() => {
    console.log('GameState:', gameState); // Log dello stato per debug
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('topics', JSON.stringify(topics));
  }, [topics]);

  // Dark mode sul body
  useEffect(() => {
    document.body.className = gameState.darkMode ? 'dark' : '';
  }, [gameState.darkMode]);

  // Traduzioni
  const t = translations[gameState.language];

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setGameState((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  // Cambio lingua
  const handleLanguageChange = (lang: Language) => {
    setGameState((prev) => ({ ...prev, language: lang }));
  };

  // Mostra popup di reset
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

  // Reset effettivo
  const resetGame = () => {
    setGameState(initialGameState);
    setTopics(getTopics());
    localStorage.removeItem('gameState');
    localStorage.removeItem('topics');
  };

  // Avvio partita
  const startGame = (players: Player[]) => {
    const randomBetween3and6 = 3 + Math.floor(Math.random() * 4); // 3-6 turni
    setGameState((prev) => ({
      ...prev,
      players: players.map((p) => ({
        ...p,
        completedChallenges: p.completedChallenges || 0,
        failedChallenges: p.failedChallenges || 0,
      })),
      gameStarted: true,
      availableTopics: selectRandomTopicChoices([]),
      showGlobalEventPopup: false,
      globalEventMessage: null,
      turnsToNextEvent: randomBetween3and6,
      selectedTopicsHistory: [],
      cupidoRestrictions: [],
      turnCounter: 0, // Resetta il contatore dei turni
    }));
  };

  // Selezioniamo 2 topic random con punti nei range specificati
  const selectRandomTopicChoices = (currentHistory: TopicType[]): TopicChoice[] => {
    const historyLimit = 5;
    const maxRepetitions = 2;
    const recentHistory = currentHistory.slice(-historyLimit);

    const topicUsage: { [key in TopicType]?: number } = {};
    recentHistory.forEach((topicId) => {
      topicUsage[topicId] = (topicUsage[topicId] || 0) + 1;
    });

    // Filtra i topic ammissibili
    const eligibleTopics = topics.filter((topic) => {
      return (topicUsage[topic.id] || 0) < maxRepetitions;
    });

    let selectableTopics = eligibleTopics;
    if (eligibleTopics.length < 2) {
      selectableTopics = topics;
    }

    const shuffled = [...selectableTopics].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 2);

    return selected.map((t) => ({
      id: t.id,
      points: getRandomInt(t.minPoints, t.maxPoints),
    }));
  };

  // Funzione per ottenere un numero intero casuale tra min e max (inclusi)
  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Resetta carte usate per un topic
  const reshuffleTopicCards = (topicId: TopicType) => {
    const idx = topics.findIndex((t) => t.id === topicId);
    if (idx === -1) return;

    const updatedTopics = [...topics];
    const cloned = { ...updatedTopics[idx] };

    cloned.cards = cloned.cards.map((c) => ({ ...c, used: false }));
    updatedTopics[idx] = cloned;
    setTopics(updatedTopics);
  };

  // Selezione di un topic => peschiamo una carta
  const selectTopic = (choice: TopicChoice) => {
    const idx = topics.findIndex((t) => t.id === choice.id);
    if (idx === -1) return;

    const updatedTopics = [...topics];
    const topicData = { ...updatedTopics[idx] };

    let unusedCards = topicData.cards.filter((c) => !c.used);
    if (unusedCards.length === 0) {
      reshuffleTopicCards(choice.id);
      unusedCards = topicData.cards.filter((c) => !c.used);
    }

    const randomCard = unusedCards[Math.floor(Math.random() * unusedCards.length)];
    const cardIdx = topicData.cards.findIndex((c) => c.id === randomCard.id);
    if (cardIdx !== -1) {
      topicData.cards[cardIdx] = { ...topicData.cards[cardIdx], used: true };
    }
    updatedTopics[idx] = topicData;
    setTopics(updatedTopics);

    setGameState((prev) => ({
      ...prev,
      selectedTopic: choice,
      currentCard: randomCard,
      showCard: true,
    }));
  };

  // Quando un giocatore completa/fallisce la sfida
  const handleComplete = (
    success: boolean,
    selectedPlayers?: string[],
    turns?: number
  ) => {
    console.log('handleComplete called with:', { success, selectedPlayers, turns });

    setGameState((prev) => {
      const updatedPlayers = [...prev.players];
      const currentPlayer = updatedPlayers[prev.currentPlayerIndex];
      const chosenPoints = prev.selectedTopic?.points || 1;

      if (success) {
        currentPlayer.score += chosenPoints;
        currentPlayer.completedChallenges += 1;
      } else {
        currentPlayer.failedChallenges += 1;
        
        // Calculate penalty: half of chosenPoints, rounding down
        const penalty = Math.floor(chosenPoints / 2);
        
        // Deduct penalty from the player's score, ensuring it doesn't go negative
        currentPlayer.score = Math.max(0, currentPlayer.score - penalty);
        
        // La visualizzazione del popup fallimento viene gestita più avanti
      }

      let newCupidoRestrictions = [...prev.cupidoRestrictions];

      if (prev.currentCard?.type === 'cupido' && success && selectedPlayers && turns !== undefined) {
        const newRestriction: CupidoRestriction = {
          player1Id: selectedPlayers[0],
          player2Id: selectedPlayers[1],
          remainingTurns: turns,
        };
        console.log('Adding new CupidoRestriction:', newRestriction);
        newCupidoRestrictions.push(newRestriction);
      }

      // Incrementa il contatore dei turni
      let newTurnCounter = prev.turnCounter + 1;
      let newCupidoRestrictionsAfterDecrement = [...newCupidoRestrictions];

      if (newTurnCounter >= prev.players.length) {
        // Resetta il contatore
        newTurnCounter = 0;

        // Decrementa le restrizioni Cupido
        newCupidoRestrictionsAfterDecrement = newCupidoRestrictionsAfterDecrement
          .map((restriction) => ({
            ...restriction,
            remainingTurns: restriction.remainingTurns - 1,
          }))
          .filter((restriction) => restriction.remainingTurns > 0);

        console.log('Decremented CupidoRestrictions:', newCupidoRestrictionsAfterDecrement);
      }

      // Gestione eventi globali
      let newTurnsToNextEvent = prev.turnsToNextEvent - 1;
      let newShowGlobalEventPopup = prev.showGlobalEventPopup;
      let newGlobalEventMessage = prev.globalEventMessage;

      if (newTurnsToNextEvent <= 0) {
        const eventIndex = Math.floor(Math.random() * globalEvents.length);
        newGlobalEventMessage = globalEvents[eventIndex];
        newShowGlobalEventPopup = true;
        newTurnsToNextEvent = 5 + Math.floor(Math.random() * 4);
      }

      const newHistory = [
        ...prev.selectedTopicsHistory,
        ...prev.availableTopics.map((ch) => ch.id),
      ];

      // Gestione di showFailedPopup
      let newShowFailedPopup = prev.showFailedPopup;
      if (!success && currentPlayer.failedChallenges % 3 === 0) {
        newShowFailedPopup = true;
        console.log('Setting showFailedPopup to true');
      }

      console.log('Finalizing GameState update:', {
        players: updatedPlayers,
        cupidoRestrictions: newCupidoRestrictionsAfterDecrement,
        showFailedPopup: newShowFailedPopup,
      });

      return {
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
        selectedTopicsHistory:
          newHistory.length > 5 ? newHistory.slice(newHistory.length - 5) : newHistory,
        cupidoRestrictions: newCupidoRestrictionsAfterDecrement,
        showFailedPopup: newShowFailedPopup,
        turnCounter: newTurnCounter,
      };
    });
  };

  // Funzione per aggiornare il punteggio di un giocatore
  const handleUpdatePlayerScore = (playerId: string, delta: number) => {
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((player) => {
        if (player.id === playerId) {
          const newScore = player.score + delta;
          return {
            ...player,
            score: newScore >= 0 ? newScore : 0, // Evita punteggi negativi
          };
        }
        return player;
      });

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  };

  // Funzione per impostare direttamente il punteggio di un giocatore
  const handleSetPlayerScore = (playerId: string, newScore: number) => {
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            score: newScore >= 0 ? newScore : 0, // Evita punteggi negativi
          };
        }
        return player;
      });

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  };

  // Chiudi popup fail
  const closeFailedPopup = () => {
    setGameState((prev) => ({ ...prev, showFailedPopup: false }));
  };

  // Chiudi popup evento globale
  const closeGlobalEventPopup = () => {
    setGameState((prev) => ({
      ...prev,
      showGlobalEventPopup: false,
      globalEventMessage: null,
    }));
  };

  // RENDER: se non iniziato => setup
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
          <PlayerSetup
            onStartGame={startGame}
            darkMode={gameState.darkMode}
            t={t.playerSetup}
          />
        </div>
      </div>
    );
  }

  // Schermata di gioco
  const currentPlayerInGame = gameState.players[gameState.currentPlayerIndex];

  // Prepariamo i topic proposti
  const topicChoices = gameState.availableTopics.map((choice) => {
    const fullTopic = topics.find((t) => t.id === choice.id);
    return {
      ...choice,
      color: fullTopic?.color || 'bg-gray-500',
      icon: fullTopic?.icon || 'AlertCircle',
      displayName: t.game.topics
        ? t.game.topics[choice.id as keyof typeof t.game.topics]
        : fullTopic?.name || 'Unknown',
      minPoints: fullTopic?.minPoints || 1,
      maxPoints: fullTopic?.maxPoints || 5,
    };
  });

  return (
    <div
      className={`min-h-screen ${
        gameState.darkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-purple-50 to-blue-50'
      } py-12 relative`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Barra in alto */}
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
            {currentPlayerInGame.name} {t.game.turn}
          </h2>
          <p className={gameState.darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {!gameState.showCard ? t.game.chooseTopicPrompt : t.game.challengePrompt}
          </p>
        </div>

        {/* Restrizioni Cupido attive */}
        {gameState.cupidoRestrictions?.length > 0 && (
          <CupidoStatus
            restrictions={gameState.cupidoRestrictions}
            players={gameState.players}
            darkMode={gameState.darkMode}
          />
        )}

        {/* Se non ho selezionato una carta => i 2 topic */}
        {!gameState.showCard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {topicChoices.map((tc) => (
              <TopicCard
                key={tc.id}
                topicId={tc.id}
                displayName={tc.displayName || 'Topic'}
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
              topics.find((t) => t.id === gameState.selectedTopic?.id)?.color ||
              'bg-gray-500'
            }
            onComplete={handleComplete}
            darkMode={gameState.darkMode}
            currentLanguage={gameState.language}
            t={t.game}
            players={gameState.players} // Passa i giocatori al componente GameCard
          />
        )}

        {/* Classifica */}
        <PlayerRanking
          players={gameState.players}
          currentPlayerIndex={gameState.currentPlayerIndex}
          darkMode={gameState.darkMode}
          t={t.game}
          onUpdatePlayerScore={handleUpdatePlayerScore} // Passa la funzione
          onSetPlayerScore={handleSetPlayerScore} // Passa la nuova funzione
        />

        {/* Pulsante Reset */}
        <div className="text-center mt-8">
          <button
            onClick={handleResetClick}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition-transform hover:scale-105"
          >
            {t.game.reset}
          </button>
        </div>

        {/* Popup fail */}
        {gameState.showFailedPopup && (
          <FailedPopup
            onClose={closeFailedPopup}
            darkMode={gameState.darkMode}
            t={{
              failedPopupTitle: t.game.failedPopupTitle,
              failedPopupMessage: t.game.failedPopupMessage,
              ok: t.game.ok,
            }}
          />
        )}

        {/* Popup evento globale */}
        {gameState.showGlobalEventPopup && (
          <GlobalEventPopup
            message={gameState.globalEventMessage!}
            darkMode={gameState.darkMode}
            onClose={closeGlobalEventPopup}
          />
        )}

        {/* Popup conferma reset */}
        {showResetConfirm && (
          <ConfirmResetPopup
            onConfirm={handleConfirmReset}
            onCancel={handleCancelReset}
            darkMode={gameState.darkMode}
            title={t.game.confirmResetTitle}
            message={t.game.confirmResetMessage}
            yesLabel={t.game.confirmResetYes}
            noLabel={t.game.confirmResetNo}
          />
        )}
      </div>
    </div>
  );
}

export default App;
