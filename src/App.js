import "./App.css";
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Host from "./components/host/host";
import Player from "./components/player/player";
import Header from "./components/header";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Header />
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={Player} />
            <Route path="/host" component={Host} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
