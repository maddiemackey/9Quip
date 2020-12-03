import React from "react";
import { Input, Label } from "reactstrap";
import "./index.css";
import Logo from "../../shared/Logo";

function JoinGameScreen() {
  return (
    <div className="join-game-container">
      <div className="join-game-item">
        <Logo />
      </div>
      <div>
        <Label>Name</Label>
        <Input placeholder="George" type="text" />
        <Label>Code</Label>
        <Input placeholder="1234" type="text" />
      </div>
    </div>
  );
}

export default JoinGameScreen;
