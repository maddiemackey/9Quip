import _ from 'lodash';
export default function calculatePoints(players, prompt) {
  const basePoints = 1000;
  let votesCount = 0;
  const promptObj = prompt;
  const totalVoters = _.size(players) - prompt.players.length;
  for (const player of promptObj.players) {
    if (player.votes) votesCount += player.votes.length;
  }
  const pointsSegment = (basePoints / totalVoters) * votesCount;

  let pointsAssigned = {};
  promptObj.players.forEach((player) => {
    pointsAssigned[player.id] = player.votes ? Math.floor(pointsSegment) : 0;
  });

  return pointsAssigned;
}
