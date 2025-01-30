// src/types.ts

export interface Player {
  id: string;
  name: string;
  score: number;
  completedChallenges: number;
  failedChallenges: number;
}

export interface CupidoRestriction {
  player1Id: string;
  player2Id: string;
  remainingTurns: number;
}

/**
 * Ogni card ha i testi per TUTTE le lingue,
 * così possiamo cambiare lingua a partita in corso
 */
export interface Card {
  id: string;
  content: {
    it: string;
    en: string;
    fr: string;
  };
  used: boolean;
  answer?: {
    it: string;
    en: string;
    fr: string;
  };
  type?: 'movie' | 'song' | 'artist' | 'geoguessr' | 'cupido' | 'default';
  image?: string | null;
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
  | 'nonHomai'
  // Nuovi Topic
  | 'obbligo'
  | 'tabu'
  | 'indovinaIlSegreto'
  | 'rankIT'
  | 'reazioneACatena'
  | 'random'
  | 'sfidaEmoji'
  | 'geoguessr';

/**
 * Topic
 */
export interface Topic {
  id: TopicType;
  name: string;
  color: string;
  icon: string;
  cards: Card[];
  minPoints: number; // Nuovo campo
  maxPoints: number; // Nuovo campo
}

/**
 * Per le 2 scelte di topic proposte a ogni turno,
 * memorizziamo: { id: 'domandePiccanti', points: 3 }
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

  /**
   * Cronologia degli ultimi topic proposti,
   * per limitare le ripetizioni.
   */
  selectedTopicsHistory: TopicType[];

  /**
   * Restrizioni Cupido attive
   */
  cupidoRestrictions: CupidoRestriction[];

  /**
   * Contatore dei turni passati
   */
  turnCounter: number; // Aggiunto
}

export type Language = 'en' | 'fr' | 'it';
