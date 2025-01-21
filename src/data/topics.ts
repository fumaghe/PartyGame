import { Topic } from '../types';
import cardsData from './cards.json';

// Convert JSON data to cards array with IDs
function createCardsFromContent(content: string[]): { id: string; content: string; used: boolean; }[] {
  return content.map((text, index) => ({
    id: `${index}`,
    content: text,
    used: false
  }));
}

export const topics: Topic[] = [
  {
    id: 'domandePiccanti',
    name: 'Domande Piccanti',
    color: 'bg-red-500',
    icon: 'Flame',
    cards: createCardsFromContent(cardsData.domandePiccanti)
  },
  {
    id: 'cosaPreferirestiPiccante',
    name: 'Cosa Preferiresti?',
    color: 'bg-purple-500',
    icon: 'SplitSquare',
    cards: createCardsFromContent(cardsData.cosaPreferirestiPiccante)
  },
  {
    id: 'killKissMarryFamosi',
    name: 'Kill Kiss Marry',
    color: 'bg-pink-500',
    icon: 'Heart',
    cards: createCardsFromContent(cardsData.killKissMarryFamosi)
  },
  {
    id: 'chiInQuestaStanzaEPropenso',
    name: 'Chi in questa stanza...',
    color: 'bg-blue-500',
    icon: 'Users',
    cards: createCardsFromContent(cardsData.chiInQuestaStanzaEPropenso)
  },
  {
    id: 'indovinaLaCanzone',
    name: 'Indovina la Canzone',
    color: 'bg-green-500',
    icon: 'Music',
    cards: createCardsFromContent(cardsData.indovinaLaCanzone)
  }
];