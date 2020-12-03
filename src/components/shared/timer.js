import React from "react";
import '../../App.css';

/** Countdown tmier by https://medium.com/better-programming/building-a-simple-countdown-timer-with-react-4ca32763dda7 */

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { minutes: this.props.minutes, seconds: this.props.seconds};
  }

  componentDidMount() {
    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state;
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }))
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.myInterval);
          this.props.startVoting();
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59
          }))
        }
      }
    }, 1000);
  }

  render() {
    const { minutes, seconds } = this.state
    return (
      <div className="timer">{ minutes === 0 && seconds === 0
                    ? <h1 className="timer-text">Time's up!</h1>
                    : <h1 className="timer-text">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                }
      </div>
    );
  }
}