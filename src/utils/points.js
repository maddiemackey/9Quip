import _ from 'lodash';
export default function calculatePoints(players, prompt) {
  const basePoints = 1000;
  const promptObj = prompt;
  const totalVoters = _.size(players) - prompt.players.length;

  const pointsSegment = basePoints / totalVoters;

  let pointsAssigned = {};
  promptObj.players.forEach((player) => {
    pointsAssigned[player.id] = player.votes
      ? Math.floor(pointsSegment * player.votes.length)
      : 0;
  });

  return pointsAssigned;
}
