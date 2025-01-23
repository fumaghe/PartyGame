// src/data/topics.ts
import { Topic } from '../types';
import cardsAll from './cardsAll.json';

/**
 * Crea un array di Card da un array di oggetti
 * { it: string; en: string; fr: string }
 */
function createCardsForCategory(categoryData: { it: string; en: string; fr: string }[]) {
  return categoryData.map((item, index) => ({
    id: `${index}`,
    content: {
      it: item.it,
      en: item.en,
      fr: item.fr,
    },
    used: false
  }));
}

/**
 * Carichiamo TUTTE le lingue una volta sola.
 */
export function getTopics(): Topic[] {
  return [
    {
      id: 'domandePiccanti',
      name: 'Domande Piccanti',
      color: 'bg-red-500',
      icon: 'Flame',
      cards: createCardsForCategory(cardsAll.domandePiccanti),
    },
    {
      id: 'cosaPreferirestiPiccante',
      name: 'Cosa Preferiresti Piccante',
      color: 'bg-purple-500',
      icon: 'SplitSquare',
      cards: createCardsForCategory(cardsAll.cosaPreferirestiPiccante),
    },
    {
      id: 'killKissMarryFamosi',
      name: 'Kill Kiss Marry',
      color: 'bg-pink-500',
      icon: 'Heart',
      cards: createCardsForCategory(cardsAll.killKissMarryFamosi),
    },
    {
      id: 'chiInQuestaStanzaEPropenso',
      name: 'Chi in questa stanza...',
      color: 'bg-blue-500',
      icon: 'Users',
      cards: createCardsForCategory(cardsAll.chiInQuestaStanzaEPropenso),
    },
    {
      id: 'indovinaLaCanzone',
      name: 'Indovina la Canzone',
      color: 'bg-green-500',
      icon: 'Music',
      cards: createCardsForCategory(cardsAll.indovinaLaCanzone),
    },
    {
      id: 'drink',
      name: 'Drink',
      color: 'bg-amber-500',
      icon: 'Beer',
      cards: createCardsForCategory(cardsAll.drink),
    },
    {
      id: 'cercaELeggi',
      name: 'Cerca e Leggi',
      color: 'bg-emerald-500',
      icon: 'Search',
      cards: createCardsForCategory(cardsAll.cercaELeggi),
    },
    {
      id: 'cupido',
      name: 'Cupido',
      color: 'bg-rose-500',
      icon: 'HeartHandshake',
      cards: createCardsForCategory(cardsAll.cupido),
    },
    {
      id: 'culturaGenerale',
      name: 'Cultura Generale',
      color: 'bg-cyan-500',
      icon: 'Globe',
      cards: createCardsForCategory(cardsAll.culturaGenerale),
    },
    {
      id: 'proEcontro',
      name: 'Pro & Contro',
      color: 'bg-indigo-500',
      icon: 'Scale',
      cards: createCardsForCategory(cardsAll.proEcontro),
    },
    {
      id: 'nonHomai',
      name: 'Non Ho Mai',
      color: 'bg-gray-500',
      icon: 'AlertCircle',
      cards: createCardsForCategory(cardsAll.nonHomai),
    },
  ];
}
