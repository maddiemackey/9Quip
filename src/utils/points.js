export default function calculatePoints(players, prompt) {
    const basePoints = 1000;
    let votesCount = 0;
    const promptObj = prompt;
    for (const player of promptObj.players) {
        if (player.votes) votesCount += player.votes.length
    }
    const pointsSegment = basePoints/votesCount;

    let pointsAssigned = {};
    promptObj.players.forEach(player => {
        pointsAssigned[player.id] = player.votes ? Math.floor(player.votes.length*pointsSegment) : 0;
    })

    return pointsAssigned;
}