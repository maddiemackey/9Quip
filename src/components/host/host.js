import React from "react";
import '../../App.css';
import StartPage from "./startPage";
import JoiningPage from "./joiningPage";
import QuippingPage from "./quippingPage";
import VotingPage from "./votingPage";
import ScorePage from "./scorePage";
import Footer from "../footer";
//import firebase, { getDbData } from "../Firebase/firebase";

export default class Host extends React.Component {
  constructor(props) {
    super(props);
    this.state = { gameState: null };
  }

  render() {
    const { gameState } = this.state;
    return (
      <div>
        { gameState === null && 
            <StartPage/>
        }
        { gameState === "JOINING" &&
            <JoiningPage/>
        }
        { gameState === "QUIPPING" &&
            <QuippingPage/>
        }
        { gameState === "VOTING" &&
            <VotingPage/>
        }
        { gameState === "SCORE" &&
            <ScorePage/>
        }
        <Footer></Footer>
      </div>
    );
  }
}
