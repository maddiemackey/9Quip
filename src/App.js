import "./App.css";
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./components/host/homePage";
import Player from "./components/player/player";
import JoinGameScreen from "./components/player/screens/JoinGame";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <p>This is A HEADER</p>
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={Player} />
            <Route exact path="/join-game" component={JoinGameScreen} />
            <Route path="/host" component={HomePage} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
