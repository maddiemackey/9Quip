import React, { useContext, useEffect, useState } from 'react';
import LegoSpeechBubble from '../LegoSpeechBubble';
import './index.css';
import { ClientGameContext } from '../GameContext';

function Option({ key, text, colour, onClick, disabled }) {
  return (
    <div
      key={key}
      className="voting-option"
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      <div
        style={{
          backgroundColor: colour,
        }}
        className="voting-option-colour"
      ></div>
      <div className="voting-option-text">{text ? text : 'no answer'}</div>
      {disabled && <div className="disabled-cover"></div>}
    </div>
  );
}

function getColour(index) {
  switch (index) {
    case 0:
      return '#D22C25';
    case 1:
      return '#0085CD';
    case 2:
      return '#1FC02C';
    case 3:
      return '#FFF200';
    case 4:
      return '#BD008B';
    default: {
      console.log('Unknown index only meant to be 5 ');
      return 'black';
    }
  }
}

function Voting() {
  const thing = useContext(ClientGameContext);
  const [quips, setQuips] = useState([]);
  const [voted, setVoted] = useState(false);
  const [canVote, setCanVote] = useState(true);
  const [speech, updateSpeechBubble] = useState('Loading...');

  useEffect(() => {
    setVoted(false);
    thing.getQuipsForPrompt().then((resQ) => {
      if (resQ === null) {
        alert('Failed to see voting, sorry :(');
      } else {
        setQuips(resQ.quips);
        setCanVote(resQ.canVote);
        if (!resQ.canVote) {
          updateSpeechBubble('Please wait while others vote.');
        } else {
          updateSpeechBubble(whatToSay(resQ.quips));
        }
      }
    });
    // eslint-disable-next-line
  }, [thing.voteState]);

  function whatToSay(resQ) {
    if (resQ.length === 0) {
      return 'Hahaha!';
    } else if (!voted) {
      return thing.voteState;
    }
    return "You're so funny you broke me!";
  }

  return (
    <div className="voting-container">
      <div className="voting-speech-bubble">
        {/* TODO: replace with quip from gamestate  */}
        <LegoSpeechBubble bubbleText={speech}></LegoSpeechBubble>
      </div>
      {!voted && canVote && (
        <div className="voting-options-container">
          {quips &&
            quips.map((quip, i) => {
              return (
                <Option
                  key={`option-${i}`}
                  text={quip.quip}
                  disabled={quip.quip === ''}
                  colour={getColour(i)}
                  onClick={() => {
                    thing.vote(quip.path);
                    setVoted(true);
                    updateSpeechBubble('Please wait while others vote.');
                  }}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Voting;
