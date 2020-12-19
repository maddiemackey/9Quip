import React from 'react';
import '../../App.css';
import Timer from '../shared/timer';
import MaddiesLegoSpeechBubble from '../shared/MaddiesLegoSpeechBubble/index';
import PlayerList from '../shared/playerList';

export default class QuippingPage extends React.Component {
  render() {
    return (
      <div className="quipping-body">
        <div className="quipping-body-inner">
          <div className="gameInfo">
            <div>
              <Timer seconds={60} onTimerComplete={this.props.startVoting} />
            </div>
            <div style={{ width: '100%' }}>
              <MaddiesLegoSpeechBubble
                style={{ width: '40vw' }}
                bubbleText={'Answer the prompts on your phone!'}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '65vw',
              height: '80vh',
            }}
          >
            <PlayerList
              gameid={this.props.gameid}
              showOnQuip={true}
              round={this.props.round}
              onAllQuipsSubmitted={this.props.startVoting}
            />
          </div>
        </div>
      </div>
    );
  }
}
