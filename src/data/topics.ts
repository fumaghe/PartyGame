// src/data/topics.ts
import { Topic } from '../types';
import cardsAll from './cardsAll.json';

/**
 * Crea un array di Card da un array di oggetti
 * { it: string; en: string; fr: string }
 */
function createCardsForCategory(categoryData: any[]) {
  return categoryData.map((item) => ({
    id: item.id, // Assicurati che 'id' sia presente nel JSON
    content: {
      it: item.it,
      en: item.en,
      fr: item.fr,
    },
    used: false,
    answer: item.answer
      ? {
          it: item.answer.it,
          en: item.answer.en,
          fr: item.answer.fr,
        }
      : undefined,
    type: item.type || 'default',
    image: item.image || null,
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
      minPoints: 1,
      maxPoints: 3,
    },
    {
      id: 'cosaPreferirestiPiccante',
      name: 'Cosa Preferiresti Piccante',
      color: 'bg-purple-500',
      icon: 'SplitSquareVertical',
      cards: createCardsForCategory(cardsAll.cosaPreferirestiPiccante),
      minPoints: 1,
      maxPoints: 4,
    },
    {
      id: 'killKissMarryFamosi',
      name: 'Kill Kiss Marry',
      color: 'bg-pink-500',
      icon: 'Heart',
      cards: createCardsForCategory(cardsAll.killKissMarryFamosi),
      minPoints: 2,
      maxPoints: 5,
    },
    {
      id: 'chiInQuestaStanzaEPropenso',
      name: 'Chi in questa stanza...',
      color: 'bg-blue-500',
      icon: 'Users',
      cards: createCardsForCategory(cardsAll.chiInQuestaStanzaEPropenso),
      minPoints: 2,
      maxPoints: 4,
    },
    {
      id: 'indovinaLaCanzone',
      name: 'Indovina la Canzone',
      color: 'bg-green-500',
      icon: 'Music',
      cards: createCardsForCategory(cardsAll.indovinaLaCanzone),
      minPoints: 3,
      maxPoints: 5,
    },
    {
      id: 'drink',
      name: 'Drink',
      color: 'bg-amber-500',
      icon: 'Beer',
      cards: createCardsForCategory(cardsAll.drink),
      minPoints: 3,
      maxPoints: 6,
    },
    {
      id: 'cupido',
      name: 'Cupido',
      color: 'bg-rose-500',
      icon: 'HeartHandshake',
      cards: createCardsForCategory(cardsAll.cupido),
      minPoints: 1,
      maxPoints: 2,
    },
    {
      id: 'culturaGenerale',
      name: 'Cultura Generale',
      color: 'bg-cyan-500',
      icon: 'Globe',
      cards: createCardsForCategory(cardsAll.culturaGenerale),
      minPoints: 3,
      maxPoints: 5,
    },
    {
      id: 'proEcontro',
      name: 'Pro & Contro',
      color: 'bg-indigo-500',
      icon: 'Scale',
      cards: createCardsForCategory(cardsAll.proEcontro),
      minPoints: 2,
      maxPoints: 4,
    },
    {
      id: 'nonHomai',
      name: 'Non Ho Mai',
      color: 'bg-gray-500',
      icon: 'AlertCircle',
      cards: createCardsForCategory(cardsAll.nonHomai),
      minPoints: 1,
      maxPoints: 3,
    },
    {
      id: 'obbligo',
      name: 'Obbligo',
      color: 'bg-yellow-500',
      icon: 'AlertTriangle',
      cards: createCardsForCategory(cardsAll.obbligo),
      minPoints: 4,
      maxPoints: 7,
    },
    {
      id: 'tabu',
      name: 'Tabù',
      color: 'bg-teal-500',
      icon: 'Lock',
      cards: createCardsForCategory(cardsAll.tabu),
      minPoints: 2,
      maxPoints: 5,
    },
    {
      id: 'indovinaIlSegreto',
      name: 'Indovina il Segreto',
      color: 'bg-purple-600',
      icon: 'Eye',
      cards: createCardsForCategory(cardsAll.indovinaIlSegreto),
      minPoints: 4,
      maxPoints: 8,
    },
    {
      id: 'rankIT',
      name: 'Rank IT',
      color: 'bg-pink-600',
      icon: 'TrendingUp',
      cards: createCardsForCategory(cardsAll.rankIT),
      minPoints: 5,
      maxPoints: 9,
    },
    {
      id: 'reazioneACatena',
      name: 'Reazione a Catena',
      color: 'bg-orange-500',
      icon: 'Link',
      cards: createCardsForCategory(cardsAll.reazioneACatena),
      minPoints: 3,
      maxPoints: 6,
    },
    {
      id: 'random',
      name: 'Random',
      color: 'bg-gray-600',
      icon: 'Shuffle',
      cards: createCardsForCategory(cardsAll.random),
      minPoints: 1,
      maxPoints: 10,
    },
    {
      id: 'sfidaEmoji',
      name: 'Sfida Emoji',
      color: 'bg-pink-700',
      icon: 'Smile',
      cards: createCardsForCategory(cardsAll.sfidaEmoji),
      minPoints: 4,
      maxPoints: 8,
    },
    {
      id: 'geoguessr',
      name: 'GeoGuessr',
      color: 'bg-green-700',
      icon: 'MapPin',
      cards: createCardsForCategory(cardsAll.geoguessr),
      minPoints: 3,
      maxPoints: 6,
    }
  ];
}
