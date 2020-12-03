import React from "react";
import '../../App.css';
import baseball from "../../assets/lego-heads/baseball.png";
import beanie from "../../assets/lego-heads/beanie.png";
import captain from "../../assets/lego-heads/captain.png";
import chef from "../../assets/lego-heads/chef.png";
import cop from "../../assets/lego-heads/cop.png";
import cowboy from "../../assets/lego-heads/cowboy.png";
import drink from "../../assets/lego-heads/drink.png";
import firefighter from "../../assets/lego-heads/firefighter.png";
import flower from "../../assets/lego-heads/flower.png";
import glasses from "../../assets/lego-heads/glasses.png";
import grad from "../../assets/lego-heads/grad.png";
import hard from "../../assets/lego-heads/hard.png";
import headphones from "../../assets/lego-heads/headphones.png";
import jester from "../../assets/lego-heads/jester.png";
import lego from "../../assets/lego-heads/lego.png";
import paper from "../../assets/lego-heads/paper.png";
import party from "../../assets/lego-heads/party.png";
import penguin from "../../assets/lego-heads/penguin.png";
import pirate from "../../assets/lego-heads/pirate.png";
import straw from "../../assets/lego-heads/straw.png";
import top from "../../assets/lego-heads/top.png";
import tp from "../../assets/lego-heads/tp.png";
import traffic from "../../assets/lego-heads/traffic.png";
import viking from "../../assets/lego-heads/viking.png";
import wizard from "../../assets/lego-heads/wizard.png";

export default class PlayerLegoHead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      head: ""
    }
  }

  componentDidMount() {
    let head;
    switch(this.props.headName) {
      case("baseball"):
        head = baseball;break;
      case("beanie"):
        head = beanie;break;
      case("captain"):
        head = captain;break;
      case("chef"):
        head = chef;break;
      case("cop"):
        head = cop;break;
      case("cowboy"):
        head = cowboy;break;
      case("drink"):
        head = drink;break;
      case("firefighter"):
        head = firefighter;break;
      case("flower"):
        head = flower;break;
      case("glasses"):
        head = glasses;break;
      case("grad"):
        head = grad;break;
      case("hard"):
        head = hard;break;
      case("headphones"):
        head = headphones;break;
      case("jester"):
        head = jester;break;
      case("lego"):
        head = lego;break;
      case("paper"):
        head = paper;break;
      case("party"):
        head = party;break;
      case("penguin"):
        head = penguin;break;
      case("pirate"):
        head = pirate;break;
      case("straw"):
        head = straw;break;
      case("top"):
        head = top;break;
      case("tp"):
        head = tp;break;
      case("traffic"):
        head = traffic;break;
      case("viking"):
        head = viking;break;
      case("wizard"):
        head = wizard;break;
    }

    this.setState({
      head: head
    });
  }

  render() {
    return (
      <div className="playerLegoHead"><img className="playerLegoHeadImg" src={this.state.head} alt={`${this.props.playerName} Head`}/></div>
    );
  }
}
