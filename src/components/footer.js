import React from "react";
import { Button } from "reactstrap";
import "../App.css";
import Team from "./shared/team";

export default class Footer extends React.Component {
  render() {
    return (
      <div className="App-footer">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Team />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: "77%",
            fontSize: "50%",
          }}
        >
          <div style={{ paddingLeft: "3%" }}>Developers: Maddie, Kory, Ben</div>
          <div style={{ paddingLeft: "5%" }}>Designer: Carlos</div>
          <div style={{ paddingLeft: "5%", paddingRight: "3%" }}>
            Music & fed cat: Josh
          </div>
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
