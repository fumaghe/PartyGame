// types.ts
export interface Player {
  id: string;
  name: string;
  score: number;
  completedChallenges: number;
  failedChallenges: number;
}

/**
 * Ogni card ora ha TUTTE le lingue in content, così se cambi
 * lingua a partita in corso, il testo si aggiorna.
 */
export interface Card {
  id: string;
  content: {
    it: string;
    en: string;
    fr: string;
  };
  used: boolean;
}

export type TopicType = 
  | 'domandePiccanti'
  | 'cosaPreferirestiPiccante'
  | 'killKissMarryFamosi'
  | 'chiInQuestaStanzaEPropenso'
  | 'indovinaLaCanzone'
  | 'drink'
  | 'cercaELeggi'
  | 'cupido'
  | 'culturaGenerale'
  | 'proEcontro'
  | 'nonHomai';

export interface Topic {
  id: TopicType;
  name: string;
  color: string;
  icon: string;
  cards: Card[];
}

/**
 * Rappresenta la combinazione "topic + punteggio random"
 * che viene proposta come scelta.
 */
export interface TopicChoice {
  id: TopicType; 
  points: number;
}

/**
 * Stato globale del gioco.
 */
export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  availableTopics: TopicChoice[];
  selectedTopic: TopicChoice | null;
  currentCard: Card | null;
  gameStarted: boolean;
  showCard: boolean;
  darkMode: boolean;
  language: Language;
  showFailedPopup: boolean;
  showGlobalEventPopup: boolean;
  globalEventMessage: string | null;
  turnsToNextEvent: number;
  selectedTopicsHistory: TopicType[];
}

export type Language = 'en' | 'fr' | 'it';
