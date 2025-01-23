// src/components/GameCard.tsx
import React, { useState } from 'react';
import { Card, Language, TopicType } from '../types';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import useSound from 'use-sound';

/**
 * Dizionario con TUTTE le domande di culturaGenerale (in it/en/fr),
 * ognuna mappata a { it: '...', en: '...', fr: '...' } con la risposta.
 *
 * Se la "chiave" (question) combacia con "card.content[currentLanguage]",
 * allora possiamo mostrare "answersMap[domanda][currentLanguage]".
 */
const answersMap: Record<string, { it: string; en: string; fr: string }> = {

  // 1) Qual'è la capitale dell'Australia?
  "Qual'è la capitale dell'Australia?": { it: "Canberra", en: "Canberra", fr: "Canberra" },
  "What is the capital of Australia?": { it: "Canberra", en: "Canberra", fr: "Canberra" },
  "Quelle est la capitale de l'Australie?": { it: "Canberra", en: "Canberra", fr: "Canberra" },

  // 2) Chi ha dipinto la Gioconda?
  "Chi ha dipinto la Gioconda?": { it: "Leonardo da Vinci", en: "Leonardo da Vinci", fr: "Léonard de Vinci" },
  "Who painted the Mona Lisa?": { it: "Leonardo da Vinci", en: "Leonardo da Vinci", fr: "Léonard de Vinci" },
  "Qui a peint la Joconde?": { it: "Leonardo da Vinci", en: "Leonardo da Vinci", fr: "Léonard de Vinci" },

  // 3) Quanti continenti ci sono?
  "Quanti continenti ci sono?": { it: "7", en: "7", fr: "7" },
  "How many continents are there?": { it: "7", en: "7", fr: "7" },
  "Combbien y a-t-il de continents?": { it: "7", en: "7", fr: "7" },

  // 4) Qual'è lo stato più piccolo al mondo?
  "Qual'è lo stato più piccolo al mondo?": { it: "Città del Vaticano", en: "Vatican City", fr: "Cité du Vatican" },
  "What is the smallest country in the world?": { it: "Città del Vaticano", en: "Vatican City", fr: "Cité du Vatican" },
  "Quel est le lus petit pays du monde?": { it: "Città del Vaticano", en: "Vatican City", fr: "Cité du Vatican" },

  // 5) In che anno è affondato il Titanic?
  "In che anno è affondato il Titanic?": { it: "1912", en: "1912", fr: "1912" },
  "In which year did the Titanic sink?": { it: "1912", en: "1912", fr: "1912" },
  "En quelle annèe le Titanic a-t-il coulé?": { it: "1912", en: "1912", fr: "1912" },

  // 6) Qual'è il simbolo chimica dell'oro?
  "Qual'è il simbolo chimica dell'oro?": { it: "Au", en: "Au", fr: "Au" },
  "What is the chemical symbol for gold?": { it: "Au", en: "Au", fr: "Au" },
  "Quel est le symbole chimique de l'or?": { it: "Au", en: "Au", fr: "Au" },

  // 7) Qual'è l'animale nazionale del Canada?
  "Qual'è l'animale nazionale del Canada?": { it: "Castoro", en: "Beaver", fr: "Castor" },
  "What is the national animal of Canada?": { it: "Castoro", en: "Beaver", fr: "Castor" },
  "Quel est l'animal national du Canada?": { it: "Castoro", en: "Beaver", fr: "Castor" },

  // 8) Quanti calciatori compongono una partità di calcio?
  "Quanti calciatori compongono una partità di calcio?": { it: "22 (11 vs 11)", en: "22 (11 vs 11)", fr: "22 (11 vs 11)" },
  "How many players are on a soccer match?": { it: "22 (11 vs 11)", en: "22 (11 vs 11)", fr: "22 (11 vs 11)" },
  "Combien de joueurs composent un match de football?": { it: "22 (11 vs 11)", en: "22 (11 vs 11)", fr: "22 (11 vs 11)" },

  // 9) Chi ha scritto Romeo e Giulietta?
  "Chi ha scritto Romeo e Giulietta?": { it: "William Shakespeare", en: "William Shakespeare", fr: "William Shakespeare" },
  "Who wrote Romeo and Juliet?": { it: "William Shakespeare", en: "William Shakespeare", fr: "William Shakespeare" },
  "Qui a écrit Roméo et Juliette?": { it: "William Shakespeare", en: "William Shakespeare", fr: "William Shakespeare" },

  // 10) Qual'è l'oceano più grande del mondo?
  "Qual'è l'oceano più grande del mondo?": { it: "Oceano Pacifico", en: "The Pacific Ocean", fr: "L'océan Pacifique" },
  "What is the largest ocean on Earth?": { it: "Oceano Pacifico", en: "The Pacific Ocean", fr: "L'océan Pacifique" },
  "Quel est l'océan le plus grand du monde?": { it: "Oceano Pacifico", en: "The Pacific Ocean", fr: "L'océan Pacifique" },

  // 11) Qual'è l'animale di terra più veloce?
  "Qual'è l'animale di terra più veloce?": { it: "Ghepardo", en: "Cheetah", fr: "Guépard" },
  "What is the fastest land animal?": { it: "Ghepardo", en: "Cheetah", fr: "Guépard" },
  "Quel est l'animal terrestre le plus rapide?": { it: "Ghepardo", en: "Cheetah", fr: "Guépard" },

  // 12) In che hanno è finita la seconda guerra mondiale?
  "In che hanno è finita la seconda guerra mondiale?": { it: "1945", en: "1945", fr: "1945" },
  "What year did WWII end?": { it: "1945", en: "1945", fr: "1945" },
  "En quelle année la Seconde Guerre mondiale s'est-elle terminée?": { it: "1945", en: "1945", fr: "1945" },

  // 13) Qual'è l'ingrediente principale del guacamole?
  "Qual'è l'ingrediente principale del guacamole?": { it: "Avocado", en: "Avocado", fr: "Avocat" },
  "What is the main ingredient in guacamole?": { it: "Avocado", en: "Avocado", fr: "Avocat" },
  "Quel est l'ingrédient principal su guacamole?": { it: "Avocado", en: "Avocado", fr: "Avocat" },

  // 14) Chi ha scoperto la gravità?
  "Chi ha scoperto la gravità?": { it: "Isaac Newton", en: "Isaac Newton", fr: "Isaac Newton" },
  "Who discovered gravity?": { it: "Isaac Newton", en: "Isaac Newton", fr: "Isaac Newton" },
  "Qui a décourvert la gravité?": { it: "Isaac Newton", en: "Isaac Newton", fr: "Isaac Newton" },

  // 15) Qual'è la montagna più alta del mondo?
  "Qual'è la montagna più alta del mondo?": { it: "Monte Everest", en: "Mount Everest", fr: "Mont Everest" },
  "What is the tallest mountain in the world?": { it: "Monte Everest", en: "Mount Everest", fr: "Mont Everest" },
  "Quelle est la plus haute montagne du monde?": { it: "Monte Everest", en: "Mount Everest", fr: "Mont Everest" },

  // 16) Chi è il primo uomo ad aver camminato sulla luna?
  "Chi è il primo uomo ad aver camminato sulla luna?": { it: "Neil Armstrong", en: "Neil Armstrong", fr: "Neil Armstrong" },
  "Who was the first man to walk on the moon?": { it: "Neil Armstrong", en: "Neil Armstrong", fr: "Neil Armstrong" },
  "Qui a été la premier homme à marcher sur la Lune?": { it: "Neil Armstrong", en: "Neil Armstrong", fr: "Neil Armstrong" },

  // 17) Qual è il paese più grande del mondo per superficie?
  "Qual è il paese più grande del mondo per superficie?": { it: "Russia", en: "Russia", fr: "Russie" },
  "What is the largest country in the world by area?": { it: "Russia", en: "Russia", fr: "Russie" },
  "Quel est le plus grand pays du monde par superficie ?": { it: "Russia", en: "Russia", fr: "Russie" },

  // 18) Qual è il pianeta più vicino al sole?
  "Qual è il pianeta più vicino al sole?": { it: "Mercurio", en: "Mercury", fr: "Mercure" },
  "What is the planet closest to the sun?": { it: "Mercurio", en: "Mercury", fr: "Mercure" },
  "Quelle est la planète la plus proche du soleil ?": { it: "Mercurio", en: "Mercury", fr: "Mercure" },

  // 19) In quale anno è avvenuto il primo sbarco sulla Luna?
  "In quale anno è avvenuto il primo sbarco sulla Luna?": { it: "1969", en: "1969", fr: "1969" },
  "In what year did the first moon landing occur?": { it: "1969", en: "1969", fr: "1969" },
  "En quelle année a eu lieu le premier alunissage ?": { it: "1969", en: "1969", fr: "1969" },

  // 20) Qual è la capitale della Spagna?
  "Qual è la capitale della Spagna?": { it: "Madrid", en: "Madrid", fr: "Madrid" },
  "What is the capital of Spain?": { it: "Madrid", en: "Madrid", fr: "Madrid" },
  "Quelle est la capitale de l'Espagne ?": { it: "Madrid", en: "Madrid", fr: "Madrid" },

  // 21) Quanti colori ci sono nell'arcobaleno?
  "Quanti colori ci sono nell'arcobaleno?": { it: "7", en: "7", fr: "7" },
  "How many colors are there in a rainbow?": { it: "7", en: "7", fr: "7" },
  "Combien de couleurs y a-t-il dans un arc-en-ciel ?": { it: "7", en: "7", fr: "7" },

  // 22) Chi è conosciuto come il padre della fisica moderna?
  "Chi è conosciuto come il padre della fisica moderna?": { it: "Albert Einstein", en: "Albert Einstein", fr: "Albert Einstein" },
  "Who is known as the father of modern physics?": { it: "Albert Einstein", en: "Albert Einstein", fr: "Albert Einstein" },
  "Qui est connu comme le père de la physique moderne ?": { it: "Albert Einstein", en: "Albert Einstein", fr: "Albert Einstein" },

  // 23) Qual è il fiume più lungo del mondo?
  "Qual è il fiume più lungo del mondo?": { it: "Il Nilo (discutibile con il Rio delle Amazzoni)", en: "The Nile", fr: "Le Nil" },
  "What is the longest river in the world?": { it: "Il Nilo (o Amazzoni)", en: "The Nile", fr: "Le Nil" },
  "Quel est le fleuve le plus long du monde ?": { it: "Il Nilo", en: "The Nile", fr: "Le Nil" },

  // 24) Qual è l'animale più veloce sulla terra?
  "Qual è l'animale più veloce sulla terra?": { it: "Ghepardo", en: "Cheetah", fr: "Guépard" },
  "What is the fastest animal on land?": { it: "Ghepardo", en: "Cheetah", fr: "Guépard" },
  "Quel est l'animal le plus rapide sur terre ?": { it: "Ghepardo", en: "Cheetah", fr: "Guépard" },

  // 25) Chi ha dipinto la Gioconda? (ripetuto)
  // (Già inserito sopra: #2)

  // 26) Qual è il simbolo chimico dell'oro? (ripetuto #6)

  // 27) In quale paese si trova la Torre Eiffel?
  "In quale paese si trova la Torre Eiffel?": { it: "Francia", en: "France", fr: "France" },
  "In which country is the Eiffel Tower located?": { it: "Francia", en: "France", fr: "France" },
  "Dans quel pays se trouve la Tour Eiffel ?": { it: "Francia", en: "France", fr: "France" },

  // 28) Quanti stati ci sono negli Stati Uniti?
  "Quanti stati ci sono negli Stati Uniti?": { it: "50", en: "50", fr: "50" },
  "How many states are there in the United States?": { it: "50", en: "50", fr: "50" },
  "Combien d'États y a-t-il aux États-Unis ?": { it: "50", en: "50", fr: "50" },

  // 29) Qual è l'oceano più grande del mondo? (ripetuto #10)

  // 30) Chi è l'autore de 'L'Origine delle Specie'?
  "Chi è l'autore de 'L'Origine delle Specie'?": { it: "Charles Darwin", en: "Charles Darwin", fr: "Charles Darwin" },
  "Who is the author of 'The Origin of Species'?": { it: "Charles Darwin", en: "Charles Darwin", fr: "Charles Darwin" },
  "Qui est l'auteur de 'L'Origine des espèces' ?": { it: "Charles Darwin", en: "Charles Darwin", fr: "Charles Darwin" },

  // 31) Qual è la lingua più parlata al mondo?
  "Qual è la lingua più parlata al mondo?": { it: "Cinese Mandarino", en: "Mandarin Chinese", fr: "Chinois Mandarin" },
  "What is the most spoken language in the world?": { it: "Cinese Mandarino", en: "Mandarin Chinese", fr: "Chinois Mandarin" },
  "Quelle est la langue la plus parlée dans le monde ?": { it: "Cinese Mandarino", en: "Mandarin Chinese", fr: "Chinois Mandarin" },

  // 32) Qual è il metallo più abbondante nella crosta terrestre?
  "Qual è il metallo più abbondante nella crosta terrestre?": { it: "Alluminio", en: "Aluminum", fr: "Aluminium" },
  "What is the most abundant metal in the Earth's crust?": { it: "Alluminio", en: "Aluminum", fr: "Aluminium" },
  "Quel est le métal le plus abondant dans la croûte terrestre ?": { it: "Alluminio", en: "Aluminum", fr: "Aluminium" },

  // 33) Chi è stato il primo presidente degli Stati Uniti?
  "Chi è stato il primo presidente degli Stati Uniti?": { it: "George Washington", en: "George Washington", fr: "George Washington" },
  "Who was the first president of the United States?": { it: "George Washington", en: "George Washington", fr: "George Washington" },
  "Qui fut le premier président des États-Unis ?": { it: "George Washington", en: "George Washington", fr: "George Washington" },

  // 34) Quante ossa ci sono nel corpo umano?
  "Quante ossa ci sono nel corpo umano?": { it: "206", en: "206", fr: "206" },
  "How many bones are there in the human body?": { it: "206", en: "206", fr: "206" },
  "Combien d'os y a-t-il dans le corps humain ?": { it: "206", en: "206", fr: "206" },

  // 35) In quale città si trovano le Piramidi di Giza?
  "In quale città si trovano le Piramidi di Giza?": { it: "Giza (vicino al Cairo)", en: "Giza (near Cairo)", fr: "Gizeh (près du Caire)" },
  "In which city are the Pyramids of Giza located?": { it: "Giza, Egitto", en: "Giza, Egypt", fr: "Gizeh, Égypte" },
  "Dans quelle ville se trouvent les Pyramides de Gizeh ?": { it: "Giza, Egitto", en: "Giza, Egypt", fr: "Gizeh, Égypte" },

  // 36) Qual è la valuta ufficiale del Giappone?
  "Qual è la valuta ufficiale del Giappone?": { it: "Yen", en: "Yen", fr: "Yen" },
  "What is the official currency of Japan?": { it: "Yen", en: "Yen", fr: "Yen" },
  "Quelle est la monnaie officielle du Japon ?": { it: "Yen", en: "Yen", fr: "Yen" },

  // 37) Chi ha scoperto la penicillina?
  "Chi ha scoperto la penicillina?": { it: "Alexander Fleming", en: "Alexander Fleming", fr: "Alexander Fleming" },
  "Who discovered penicillin?": { it: "Alexander Fleming", en: "Alexander Fleming", fr: "Alexander Fleming" },
  "Qui a découvert la pénicilline ?": { it: "Alexander Fleming", en: "Alexander Fleming", fr: "Alexander Fleming" },

  // 38) Qual è il simbolo chimico dell'acqua?
  "Qual è il simbolo chimico dell'acqua?": { it: "H2O", en: "H2O", fr: "H2O" },
  "What is the chemical symbol for water?": { it: "H2O", en: "H2O", fr: "H2O" },
  "Quel est le symbole chimique de l'eau ?": { it: "H2O", en: "H2O", fr: "H2O" },

  // 39) Qual è la montagna più alta del mondo? (repeat #15)

  // 40) In quale continente si trova l'Egitto?
  "In quale continente si trova l'Egitto?": { it: "Africa", en: "Africa", fr: "Afrique" },
  "On which continent is Egypt located?": { it: "Africa", en: "Africa", fr: "Afrique" },
  "Sur quel continent se trouve l'Égypte ?": { it: "Africa", en: "Africa", fr: "Afrique" },

  // 41) Qual è il nome del più grande mammifero marino?
  "Qual è il nome del più grande mammifero marino?": { it: "Balenottera azzurra", en: "Blue whale", fr: "Baleine bleue" },
  "What is the name of the largest marine mammal?": { it: "Balenottera azzurra", en: "Blue whale", fr: "Baleine bleue" },
  "Quel est le nom du plus grand mammifère marin ?": { it: "Balenottera azzurra", en: "Blue whale", fr: "Baleine bleue" },

  // 42) Qual è il simbolo zodiacale di chi è nato a luglio?
  "Qual è il simbolo zodiacale di chi è nato a luglio?": { it: "Cancro o Leone (dipende dalla data)", en: "Cancer or Leo (depends on the date)", fr: "Cancer ou Lion (selon la date)" },
  "What is the zodiac sign for someone born in July?": { it: "Cancro o Leone", en: "Cancer or Leo", fr: "Cancer ou Lion" },
  "Quel est le signe du zodiaque de quelqu'un né en juillet ?": { it: "Cancro/Leone", en: "Cancer/Leo", fr: "Cancer/Lion" },

  // 43) Qual è il colore del sangue ossigenato?
  "Qual è il colore del sangue ossigenato?": { it: "Rosso vivo", en: "Bright red", fr: "Rouge vif" },
  "What color is oxygenated blood?": { it: "Rosso vivo", en: "Bright red", fr: "Rouge vif" },
  "Quelle est la couleur du sang oxygéné ?": { it: "Rouge vif", en: "Bright red", fr: "Rouge vif" },

  // 44) Qual è l'unico mammifero capace di volare?
  "Qual è l'unico mammifero capace di volare?": { it: "Pipistrello", en: "Bat", fr: "Chauve-souris" },
  "What is the only mammal capable of flight?": { it: "Pipistrello", en: "Bat", fr: "Chauve-souris" },
  "Quel est le seul mammifère capable de voler ?": { it: "Pipistrello", en: "Bat", fr: "Chauve-souris" },

  // 45) Qual è la capitale dell'Australia? (ripetuto #1)

  // 46) Chi ha dipinto 'La notte stellata'?
  "Chi ha dipinto 'La notte stellata'?": { it: "Vincent van Gogh", en: "Vincent van Gogh", fr: "Vincent van Gogh" },
  "Who painted 'Starry Night'?": { it: "Vincent van Gogh", en: "Vincent van Gogh", fr: "Vincent van Gogh" },
  "Qui a peint 'La Nuit étoilée' ?": { it: "Vincent van Gogh", en: "Vincent van Gogh", fr: "Vincent van Gogh" },

  // 47) Qual è il nome scientifico per l'uomo moderno?
  "Qual è il nome scientifico per l'uomo moderno?": { it: "Homo sapiens", en: "Homo sapiens", fr: "Homo sapiens" },
  "What is the scientific name for modern humans?": { it: "Homo sapiens", en: "Homo sapiens", fr: "Homo sapiens" },
  "Quel est le nom scientifique des humains modernes ?": { it: "Homo sapiens", en: "Homo sapiens", fr: "Homo sapiens" },

  // 48) Qual è la capitale del Canada?
  "Qual è la capitale del Canada?": { it: "Ottawa", en: "Ottawa", fr: "Ottawa" },
  "What is the capital of Canada?": { it: "Ottawa", en: "Ottawa", fr: "Ottawa" },
  "Quelle est la capitale du Canada ?": { it: "Ottawa", en: "Ottawa", fr: "Ottawa" },

  // 49) Quale animale è conosciuto come il 're della giungla'?
  "Quale animale è conosciuto come il 're della giungla'?": { it: "Leone", en: "Lion", fr: "Lion" },
  "What animal is known as the 'king of the jungle'?": { it: "Leone", en: "Lion", fr: "Lion" },
  "Quel animal est connu comme le 'roi de la jungle' ?": { it: "Leone", en: "Lion", fr: "Lion" },

  // 50) Qual è il paese con più vulcani attivi al mondo?
  "Qual è il paese con più vulcani attivi al mondo?": { it: "Indonesia", en: "Indonesia", fr: "Indonésie" },
  "Which country has the most active volcanoes in the world?": { it: "Indonesia", en: "Indonesia", fr: "Indonésie" },
  "Quel pays a le plus de volcans actifs au monde ?": { it: "Indonesia", en: "Indonesia", fr: "Indonésie" },

  // 51) Chi è il CEO di Tesla?
  "Chi è il CEO di Tesla?": { it: "Elon Musk", en: "Elon Musk", fr: "Elon Musk" },
  "Who is the CEO of Tesla?": { it: "Elon Musk", en: "Elon Musk", fr: "Elon Musk" },
  "Qui est le PDG de Tesla ?": { it: "Elon Musk", en: "Elon Musk", fr: "Elon Musk" },

  // 52) Qual è il frutto principale del cioccolato?
  "Qual è il frutto principale del cioccolato?": { it: "Cacao", en: "Cacao", fr: "Cacao" },
  "What is the main fruit used to make chocolate?": { it: "Cacao", en: "Cacao", fr: "Cacao" },
  "Quel est le fruit principal utilisé pour faire du chocolat ?": { it: "Cacao", en: "Cacao", fr: "Cacao" },

  // 53) Qual è il nome dell'autore di Harry Potter?
  "Qual è il nome dell'autore di Harry Potter?": { it: "J.K. Rowling", en: "J.K. Rowling", fr: "J.K. Rowling" },
  "What is the name of the author of Harry Potter?": { it: "J.K. Rowling", en: "J.K. Rowling", fr: "J.K. Rowling" },
  "Quel est le nom de l'auteur de Harry Potter ?": { it: "J.K. Rowling", en: "J.K. Rowling", fr: "J.K. Rowling" },

  // 54) Qual è la velocità della luce in km/s?
  "Qual è la velocità della luce in km/s?": { it: "~300.000 km/s", en: "~300,000 km/s", fr: "~300 000 km/s" },
  "What is the speed of light in km/s?": { it: "~300.000 km/s", en: "~300,000 km/s", fr: "~300 000 km/s" },
  "Quelle est la vitesse de la lumière en km/s ?": { it: "~300.000 km/s", en: "~300,000 km/s", fr: "~300 000 km/s" },

  // 55) Chi è stato il primo uomo a volare nello spazio?
  "Chi è stato il primo uomo a volare nello spazio?": { it: "Yuri Gagarin", en: "Yuri Gagarin", fr: "Youri Gagarine" },
  "Who was the first man to fly into space?": { it: "Yuri Gagarin", en: "Yuri Gagarin", fr: "Youri Gagarine" },
  "Qui fut le premier homme à aller dans l'espace ?": { it: "Yuri Gagarin", en: "Yuri Gagarin", fr: "Youri Gagarine" },

  // 56) Qual è la capitale della Germania?
  "Qual è la capitale della Germania?": { it: "Berlino", en: "Berlin", fr: "Berlin" },
  "What is the capital of Germany?": { it: "Berlino", en: "Berlin", fr: "Berlin" },
  "Quelle est la capitale de l'Allemagne ?": { it: "Berlino", en: "Berlin", fr: "Berlin" },

  // 57) Qual è il metallo liquido a temperatura ambiente?
  "Qual è il metallo liquido a temperatura ambiente?": { it: "Mercurio", en: "Mercury", fr: "Mercure" },
  "What is the liquid metal at room temperature?": { it: "Mercurio", en: "Mercury", fr: "Mercure" },
  "Quel est le métal liquide à température ambiante ?": { it: "Mercurio", en: "Mercury", fr: "Mercure" },

  // 58) Qual è il nome del pianeta rosso?
  "Qual è il nome del pianeta rosso?": { it: "Marte", en: "Mars", fr: "Mars" },
  "What is the name of the red planet?": { it: "Marte", en: "Mars", fr: "Mars" },
  "Quel est le nom de la planète rouge ?": { it: "Marte", en: "Mars", fr: "Mars" },

  // 59) Qual è l'unità di misura della corrente elettrica?
  "Qual è l'unità di misura della corrente elettrica?": { it: "Ampere (A)", en: "Ampere (A)", fr: "Ampère (A)" },
  "What is the unit of measurement for electric current?": { it: "Ampere (A)", en: "Ampere (A)", fr: "Ampère (A)" },
  "Quelle est l'unité de mesure du courant électrique ?": { it: "Ampere (A)", en: "Ampere (A)", fr: "Ampère (A)" },

  // 60) Qual è la capitale dell'Italia?
  "Qual è la capitale dell'Italia?": { it: "Roma", en: "Rome", fr: "Rome" },
  "What is the capital of Italy?": { it: "Roma", en: "Rome", fr: "Rome" },
  "Quelle est la capitale de l'Italie ?": { it: "Rome", en: "Rome", fr: "Rome" },

  // 61) Qual è il colore della bandiera del Giappone?
  "Qual è il colore della bandiera del Giappone?": { it: "Bianca con un cerchio rosso", en: "White with a red circle", fr: "Blanc avec un cercle rouge" },
  "What is the color of Japan’s flag?": { it: "Bianca con un cerchio rosso", en: "White with a red circle", fr: "Blanc avec un cercle rouge" },
  "Quelle est la couleur du drapeau japonais ?": { it: "Blanche avec un cercle rouge", en: "White with a red circle", fr: "Blanche avec un cercle rouge" },

  // 62) Chi ha scritto 'La Divina Commedia'?
  "Chi ha scritto 'La Divina Commedia'?": { it: "Dante Alighieri", en: "Dante Alighieri", fr: "Dante Alighieri" },
  "Who wrote 'The Divine Comedy'?": { it: "Dante Alighieri", en: "Dante Alighieri", fr: "Dante Alighieri" },
  "Qui a écrit 'La Divine Comédie' ?": { it: "Dante Alighieri", en: "Dante Alighieri", fr: "Dante Alighieri" },
};

interface GameCardProps {
  card: Card;
  color: string;
  onComplete: (success: boolean) => void;
  darkMode: boolean;
  currentLanguage: Language;
  t: {
    done: string;
    failed: string;
  };
  topicId: TopicType; // per capire se è culturaGenerale
}

export default function GameCard({
  card,
  color,
  onComplete,
  darkMode,
  currentLanguage,
  t,
  topicId
}: GameCardProps) {
  const [playSuccess] = useSound('/success.mp3', { volume: 0.5 });
  const [playFail] = useSound('/fail.mp3', { volume: 0.5 });

  // Se clicco "Show Answer", apro un popup
  const [showAnswer, setShowAnswer] = useState(false);

  const handleComplete = (success: boolean) => {
    if (success) playSuccess();
    else playFail();
    onComplete(success);
  };

  // Testo della domanda nella lingua corrente
  const cardText = card.content[currentLanguage];

  // Cerchiamo la risposta nel dizionario, se esiste
  const maybeAnswerObj = answersMap[cardText];
  const answerText = maybeAnswerObj ? maybeAnswerObj[currentLanguage] : "No answer found!";

  return (
    <div className={`${color} p-8 rounded-2xl shadow-lg max-w-lg mx-auto transform transition-all animate-cardFlip`}>
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/10'} backdrop-blur-sm rounded-xl p-6 mb-6`}>
        <p className="text-2xl text-white leading-relaxed">{cardText}</p>
      </div>

      {/* Se è culturaGenerale, mostriamo pulsante "Show Answer" */}
      {topicId === 'culturaGenerale' && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => setShowAnswer(true)}
            className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-white px-4 py-2 rounded-xl transition-transform font-semibold hover:scale-105"
          >
            <Info size={20} />
            Show Answer
          </button>
        </div>
      )}

      {/* Bottoni Done / Failed */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleComplete(true)}
          className="flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm text-white px-6 py-4 rounded-xl transition-transform font-semibold hover:scale-105"
        >
          <CheckCircle2 size={20} />
          {t.done}
        </button>
        <button
          onClick={() => handleComplete(false)}
          className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white px-6 py-4 rounded-xl transition-transform font-semibold hover:scale-105"
        >
          <XCircle size={20} />
          {t.failed}
        </button>
      </div>

      {/* Popup con la risposta */}
      {showAnswer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-md w-full rounded-2xl shadow-xl p-6 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Answer</h2>
            <p className="mb-6">{answerText}</p>
            <button
              onClick={() => setShowAnswer(false)}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
