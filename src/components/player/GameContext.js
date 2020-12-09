import React from "react";
import firebase from "../../Firebase/firebase";
import _ from 'lodash';

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
      allQuipsSubmitted: false,
    };

    this.joinGame = this.joinGame.bind(this);
    this.submitQuip = this.submitQuip.bind(this);
    this.startWatchingGame = this.startWatchingGame.bind(this);
    this.exitGame = this.exitGame.bind(this);
    this.getPrompts = this.getPrompts.bind(this);
    this.startWatchingVoting = this.startWatchingVoting.bind(this);
    this.getQuipsForPrompt = this.getQuipsForPrompt.bind(this);
    this.vote = this.vote.bind(this);
  }

  handleGameStateChange() {}

  async joinGame(gameCode, nameInput) {
    return new Promise((res, rej) => {
      const ref = firebase.database().ref("games");
      ref
        .orderByChild("gamecode")
        .equalTo(gameCode)
        .once("value", (snapshot) => {
          const snapshotValue = snapshot.val();
          if (!snapshotValue) {
            return rej("Game does not exist.");
          }
          const gameId = Object.keys(snapshot.val())[0];

          // PLAYER LIMIT
          if (snapshotValue[gameId].players && _.size(snapshotValue[gameId].players) >= 25) {
            return rej("Player limit of 25 has been reached for this game.");
          }

          const gameRef = firebase
            .database()
            .ref(`games/${gameId}/headsAvailable`);

          gameRef.once("value", (snapshot) => {
            const snapshotValue = snapshot.val();

            if (!snapshotValue) {
              console.log("Could not assign a custom legohead :(");
            }

            const randomHeadIndex = Math.floor(Math.random() * _.size(snapshotValue));
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
              allQuipsSubmitted: false,
            });
            return res({newPlayer: newPlayer, gameId: gameId});
          });
        });
    }).then((res) => {
      // Store player in local storage to maintain session
      window.localStorage.setItem("quipGameId", res.gameId);
      window.localStorage.setItem("quipPlayerId", res.newPlayer.key);
      // Set in state
      this.setState({
        gameId: res.gameId,
        playerId: res.newPlayer.key,
        round: 0,
      });
      this.startWatchingGame(gameCode);
      this.startWatchingVoting(res.gameId);
    });
  }

  async exitGame() {
    return new Promise((res, rej) => {
      // Remove from DB
      // const ref = firebase
      //   .database()
      //   .ref(`games/${this.state.gameId}/players/${this.state.playerId}`);
      // ref.remove();

      // Remove from localStorage
      window.localStorage.clear();

      // Remove from state
      this.setState({
        mainGameState: null,
        gameId: null,
        playerId: null,
        round: null,
      });

      return res("Removed player");
    }).then(() => {window.location.reload();});
  }

  async getPrompts() {
    return new Promise((res, rej) => {
      const ref = firebase
        .database()
        .ref(
          `games/${this.state.gameId}/players/${this.state.playerId}/prompts`
        );
      ref.once("value", (snapshot) => {
        const prompts = snapshot.val();
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
      let roundRef = "";
      if (this.state.round === 0) {
        roundRef = firebase
          .database()
          .ref(
            `games/${this.state.gameId}/rounds/${this.state.round}/promptsReturned`
          );
      }
      roundRef.once("value", (snapshot) => {
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
                // if (this.state)
                return res(
                  `games/${this.state.gameId}/rounds/${this.state.round}/promptsReturned/${i}/players/${p}`
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
      if (promptIndex >= 1){
        console.log("All quips submitted!");
        const allQuipsSubmittedRef = firebase.database().ref(`games/${this.state.gameId}/players/${this.state.playerId}`);
        allQuipsSubmittedRef.update({allQuipsSubmitted: true});
      }
    });
  }

  async getQuipsForPrompt() {
    return new Promise((res, rej) => {
      // get round ID
      let roundRef = "";
        roundRef = firebase
          .database()
          .ref(
            `games/${this.state.gameId}/rounds/${this.state.round}/promptsReturned`
          );
      roundRef.once("value", (snapshot) => {
        const snapshotValue = snapshot.val();
        if (!snapshotValue) {
          return res(null);
        }
        let quips = [];
        let i = 0;
        snapshotValue.forEach((prompt) => {
          if (prompt.prompt === this.state.voteState) {
            let p = 0;
            prompt.players.forEach((player) => {
              quips.push({
                quip: player.quip,
                path: `games/${this.state.gameId}/rounds/${this.state.round}/promptsReturned/${i}/players/${p}`,
              });
              p++;
            });
          }
          i++;
        });

        return res(quips);
      });
    });
  }

  vote(path) {
    return new Promise((res, rej) => {
    const ref = firebase.database().ref(path);
    ref.once("value", (snapshot) => {
      const snapshotValue = snapshot.val();
      if (!snapshotValue) {
        return res(null);
      }
      let currentVotes = [];
      if (snapshotValue.votes) {
        currentVotes = snapshotValue.votes;
      }
      currentVotes.push(this.state.playerId);
      const voteRef = firebase.database().ref(path+"/votes");
      voteRef.update(currentVotes);
      return res("yis");
    });
    });
  }

  startWatchingVoting(gameId) {
    const ref = firebase.database().ref(`games/${gameId}/currentVote`);
    ref.on("value", (snapshot) => {
      const voteState = snapshot.val();
      this.setState({
        voteState: voteState,
      });
    });
  }

  startWatchingGame(gameCode) {
    return new Promise((res, rej) => {
    const ref = firebase.database().ref("games");

    ref
      .orderByChild("gamecode")
      .equalTo(gameCode)
      .on("value", (snapshot) => {
        const snapshotValue = snapshot.val();
        if (snapshotValue === null) {
          alert("Game ended");
          return rej("Game ended");
        }
        const gameId = Object.keys(snapshotValue)[0];
        const { gamestate, players } = snapshotValue[gameId];

        let playerScore = this.state.playerScore;
        let playerPosition = this.state.playerPosition;

        if (this.state.playerId) {
          const player = players[this.state.playerId];
          console.log("found player, setting score", player);
          playerScore = player.score;
          playerPosition = getPlayerPosition(players, this.state.playerId);
        }

        // watch and update any other relevant game state here!!
        this.setState({
          mainGameState: gamestate,
          playerScore,
          playerPosition,
        });
      });
    }).catch((rej) => {
      window.location.reload();
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
