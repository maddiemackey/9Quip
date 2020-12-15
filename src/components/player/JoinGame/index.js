import React, { useContext, useRef, useState } from "react";
import { Button, Form, Input, Label, Spinner } from "reactstrap";
import "./index.css";
import { ClientGameContext } from "../GameContext";
import LogoWOTeam from "../../shared/logowoteam";
import { setFeedbackMessage } from "../../shared/feedbackMessage";
import { MessageType } from "../../../utils/enum";

function JoinGameScreen() {
  const thing = useContext(ClientGameContext);
  const nameRef = useRef(null);
  const codeRef = useRef(null);
  const [searchingForGame, setSearchingForGame] = useState(false);
  const [joinMessage, setJoinMessage] = useState(null);

  function attemptJoinGame(e) {
    e.preventDefault();
    const nameInput = nameRef.current.value;
    const code = codeRef.current.value;

    if (!nameInput) {
      setJoinMessage(
        setFeedbackMessage("A name is required.", MessageType.ERROR)
      );
      return;
    }

    if (code.length === 0) {
      setJoinMessage(setFeedbackMessage("Code required.", MessageType.ERROR));
      return;
    }
    if (code.length < 4 || code.length > 4) {
      setJoinMessage(setFeedbackMessage("Incorrect code.", MessageType.ERROR));
      return;
    }

    setSearchingForGame(true);

    thing.joinGame(code, nameInput).catch((rej) => {
      setSearchingForGame(false);
      setJoinMessage(setFeedbackMessage(rej, MessageType.ERROR));
    });
  }

  return (
    <div className="join-game-container">
      <div className="join-game-item">
        <LogoWOTeam />
      </div>
      <div>
        {searchingForGame ? (
          <div
            style={{
              height: document.getElementById("join-form")
                ? document.getElementById("join-form").clientHeight
                : "30vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Spinner style={{ height: "4rem", width: "4rem" }} />
          </div>
        ) : (
          <div id="join-form">
            <Form onSubmit={attemptJoinGame}>
              <Label style={{ marginBottom: "1vh" }}>Name</Label>
              <Input
                style={{ marginTop: "-1vh" }}
                innerRef={nameRef}
                placeholder="Alex"
                type="text"
                autoFocus={true}
              />
              <Label style={{ marginBottom: "1vh" }}>Code</Label>
              <Input
                style={{ marginTop: "-1vh" }}
                placeholder="1234"
                type="text"
                innerRef={codeRef}
              />
              <div
                style={{
                  height: "1vh",
                  fontSize: "80%",
                  textAlign: "center",
                  margin: "1%",
                }}
              >
                {joinMessage}
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  style={{ marginTop: "10%", width: "100%" }}
                  type="submit"
                >
                  Join
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}

export default JoinGameScreen;
