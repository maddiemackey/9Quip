import React from "react";
import { Button } from "reactstrap";
import "../App.css";
import Team from "./shared/team";

export default class Footer extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className="App-footer">
        <Team />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: "77%",
            fontSize: "50%",
          }}
        >
          <p style={{ paddingLeft: "3%" }}>Developers: Maddie, Kory, Ben</p>
          <p style={{ paddingLeft: "5%" }}>Designer: Carlos</p>
          <p style={{ paddingLeft: "5%", paddingRight: "3%" }}>
            Music & fed cat: Josh
          </p>
        </div>
        {this.props.inGame && (
          <Button
            onClick={this.props.exit}
            style={{
              marginLeft: "auto",
              width: "15vw",
              maxWidth: "100px",
              marginBottom: "1%",
            }}
          >
            Exit
          </Button>
        )}
      </div>
    );
  }
}
