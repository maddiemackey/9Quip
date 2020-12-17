import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "../../App.css";

export default function Timer({ seconds, onTimerComplete }) {
  return (
    <div className="timer-wrapper">
      <CountdownCircleTimer
        isPlaying
        duration={seconds}
        colors={[
          ["#0085CD", 0.33],
          ["#1FC02C", 0.33],
          ["#FFF200", 0.33],
          ["#D22C25", 0.33],
        ]}
        trailColor="rgba(114, 114, 114, 0)"
        size="120"
        onComplete={onTimerComplete}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
    </div>
  );
}
