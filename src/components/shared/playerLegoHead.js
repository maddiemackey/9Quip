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
      head: "",
    }
  }

  componentDidMount() {
    let headContent;

    switch(this.props.headName) {
      case("baseball"):
        headContent = baseball;
        break;
      case("beanie"):
        headContent = beanie;
        break;
      case("captain"):
        headContent = captain;
        break;
      case("chef"):
        headContent = chef;
        break;
      case("cop"):
        headContent = cop;
        break;
      case("cowboy"):
        headContent = cowboy;
        break;
      case("drink"):
        headContent = drink;
        break;
      case("firefighter"):
        headContent = firefighter;
        break;
      case("flower"):
        headContent = flower;
        break;
      case("glasses"):
        headContent = glasses;
        break;
      case("grad"):
        headContent = grad;
        break;
      case("hard"):
        headContent = hard;
        break;
      case("headphones"):
        headContent = headphones;
        break;
      case("jester"):
        headContent = jester;
        break;
      case("lego"):
        headContent = lego;
        break;
      case("paper"):
        headContent = paper;
          break;
      case("party"):
        headContent = party;
          break;
      case("penguin"):
        headContent = penguin;
          break;
      case("pirate"):
        headContent = pirate;
          break;
      case("straw"):
        headContent = straw;
          break;
      case("top"):
        headContent = top;
          break;
      case("tp"):
        headContent = tp;
          break;
      case("traffic"):
        headContent = traffic;
          break;
      case("viking"):
        headContent = viking;
          break;
      case("wizard"):
        headContent = wizard;
          break;
    }

    this.setState({
      head: headContent
    });
  }

  render() {

    return (
      <div className="playerLegoHead"><img className={this.props.classThing} src={this.state.head} alt={`${this.props.playerName} Head`}/></div>
    );
  }
}
