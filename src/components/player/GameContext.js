import React from 'react';
import firebase from '../../Firebase/firebase';
import 'firebase/database';
import _ from 'lodash';
import { GameState } from '../../utils/enum';

export const ClientGameContext = React.createContext();

// when this component is rendered, we need to setup the relevant firebase listeners...

// lets first listen to the game state and when when that changes, change the context value
// from there we can derive the other information

// need a way to join games

function getPlayerPosition(players, playerId) {
  const entries = Object.entries(players);

  return [...entries]
    .sort((a, b) => {
      return b[1].score - a[1].score;
    })
    .findIndex((v) => {
      return v[0] === playerId;
    });
}

export class ClientGameContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // when null it means there is no game started yet
      mainGameState: null,
      gameId: null,
      playerId: null,
      round: null,
      playerScore: 0,
      playerHead: null,
      playerPosition: null,
      voteState: null,
      allQuipsSubmitted: [false, false], //TODO: also hardcoded coz its 2am yeet
      votingRef: null,
      loading: true,
    };

    this.joinGame = this.joinGame.bind(this);
    this.submitQuip = this.submitQuip.bind(this);
    this.startWatchingGame = this.startWatchingGame.bind(this);
    this.exitGame = this.exitGame.bind(this);
    this.getPrompts = this.getPrompts.bind(this);
    this.startWatchingVoting = this.startWatchingVoting.bind(this);
    this.getQuipsForPrompt = this.getQuipsForPrompt.bind(this);
    this.vote = this.vote.bind(this);

    this.gameRef = firebase.database().ref('games');
  }

  componentDidMount() {
    const existingPlayerId = window.localStorage.getItem('quipPlayerId');
    const existingGameId = window.localStorage.getItem('quipGameId');
    if (existingPlayerId && existingGameId) {
      this.findReturningPlayer(existingPlayerId, existingGameId).catch(
        (rej) => {
          this.setState({ loading: false });
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  findReturningPlayer(existingPlayerId, existingGameId) {
    return new Promise((res, rej) => {
      // Must check for game id first, because if it doesn't exist it means the game has ended and the page should not try load old data
      const playerRef = firebase
        .database()
        .ref(`games/${existingGameId}/players/${existingPlayerId}`);

      const gameRef = firebase.database().ref(`games/${existingGameId}`);
      gameRef.once('value', (snapshot) => {
        const existingGame = snapshot.val();
        if (!existingGame) {
          return rej('Game does not exist');
        }
        if (existingGame) {
          const player = existingGame.players[existingPlayerId];
          if (!player) {
            return rej('Player does not exist');
          }
          if (player) {
            playerRef.update({ active: true });
            this.setState({
              mainGameState: existingGame.gamestate,
              gameId: existingGameId,
              playerId: existingPlayerId,
              round: existingGame.round,
              playerScore: player.score,
              playerHead: player.icon,
              allQuipsSubmitted: player.allQuipsSubmitted,
              loading: false,
            });
            // Get game code
            const gameCodeRef = firebase
              .database()
              .ref(`games/${existingGameId}/gamecode`);
            gameCodeRef.once('value', (snapshot) => {
              const gamecode = snapshot.val();
              if (!gamecode) {
                return rej('Game CODE does not exist (???)');
              }
              this.startWatchingGame(gamecode);
            });

            this.startWatchingVoting(existingGameId);
            return res('found player');
          }
        }
      });
    });
  }

  handleGameStateChange() {}

  async joinGame(gameCode, nameInput) {
    return new Promise((res, rej) => {
      const ref = firebase.database().ref('games');
      ref
        .orderByChild('gamecode')
        .equalTo(gameCode)
        .once('value', (snapshot) => {
          const snapshotValue = snapshot.val();
          if (!snapshotValue) {
            return rej({
              text: `Game with code ${gameCode} does not exist.`,
              nameError: false,
            });
          }
          const gameId = Object.keys(snapshot.val())[0];

          const players = snapshotValue[gameId].players;

          // PLAYER LIMIT
          if (players && _.size(players) >= 25) {
            return rej({
              text: 'Player limit of 25 has been reached for this game.',
              nameError: false,
            });
          }

          // CHECK DUPLICATE NAMES
          if (players) {
            for (const player of Object.entries(players)) {
              if (player[1].name === nameInput && player[1].active === true) {
                return rej({
                  text: `The name ${nameInput} is taken. Please enter a new one.`,
                  nameError: true,
                });
              } else if (
                player[1].name === nameInput &&
                player[1].active === false
              ) {
                // Player is returning from being inactive
                let playerId = player[0];
                let resolutionObj = {
                  newPlayer: { key: playerId },
                  gameId,
                  returning: true,
                };
                this.findReturningPlayer(playerId, gameId);
                return res(resolutionObj);
              }
            }
          }

          // SET LEGO HEAD
          const gameRef = firebase
            .database()
            .ref(`games/${gameId}/headsAvailable`);

          gameRef.once('value', (snapshot) => {
            const snapshotValue = snapshot.val();

            if (!snapshotValue) {
              console.log('Could not assign a custom legohead :(');
            }

            const randomHeadIndex = Math.floor(
              Math.random() * _.size(snapshotValue)
            );
            let head = snapshotValue[randomHeadIndex];
            snapshotValue.splice(randomHeadIndex, 1);

            this.setState({
              playerHead: head,
            });

            gameRef.set(snapshotValue);

            const ref = firebase.database().ref(`games/${gameId}/players`);
            const newPlayer = ref.push({
              name: nameInput,
              score: 0,
              icon: head,
              allQuipsSubmitted: [false, false],
              active: true,
              prompts: [[''], ['']], // TODO: this is hardcoded to match the round number (2)... should probs fix this in future
            });
            return res({ newPlayer: newPlayer, gameId: gameId });
          });
        });
    }).then((res) => {
      // Store player in local storage to maintain session
      window.localStorage.setItem('quipGameId', res.gameId);
      window.localStorage.setItem('quipPlayerId', res.newPlayer.key);

      if (!res.returning) {
        // Set in state
        this.setState({
          gameId: res.gameId,
          playerId: res.newPlayer.key,
          round: 0,
        });
        this.startWatchingGame(gameCode);
        this.startWatchingVoting(res.gameId);
      }
    });
  }

  async exitGame() {
    return new Promise((res, rej) => {
      const exitPlayerRef = firebase
        .database()
        .ref(`games/${this.state.gameId}/players/${this.state.playerId}`);
      if (
        this.state.mainGameState === GameState.joining ||
        (this.state.mainGameState === GameState.scoreboard &&
          this.state.round === 2) // TODO: hardcoded too lol
      ) {
        // If people are still joining the game or scoreboard is up, remove the player
        exitPlayerRef.remove();
      } else if (this.state.mainGameState) {
        // If the game has already started, just mark as INACTIVE
        exitPlayerRef.update({ active: false });
      }

      // Stop watching games / voting
      this.gameRef.off();
      this.state.votingRef && this.state.votingRef.off();

      // Remove from localStorage
      window.localStorage.removeItem('quipGameId');
      window.localStorage.removeItem('quipPlayerId');

      // Remove from state
      this.setState({
        mainGameState: null,
        gameId: null,
        playerId: null,
        round: null,
      });

      return res('Removed player');
    }).then(() => {
      window.location.reload();
    });
  }

  async getPrompts() {
    return new Promise((res, rej) => {
      const ref = firebase
        .database()
        .ref(
          `games/${this.state.gameId}/players/${this.state.playerId}/prompts/${this.state.round}`
        );
      ref.once('value', (snapshot) => {
        const prompts = snapshot.val();
        // console.log('PROMPTS:', prompts);
        if (!prompts || prompts[0] === '') {
          return rej('No prompts available for this player.');
        }
        this.setState({
          prompts: prompts,
        });
        return res(prompts);
      });
    });
  }

  async submitQuip(prompt, quip, promptIndex) {
    return new Promise((res, rej) => {
      // get round ID
      let roundRef = firebase
        .database()
        .ref(
          `games/${this.state.gameId}/rounds/0/promptsReturned/${this.state.round}`
        );
      roundRef.once('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        if (!snapshotValue) {
          return res(null);
        }
        // Get ROUND ID and add quip to the DB
        //const roundId = Object.keys(snapshot.val())[0];
        let i = 0;
        snapshotValue.forEach((snap) => {
          if (snap.prompt === prompt) {
            let p = 0;
            snap.players.forEach((player) => {
              if (player.id === this.state.playerId) {
                return res(
                  `games/${this.state.gameId}/rounds/0/promptsReturned/${this.state.round}/${i}/players/${p}`
                );
              }
              p++;
            });
          }
          i++;
        });
      });
    }).then((res) => {
      const quipRef = firebase.database().ref(res);
      quipRef.update({ quip: quip });
      if (promptIndex >= 1) {
        const allQuipsSubmittedRef = firebase
          .database()
          .ref(
            `games/${this.state.gameId}/players/${this.state.playerId}/allQuipsSubmitted/${this.state.round}`
          );
        allQuipsSubmittedRef.set(true);
      }
    });
  }

  async getQuipsForPrompt() {
    return new Promise((res, rej) => {
      // get round ID
      let roundRef = '';
      roundRef = firebase
        .database()
        .ref(
          `games/${this.state.gameId}/rounds/0/promptsReturned/${this.state.round}`
        );
      roundRef.once('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        if (!snapshotValue) {
          return res(null);
        }
        let quips = [];
        let i = 0;
        let canVote = true;
        snapshotValue.forEach((prompt) => {
          if (prompt.prompt === this.state.voteState) {
            let p = 0;
            prompt.players.forEach((player) => {
              quips.push({
                quip: player.quip,
                path: `games/${this.state.gameId}/rounds/0/promptsReturned/${this.state.round}/${i}/players/${p}`,
              });
              canVote = canVote && player.id !== this.state.playerId;
              p++;
            });
          }
          i++;
        });

        return res({ quips, canVote });
      });
    });
  }

  vote(path) {
    return new Promise((res, rej) => {
      const ref = firebase.database().ref(path);
      ref.once('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        if (!snapshotValue) {
          return res(null);
        }
        let currentVotes = [];
        if (snapshotValue.votes) {
          currentVotes = snapshotValue.votes;
        }
        currentVotes.push(this.state.playerId);
        const voteRef = firebase.database().ref(path + '/votes');
        voteRef.update(currentVotes);
        return res('yis');
      });
    });
  }

  startWatchingVoting(gameid) {
    this.setState({
      votingRef: firebase.database().ref(`games/${gameid}/currentVote`),
    });
    this.state.votingRef.on('value', (snapshot) => {
      const voteState = snapshot.val();
      this.setState({
        voteState: voteState,
      });
    });
  }

  startWatchingGame(gameCode) {
    return new Promise((res, rej) => {
      this.gameRef
        .orderByChild('gamecode')
        .equalTo(gameCode)
        .on('value', (snapshot) => {
          const snapshotValue = snapshot.val();
          if (snapshotValue === null) {
            return rej('Game ended');
          }
          const gameId = Object.keys(snapshotValue)[0];
          const { gamestate, players, round } = snapshotValue[gameId];

          let playerScore = this.state.playerScore;
          let playerPosition = this.state.playerPosition;

          if (this.state.playerId) {
            const player = players[this.state.playerId];
            // console.log("found player, setting score", player);
            playerScore = player.score;
            playerPosition = getPlayerPosition(players, this.state.playerId);
          }

          // watch and update any other relevant game state here!!
          this.setState({
            mainGameState: gamestate,
            playerScore,
            playerPosition,
            round,
          });
        });
    }).catch((rej) => {
      this.gameRef.off();
      if (this.state.mainGameState !== GameState.scoreboard) {
        this.exitGame();
      }
    });
  }

  render() {
    return (
      <ClientGameContext.Provider
        value={{
          ...this.state,
          startWatchingGame: this.startWatchingGame,
          joinGame: this.joinGame,
          submitQuip: this.submitQuip,
          exitGame: this.exitGame,
          getPrompts: this.getPrompts,
          startWatchingVoting: this.startWatchingVoting,
          getQuipsForPrompt: this.getQuipsForPrompt,
          vote: this.vote,
        }}
      >
        {this.props.children}
      </ClientGameContext.Provider>
    );
  }
}
