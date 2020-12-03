import React from "react";
import '../../App.css';
import StartPage from "./startPage";
import JoiningPage from "./joiningPage";
import QuippingPage from "./quippingPage";
import VotingPage from "./votingPage";
import ScorePage from "./scorePage";
import Footer from "../footer";
import { GameState } from "../../utils/enum";
import firebase from "../../Firebase/firebase";
import assignQuips from "../../utils/assignQuips";

export default class Host extends React.Component {
  constructor(props) {
    super(props);
    this.state = { gamestate: "VOTING", gamecode: null, gameid: null};
  }

  createGame = () => {
    const ref = firebase.database().ref("games");
    const gamecode = this.generateGamecode(4);
    const newGameRef = ref.push({gamecode: gamecode, gamestate: GameState.joining});
    const gameid = newGameRef.key;
    this.setState({ gamestate: "JOINING", gamecode, gameid });
    window.localStorage.setItem("quipHostedGame", gameid);
  }

  startGame = () => {
    const refPrompts = firebase.database().ref("prompts/normal");
    refPrompts.on("value", snapshot => {
      let prompts = snapshot.val();
      if (prompts) {
        const refPlayers = firebase.database().ref(`games/${this.state.gameid}/players`);
        refPlayers.on("value", snapshot => {
            let players = snapshot.val();
            if (players) {
                let [playersReturned, promptsReturned] = assignQuips(Object.keys(players), prompts);
                const refRounds = firebase.database().ref(`games/${this.state.gameid}/rounds`);
                refRounds.push(promptsReturned);
                const ref = firebase.database().ref(`games/${this.state.gameid}`);
                const newGameRef = ref.update({gamestate: GameState.quipping});
                this.setState({ gamestate: "QUIPPING" });
            }
        });
      }
    });
  }

  /** https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript */
  generateGamecode = (length) => {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 startVoting = () => {
  const ref = firebase.database().ref(`games/${this.state.gameid}`);
  const newGameRef = ref.update({gamestate: GameState.voting});
  this.setState({ gamestate: "VOTING"});
}

  render() {
    const { gamestate } = this.state;
    console.log("gamecode: ", this.state.gamecode);
    console.log("gameid: ", this.state.gameid);
    console.log("gamestate: ", this.state.gamestate);

    return (
      <div>
        { gamestate === null &&
            <StartPage createGame={this.createGame}/>
        }
        { gamestate === GameState.joining &&
            <JoiningPage gamecode={this.state.gamecode} startGame={this.startGame}/>
        }
        { gamestate === GameState.quipping &&
            <QuippingPage startVoting={this.startVoting}/>
        }
        { gamestate === GameState.voting &&
            <VotingPage/>
        }
        { gamestate === GameState.scoreboard &&
            <ScorePage/>
        }
        <Footer></Footer>
      </div>
    );
  }
}
