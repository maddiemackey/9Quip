import React, { useContext } from 'react';

import './index.css';

import { ClientGameContext } from '../GameContext';
import PlayerLegoHead from '../../shared/playerLegoHead';
import { ordinal } from '../../../utils/ordinal';

//WIP
// TODO: break out into it's own component
function Avatar({ iconName }) {
  return <PlayerLegoHead classThing={'user-avatar'} headName={iconName} />;
}

function Score() {
  const context = useContext(ClientGameContext);

  return (
    <div className="score-container">
      <div className="score-position-container">
        <div className="score-bubble">
          {context.playerPosition || context.playerPosition === 0
            ? ordinal(context.playerPosition)
            : '?'}
        </div>
      </div>
      <div>
        <Avatar iconName={context.playerHead} />
      </div>
      <div>
        <span className="score-user-points">{context.playerScore} </span>pts
      </div>
    </div>
  );
}

export default Score;
