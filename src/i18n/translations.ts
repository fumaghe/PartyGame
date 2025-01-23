// src/i18n/translations.ts
export const translations = {
  en: {
    title: 'Secret Memories',
    playerSetup: {
      title: 'Player Setup',
      subtitle: 'Add at least 2 players to start',
      placeholder: 'Enter player name',
      startButton: 'Start Game'
    },
    game: {
      turn: "'s Turn",
      chooseTopicPrompt: 'Choose your topic',
      challengePrompt: 'Complete your challenge',
      done: 'Done',
      failed: 'Failed',
      players: 'Players',
      ranking: 'Ranking',
      points: 'points',
      stats: 'Statistics',
      completedChallenges: '',
      failedChallenges: '',

      // Prima stavi mettendo questi altrove, ora li mettiamo dentro game
      failedPopupTitle: 'Drink Up!',
      failedPopupMessage: 'You have accumulated 2 fails! Take a drink as penalty!',
      ok: 'OK',

      // Tasto reset
      reset: 'RESET GAME',

      // Popup di conferma reset
      confirmResetTitle: 'Confirm Reset',
      confirmResetMessage: 'Are you sure you want to reset the game? All data will be lost.',
      confirmResetYes: 'Yes, Reset',
      confirmResetNo: 'Cancel',

      // SPOSTIAMO QUI i topics
      topics: {
        domandePiccanti: 'Spicy Questions',
        cosaPreferirestiPiccante: 'Would You Rather',
        killKissMarryFamosi: 'Kill Kiss Marry',
        chiInQuestaStanzaEPropenso: 'Who in this room...',
        indovinaLaCanzone: 'Guess the Song',
        drink: 'Drink',
        cupido: 'Cupid',
        culturaGenerale: 'General Culture',
        proEcontro: 'Pros & Cons',
        nonHomai: 'Never Have I Ever',
        cercaELeggi: 'Search & Read'
      }
    }
  },

  fr: {
    title: 'Secret Memories',
    playerSetup: {
      title: 'Configuration des Joueurs',
      subtitle: 'Ajoutez au moins 2 joueurs pour commencer',
      placeholder: 'Entrez le nom du joueur',
      startButton: 'Commencer le Jeu'
    },
    game: {
      turn: ' à son Tour',
      chooseTopicPrompt: 'Choisissez votre sujet',
      challengePrompt: 'Complétez votre défi',
      done: 'Fait',
      failed: 'Échoué',
      players: 'Joueurs',
      ranking: 'Classement',
      points: 'points',
      stats: 'Statistiques',
      completedChallenges: '',
      failedChallenges: '',

      failedPopupTitle: 'À boire !',
      failedPopupMessage: 'Vous avez accumulé 2 échecs ! Prenez un verre en pénalité !',
      ok: 'OK',

      reset: 'RÉINITIALISER',

      confirmResetTitle: 'Confirmer la Réinitialisation',
      confirmResetMessage: 'Êtes-vous sûr de vouloir réinitialiser la partie ? Toutes les données seront perdues.',
      confirmResetYes: 'Oui, Réinitialiser',
      confirmResetNo: 'Annuler',

      topics: {
        domandePiccanti: 'Questions Épicées',
        cosaPreferirestiPiccante: 'Que Préféreriez-vous',
        killKissMarryFamosi: 'Tuer Embrasser Marier',
        chiInQuestaStanzaEPropenso: 'Qui dans cette pièce...',
        indovinaLaCanzone: 'Devinez la Chanson',
        drink: 'Boire',
        cupido: 'Cupidon',
        culturaGenerale: 'Culture Générale',
        proEcontro: 'Pour & Contre',
        nonHomai: "Je n'ai jamais...",
        cercaELeggi: 'Chercher & Lire'
      }
    }
  },

  it: {
    title: 'Secret Memories',
    playerSetup: {
      title: 'Configurazione Giocatori',
      subtitle: 'Aggiungi almeno 2 giocatori per iniziare',
      placeholder: 'Inserisci il nome del giocatore',
      startButton: 'Inizia Gioco'
    },
    game: {
      turn: ' è il tuo turno',
      chooseTopicPrompt: 'Scegli il tuo argomento',
      challengePrompt: 'Completa la sfida',
      done: 'Fatto',
      failed: 'Fallito',
      players: 'Giocatori',
      ranking: 'Classifica',
      points: 'punti',
      stats: 'Statistiche',
      completedChallenges: '',
      failedChallenges: '',

      failedPopupTitle: 'Bevi!',
      failedPopupMessage: 'Hai accumulato 2 fallimenti! Bevi un sorso come penalità!',
      ok: 'OK',

      reset: 'RESET PARTITA',

      confirmResetTitle: 'Conferma Reset',
      confirmResetMessage: 'Sei sicuro di voler resettare la partita? Tutti i dati andranno persi.',
      confirmResetYes: 'Sì, Reset',
      confirmResetNo: 'Annulla',

      topics: {
        domandePiccanti: 'Domande Piccanti',
        cosaPreferirestiPiccante: 'Cosa Preferiresti',
        killKissMarryFamosi: 'Kill Kiss Marry',
        chiInQuestaStanzaEPropenso: 'Chi in questa stanza...',
        indovinaLaCanzone: 'Indovina la Canzone',
        drink: 'Bevi',
        cupido: 'Cupido',
        culturaGenerale: 'Cultura Generale',
        proEcontro: 'Pro & Contro',
        nonHomai: 'Non Ho Mai',
        cercaELeggi: 'Cerca e Leggi'
      }
    }
  }
};
