// src/data/topics.ts
import { Topic, Language } from '../types';
import cardsAll from './cardsAll.json'; // JSON unico con TUTTI i topic

// Funzione di utility per creare l'array di card
function createCardsForCategory(
  categoryData: { it: string; en: string; fr: string }[],
  language: Language
) {
  return categoryData.map((item, index) => ({
    id: `${index}`,
    content: item[language], // Prende la stringa corretta in base alla lingua
    used: false
  }));
}

/**
 * Restituisce i topics (e le relative card) in base alla lingua scelta
 */
export function getTopics(language: Language): Topic[] {
  return [
    {
      id: 'domandePiccanti',
      name: 'Domande Piccanti',
      color: 'bg-red-500',
      icon: 'Flame',
      cards: createCardsForCategory(cardsAll.domandePiccanti, language),
    },
    {
      id: 'cosaPreferirestiPiccante',
      name: 'Cosa Preferiresti?',
      color: 'bg-purple-500',
      icon: 'SplitSquare',
      cards: createCardsForCategory(cardsAll.cosaPreferirestiPiccante, language),
    },
    {
      id: 'killKissMarryFamosi',
      name: 'Kill Kiss Marry',
      color: 'bg-pink-500',
      icon: 'Heart',
      cards: createCardsForCategory(cardsAll.killKissMarryFamosi, language),
    },
    {
      id: 'chiInQuestaStanzaEPropenso',
      name: 'Chi in questa stanza...',
      color: 'bg-blue-500',
      icon: 'Users',
      cards: createCardsForCategory(cardsAll.chiInQuestaStanzaEPropenso, language),
    },
    {
      id: 'indovinaLaCanzone',
      name: 'Indovina la Canzone',
      color: 'bg-green-500',
      icon: 'Music',
      cards: createCardsForCategory(cardsAll.indovinaLaCanzone, language),
    },
    {
      id: 'drink',
      name: 'Drink',
      color: 'bg-amber-500',
      icon: 'Beer',
      cards: createCardsForCategory(cardsAll.drink, language),
    },
    {
      id: 'cupido',
      name: 'Cupido',
      color: 'bg-rose-500',
      icon: 'HeartHandshake',
      cards: createCardsForCategory(cardsAll.cupido, language),
    },
    {
      id: 'culturaGenerale',
      name: 'Cultura Generale',
      color: 'bg-cyan-500',
      icon: 'Globe',
      cards: createCardsForCategory(cardsAll.culturaGenerale, language),
    },
    {
      id: 'proEcontro',
      name: 'Pro & Contro',
      color: 'bg-indigo-500',
      icon: 'Scale',
      cards: createCardsForCategory(cardsAll.proEcontro, language),
    },
    {
      id: 'nonHomai',
      name: 'Non Ho Mai',
      color: 'bg-gray-500',
      icon: 'AlertCircle',
      cards: createCardsForCategory(cardsAll.nonHomai, language),
    },
    {
      id: 'cercaELeggi',
      name: 'Cerca e Leggi',
      color: 'bg-emerald-500',
      icon: 'Search',
      cards: createCardsForCategory(cardsAll.cercaELeggi, language),
    }
  ];
}
