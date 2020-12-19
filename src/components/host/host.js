import React from 'react';
import '../../App.css';
import StartPage from './startPage';
import JoiningPage from './joiningPage';
import QuippingPage from './quippingPage';
import VotingPage from './votingPage';
import ScorePage from './scorePage';
import Footer from '../footer';
import { GameState } from '../../utils/enum';
import firebase from '../../Firebase/firebase';
import 'firebase/database';
import assignQuips from '../../utils/assignQuips';
import { legoHeads } from '../../utils/legoHeads';
import MusicPlayer from '../shared/musicPlayer';
import AudioIcon from '../shared/audioIcon';
import { generateGamecode } from '../../utils/generateGameCode';
import _ from 'lodash';
import { Spinner } from 'reactstrap';

export default class Host extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gamestate: null,
      gamecode: null,
      gameid: null,
      muted: false,
      promptPack: 'Party',
      round: 0,
      loading: true,
    };
  }

  componentDidMount() {
    const existingGameId = window.localStorage.getItem('quipHostedGame');
    if (existingGameId) {
      // Set up necessary state for existing game
      const gameRef = firebase.database().ref(`games/${existingGameId}`);
      gameRef.once('value', (snapshot) => {
        const existingGame = snapshot.val();
        if (!existingGame) {
          this.setState({
            loading: false,
          });
          return;
        }
        const promptPackId = existingGame.promptPack;
        // Get prompts pack name for state from id in game
        const promptPacksRef = firebase.database().ref(`promptPacks`);
        promptPacksRef
          .orderByChild('code')
          .equalTo(promptPackId)
          .once('value', (snapshot) => {
            let promptPack = snapshot.val();
            if (!promptPack) {
              alert('Prompt Pack does not exist!');
              return;
            }
            const packName = Object.keys(promptPack)[0];

            this.setState({
              gameid: existingGameId,
              gamestate: existingGame.gamestate,
              gamecode: existingGame.gamecode,
              promptPack: packName,
              round: existingGame.round,
              loading: false,
            });
          });
      });
    } else {
      this.setState({
        loading: false,
      });
    }
    this.setState({
      muted: window.localStorage.getItem('quipMuted') === 'true',
    });
  }

  createGame = (currentPack) => {
    const ref = firebase.database().ref('games');
    let gamecode = generateGamecode(4);
    const gamesRef = firebase.database().ref('games');
    gamesRef.once('value', (snapshot) => {
      const games = snapshot.val();
      if (games) {
        // Get game code that doesn't already exist
        let flag = false;
        const iterations = _.size(games);
        while (!flag) {
          let i = 0;
          // eslint-disable-next-line
          for (const [key, value] of Object.entries(games)) {
            if (value.gamecode === gamecode) {
              break;
            }
            i++;
            // If it makes it through all the games and none match, break out of while loop.
            if (i === iterations) {
              flag = true;
            }
          }
          gamecode = generateGamecode(4);
        }
      }
      return new Promise((res, rej) => {
        const newGameRef = ref.push({
          gamecode: gamecode,
          gamestate: GameState.joining,
          headsAvailable: legoHeads,
          players: '',
          promptPack: currentPack ? currentPack : '3410',
          round: 0,
        });
        return res(newGameRef);
      }).then((newGameRef) => {
        const gameid = newGameRef.key;
        this.setState({
          gamestate: 'JOINING',
          gamecode,
          gameid,
          promptPack: currentPack ? currentPack : 'Party',
        });
        window.localStorage.setItem('quipHostedGame', gameid);
      });
    });
  };

  startGame = () => {
    const ref = firebase.database().ref('/');
    new Promise((res, rej) => {
      ref.once('value', (snapshot) => {
        let db = snapshot.val();
        if (db.promptPacks[this.state.promptPack].prompts) {
          if (db.games[this.state.gameid].players) {
            let players = db.games[this.state.gameid].players;
            if (Object.keys(players).length >= 4) {
              let [playersReturned, promptsReturned] = assignQuips(
                Object.keys(players),
                db.promptPacks[this.state.promptPack].prompts
              );
              for (const p of Object.keys(players)) {
                let roundData = [];
                playersReturned.forEach((round) => {
                  for (const q of Object.keys(round)) {
                    if (p === q) {
                      roundData = [...roundData, round[q]];
                      db.games[this.state.gameid].players[
                        p
                      ].prompts = roundData;
                    }
                  }
                });
              }

              db.games[this.state.gameid].rounds = [{ promptsReturned }];
              db.games[this.state.gameid].gamestate = GameState.quipping;
              return res(db);
            } else {
              return rej('Need more players to start');
            }
          } else {
            return rej('Need more players to start');
          }
        }
      });
    })
      .then((res) => {
        ref.update(res);
        this.setState({ gamestate: 'QUIPPING' });
      })
      .catch((err) => {
        alert(err);
      });
  };

  startVoting = () => {
    const ref = firebase.database().ref(`games/${this.state.gameid}`);
    ref.update({ gamestate: GameState.voting });
    this.setState({ gamestate: 'VOTING' });
  };

  nextRound = () => {
    const ref = firebase.database().ref(`games/${this.state.gameid}`);
    ref.update({ gamestate: GameState.quipping });
    this.setState({ gamestate: 'QUIPPING' });
  };

  startScoring = () => {
    const ref = firebase.database().ref(`games/${this.state.gameid}`);
    ref.update({
      gamestate: GameState.scoreboard,
      round: this.state.round + 1,
    });
    this.setState({ round: this.state.round + 1, gamestate: 'SCOREBOARD' });
  };

  exitGame = () => {
    return new Promise((res, rej) => {
      // Remove from DB
      const ref = firebase.database().ref(`games/${this.state.gameid}/`);
      ref.remove();

      // Remove from localStorage
      window.localStorage.removeItem('quipHostedGame');

      // Remove from state
      this.setState({
        gamestate: null,
        gameid: null,
        gamecode: null,
      });

      return res('Ended game');
    }).then(() => {
      window.location.reload();
    });
  };

  toggleAudio = () => {
    window.localStorage.setItem('quipMuted', !this.state.muted);
    this.setState({ muted: !this.state.muted });
  };

  render() {
    const { gamestate } = this.state;
    // console.log("gamecode: ", this.state.gamecode);
    // console.log('gameid: ', this.state.gameid);
    // console.log("gamestate: ", this.state.gamestate);
    // const tempId = window.localStorage.getItem('quipHostedGame');
    // console.log('tempId: ', tempId);

    return (
      <div>
        {!this.state.loading && (
          <div>
            <AudioIcon
              toggleAudio={this.toggleAudio}
              gameState={gamestate}
              muted={this.state.muted}
            />
            {this.state.gamecode && this.state.gamestate !== GameState.joining && (
              <div className="spectate-gamecode">
                <div>Join as a spectator!</div>
                <div style={{ marginTop: '-4%' }}>{this.state.gamecode}</div>
              </div>
            )}
            {gamestate !== null && gamestate !== GameState.quipping && (
              <MusicPlayer
                src={'music/cropped-upbeat-music.m4a'}
                muted={this.state.muted}
              />
            )}
            {gamestate === GameState.quipping && (
              <MusicPlayer
                src={'music/background-music.mp3'}
                muted={this.state.muted}
              />
            )}
            {gamestate === null && <StartPage createGame={this.createGame} />}
            {gamestate === GameState.joining && (
              <JoiningPage
                gamecode={this.state.gamecode}
                startGame={this.startGame}
                gameid={this.state.gameid}
              />
            )}
            {gamestate === GameState.quipping && (
              <QuippingPage
                startVoting={this.startVoting}
                gameid={this.state.gameid}
                round={this.state.round}
              />
            )}
            {gamestate === GameState.voting && (
              <VotingPage
                gameId={this.state.gameid}
                round={this.state.round}
                startScoring={this.startScoring}
              />
            )}
            {gamestate === GameState.scoreboard && (
              <ScorePage
                gameId={this.state.gameid}
                endGame={this.exitGame}
                nextRound={this.nextRound}
                gameEnded={this.state.round === 2}
                round={this.state.round}
              />
            )}
          </div>
        )}
        {this.state.loading && (
          <Spinner color="light" style={{ width: '75px', height: '75px' }} />
        )}
        <Footer exit={this.exitGame} inGame={!!this.state.gameid} />
      </div>
    );
  }
}
