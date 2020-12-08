import React, { useContext, useRef, useState } from "react";
import { Button, Form, Input, Label } from "reactstrap";
import "./index.css";
import Logo from "../../shared/Logo";
import { ClientGameContext } from "../GameContext";

function JoinGameScreen() {
  const thing = useContext(ClientGameContext);
  const nameRef = useRef(null);
  const codeRef = useRef(null);
  const [searchingForGame, setSearchingForGame] = useState(false);

  function attemptJoinGame() {
    const nameInput = nameRef.current.value;
    const code = codeRef.current.value;


    if (!nameInput) {
      alert("A name is required.");
      return;
    }

    if (code.length < 4 || code.length > 4) {
      alert("Incorrect code.");
      return;
    }

    setSearchingForGame(true);

    thing.joinGame(code, nameInput).catch((rej) => {
      setSearchingForGame(false);
      alert(rej);
    });
  }

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
          <Form onSubmit={attemptJoinGame}>
            <Label>Name</Label>
            <Input innerRef={nameRef} placeholder="Alex" type="text"/>
            <Label>Code</Label>
            <Input
              placeholder="1234"
              type="text"
              innerRef={codeRef}
            />
            <div style={{display: "flex", justifyContent: "center"}}>
              <Button style={{marginTop: "10%", width: "100%"}} type="submit">Join</Button>
            </div>
          </Form>
          </>
        )}
      </div>
    </div>
  );
}

export default JoinGameScreen;
