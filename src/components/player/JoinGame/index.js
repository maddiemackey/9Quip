import React, { useContext, useRef, useState } from "react";
import { Input, Label } from "reactstrap";
import "./index.css";
import Logo from "../../shared/Logo";
import { ClientGameContext } from "../GameContext";

function JoinGameScreen() {
  const thing = useContext(ClientGameContext);
  const nameRef = useRef(null);
  const [searchingForGame, setSearchingForGame] = useState(false);

  const handleCodeOnChange = (event) => {
    const code = event.target.value;
    const nameInput = nameRef.current.value;

    if (!nameInput) {
      console.log("A name is required");
      return;
    }

    if (code.length < 4) {
      // console.log("code is not long enough");
      return;
    }

    setSearchingForGame(true);

    thing.joinGame(code, nameInput).catch((rej) => {
      setSearchingForGame(false);
      alert(rej);
    });
  };

  return (
    <div className="join-game-container">
      <div className="join-game-item">
        <Logo />
      </div>
      <div>
        {searchingForGame ? (
          "Joining..."
        ) : (
          <>
            <Label>Name</Label>
            <Input innerRef={nameRef} placeholder="George" type="text" />
            <Label>Code</Label>
            <Input
              placeholder="1234"
              type="text"
              onChange={handleCodeOnChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default JoinGameScreen;
