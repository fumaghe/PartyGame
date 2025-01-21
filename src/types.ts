export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Card {
  id: string;
  content: string;
  used: boolean;
}

export type TopicType = 'domandePiccanti' | 'cosaPreferirestiPiccante' | 'killKissMarryFamosi' | 'chiInQuestaStanzaEPropenso' | 'indovinaLaCanzone';

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
}