import React from "react";
import firebase from "../../Firebase/firebase";

export const ClientGameContext = React.createContext();

// when this component is rendered, we need to setup the relevant firebase listeners...

// lets first listen to the game state and when when that changes, change the context value
// from there we can derive the other information

// need a way to join games

export class ClientGameContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // when null it means there is no game started yet
      mainGameState: null,
    };

    this.joinGame = this.joinGame.bind(this);
    this.startWatchingGame = this.startWatchingGame.bind(this);
  }

  handleGameStateChange() {}

  async joinGame(gameCode) {
    return new Promise((res, rej) => {
      const ref = firebase.database().ref("games");
      ref
        .orderByChild("gamecode")
        .equalTo(gameCode)
        .once("value", (snapshot) => {
          const snapshotValue = snapshot.val();
          if (!snapshotValue) {
            return res(null);
          }
          this.startWatchingGame(gameCode);
          return res(snapshotValue);
        });
    });
  }

  startWatchingGame(gameCode) {
    const ref = firebase.database().ref("games");
    ref
      .orderByChild("gamecode")
      .equalTo(gameCode)
      .on("value", (snapshot) => {
        const snapshotValue = snapshot.val();
        const gameId = Object.keys(snapshotValue)[0];
        const { gamestate } = snapshotValue[gameId];

        console.log("changed", snapshotValue[gameId]);
        // watch and update any other relevant game state here!!

        this.setState({
          mainGameState: gamestate,
        });
      });
  }

  render() {
    return (
      <ClientGameContext.Provider
        value={{
          ...this.state,
          joinGame: this.joinGame,
        }}
      >
        {this.props.children}
      </ClientGameContext.Provider>
    );
  }
}
