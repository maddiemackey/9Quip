import React from 'react';
import { Button } from 'reactstrap';
import '../../App.css';
import LogoWOTeam from '../shared/logowoteam';
import PlayerList from '../shared/playerList';
import MaddiesLegoSpeechBubble from '../shared/MaddiesLegoSpeechBubble/index';

export default class JoiningPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="joining-body">
        <div className="gameInfo">
          <div>
            <LogoWOTeam />
          </div>
          <div>
            <MaddiesLegoSpeechBubble
              style={{ width: '30vw' }}
              bubbleText={'Enter this code to join: ' + this.props.gamecode}
            />
          </div>
          <Button
            style={{
              maxWidth: '50%',
              fontSize: '100%',
              marginTop: '1vh',
            }}
            onClick={this.props.startGame}
            color="success"
          >
            Start Game
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '40vw',
            height: '80vh',
            marginLeft: '5vw',
          }}
        >
          <PlayerList gameid={this.props.gameid} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          ></div>
        </div>
      </div>
    );
  }
}
