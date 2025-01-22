export interface Player {
  id: string;
  name: string;
  score: number;
  completedChallenges: number;
  failedChallenges: number;
}

export interface Card {
  id: string;
  content: string;
  used: boolean;
}

export type TopicType = 'domandePiccanti' | 'cosaPreferirestiPiccante' | 'killKissMarryFamosi' | 'chiInQuestaStanzaEPropenso' | 'indovinaLaCanzone' | 'drink' | 'cercaELeggi';

export interface Topic {
  id: TopicType;
  name: string;
  color: string;
  icon: string;
  cards: Card[];
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  availableTopics: TopicType[];
  selectedTopic: TopicType | null;
  currentCard: Card | null;
  gameStarted: boolean;
  showCard: boolean;
  darkMode: boolean;
  language: Language;
  showFailedPopup: boolean;
}

export type Language = 'en' | 'fr' | 'it';