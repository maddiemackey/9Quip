import React, { useEffect, useRef, useState } from "react";
import "../../App.css";

export default function Timer({ seconds, onTimerComplete }) {
  const [secondsToDisplay, setSecondsToDisplay] = useState(seconds);
  const secondsRef = useRef(seconds);
  const interval = useRef();

  useEffect(() => {
    secondsRef.current = seconds;

    interval.current = setInterval(() => {
      if (secondsRef.current === 0) {
        clearInterval(interval.current);
        onTimerComplete();
      } else {
        secondsRef.current = secondsRef.current - 1;
        setSecondsToDisplay(secondsRef.current);
      }
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, [seconds, onTimerComplete]);

  if (secondsToDisplay === 0) {
    return <div style={{ fontSize: "100%" }}>Time's Up!</div>;
  }

  return <div>{secondsToDisplay}</div>;
}
