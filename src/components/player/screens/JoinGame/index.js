import React from "react";
import "./index.css";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
} from "reactstrap";
//import firebase, { getDbData } from "../Firebase/firebase";

function JoinGameScreen() {
  return (
    <div className="container">
      <div>LOGO HERE</div>
      <div>9Quip</div>
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
