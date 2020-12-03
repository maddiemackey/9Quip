import "./App.css";
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Host from "./components/host/host";
import Player from "./components/player/player";
import Header from "./components/header";
import { ClientGameContextProvider } from "./components/player/GameContext";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Header />
        </header>
        <main>
          <ClientGameContextProvider>
            <Switch>
              <Route exact path="/" component={Player} />
              <Route path="/host" component={Host} />
            </Switch>
          </ClientGameContextProvider>
        </main>
      </div>
    );
  }
}

export default App;
