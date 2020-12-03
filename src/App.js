import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Host from './components/host/host';
import Player from './components/player/player';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <p>
            This is A HEADER
          </p>
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
