import React from "react";
import '../../App.css';
import StartPage from "./startPage";
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
        <Footer></Footer>
      </div>
    );
  }
}
