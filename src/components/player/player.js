import React from "react";
import "../../App.css";
import { GameState } from "../../utils/enum";
import Footer from "../footer";
import { ClientGameContext } from "./GameContext";
import JoinGame from "./JoinGame";
import Loading from "./Loading";
import Quipping from "./Quipping";
import Score from "./Score";
import Voting from "./Voting";

export default class Player extends React.Component {
  static contextType = ClientGameContext;

  constructor(props) {
    super(props);
    this.state = { text: "Player" };
  }

  getViewToRender() {
    switch (this.context.mainGameState) {
      case null:
        return <JoinGame />;
      case GameState.joining:
        return <Loading loadingText="Waiting on Players" />;
      case GameState.quipping:
        return <Quipping></Quipping>;
      case GameState.voting:
        return <Voting />;
      case GameState.scoreboard:
        return <Score />;
      default: {
        alert(
          "Booo, you got into an unknown state, just because it's a hackathon doesn't mean you can hack my project. Shame on you!"
        );
        console.log("shit!");
      }
    }
  }

  render() {
    return (
      <div>
        <div className="player-body">
          {this.getViewToRender()}
          {/* <Score /> */}
          {/* <Voting
            options={[
              {
                answer: "testing mctestface testing 123 different size answer",
              },
              { answer: "testing 2" },
              { answer: "testing 3" },
              { answer: "testing 4" },
              { answer: "testing 5" },
            ]}
          /> */}
          {/* <Quipping></Quipping> */}
          {/* <JoinGame></JoinGame> */}
          {/* <Loading loadingText="Waiting on Players"></Loading> */}
        </div>
        <Footer />
      </div>
    );
  }
}
