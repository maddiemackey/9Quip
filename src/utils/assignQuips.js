import getRandomInArray from './getRandomInArray';

const defaultPlayers = [
  'ben',
  'maddie',
  'josh',
  'jerry',
  'homer',
  'marge',
  'bart',
  'lisa',
  'maggie',
  'millhouse',
  'romeo',
  'romeo1',
  'romeo2',
  'romeo3',
  'romeo4',
  'romeo5',
];

const defaultPrompts = [
  'What two words would passengers never want to hear a pilot say?',
  "You would never go on a roller coaster called 'BLANK'",
  "The secret to a happy life is 'BLANK'",
  'If a winning coach gets Gatorade dumped on his head, what should get dumped on the losing coach?',
  'Name a candle scent designed specifically for Kim Kardashian.',
  "You should never give alcohol to 'BLANK'",
  "Everyone knows that monkeys hate 'BLANK'",
  "The biggest downside to living in Hell is 'BLANK'",
  "Jesus's REAL last words were 'BLANK'",
  "The worst thing for an evil witch to turn you into is 'BLANK'",
  "The Skittles flavor that just missed the cut was 'BLANK'",
  "On your wedding night, it would be horrible to find out that the person you married is 'BLANK'",
  'A name for a really bad Broadway musical.',
  'The first thing you would do after winning the lottery.',
  "What's actually causing global warming?",
  'A name for a brand of designer adult diapers.',
  "Name a TV drama that's about a vampire doctor.",
  'Something squirrels probably do when no one is looking.',
  'The crime you would commit if you could get away with it.',
  'Come up with a great title for the next awkward teen sex movie.',
  "What's the Mona Lisa smiling about?",
  'A terrible name for a cruise ship.',
  'Come up with a title for an adult version of any classic video game.',
  'The name of a font nobody would ever use.',
  'Something you should never put on an open wound.',
  "Scientists say erosion, but we all know the Grand Canyon was actually made by 'BLANK'",
  'The real reason the dinosaurs died.',
  "Come up with the name of a country that doesn't exist.",
  'The best way to keep warm on a cold winter night.',
  'The best thing about going to prison.',
];

export default function assignQuips(
  players = defaultPlayers,
  prompts = defaultPrompts
) {
  let upperLimit, lowerLimit;
  if (players.length > 16) upperLimit = 5;
  else if (players.length > 9) upperLimit = 4;
  else if (players.length > 4) upperLimit = 3;
  else upperLimit = 2;
  lowerLimit = upperLimit - 1;

  let playersReturned = [];
  let promptsReturned = [];
  let remainder = (players.length * 2) % upperLimit;
  let assigningLimit =
    remainder > 0
      ? Math.floor((players.length * 2) / upperLimit) + 1
      : Math.floor((players.length * 2) / upperLimit);
  let rounds = 2;
  let randPrompts = getRandomInArray(prompts, assigningLimit, rounds);

  randPrompts.forEach((round) => {
    let roundPlayersReturned = {};
    for (const player of players) {
      roundPlayersReturned[player] = [];
    }
    let roundPromptsReturned = [];

    let lowerLimitCount = remainder === 0 ? 0 : upperLimit - remainder;
    round.forEach((prompt) => {
      let playersToAssign = lowerLimitCount > 0 ? lowerLimit : upperLimit;
      let playersNotAssigned = { ...roundPlayersReturned };
      let promptToPush = { prompt: prompt, players: [] };
      while (playersToAssign > 0) {
        let playerIndex = Math.floor(
          Math.random() * Object.keys(playersNotAssigned).length
        );
        for (const value of Object.values(playersNotAssigned)) {
          if (value.length < 1) {
            playerIndex = Object.values(playersNotAssigned).indexOf(value);
            break;
          }
        }
        if (Object.values(playersNotAssigned)[playerIndex].length < 2) {
          roundPlayersReturned[
            Object.keys(playersNotAssigned)[playerIndex]
          ].push(prompt);
          promptToPush['players'].push({
            id: Object.keys(playersNotAssigned)[playerIndex],
            quip: '',
            votes: '',
          });
          delete playersNotAssigned[
            Object.keys(playersNotAssigned)[playerIndex]
          ];
          playersToAssign--;
        }
      }
      roundPromptsReturned.push(promptToPush);
      lowerLimitCount--;
    });
    promptsReturned.push(roundPromptsReturned);
    playersReturned.push(roundPlayersReturned);
  });

  return [playersReturned, promptsReturned];
}
