import React, { useEffect, useRef, useState } from "react";
import "../../App.css";

export default function Timer({ seconds }) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const secondsLeftRef = useRef(seconds);
  const interval = useRef();

  useEffect(() => {
    interval.current = setInterval(() => {
      if (secondsLeftRef.current === 0) {
        clearInterval(interval.current);
        return;
      }

      setSecondsLeft((currentSeconds) => {
        const nextSeconds = currentSeconds - 1;
        secondsLeftRef.current = nextSeconds;

        return nextSeconds;
      });
    }, [1000]);

    return () => {
      clearInterval(interval.current);
    };
  }, [seconds]);

  if (secondsLeft === 0) {
    return <div style={{ fontSize: "2em" }}>Time's Up!</div>;
  }

  return <div>{secondsLeft}</div>;
}
