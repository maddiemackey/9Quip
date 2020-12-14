import React from "react";
import { Button, Form, Input } from "reactstrap";
import "../../App.css";
import Logo from "../shared/Logo";
import MaddiesLegoSpeechBubble from "../shared/MaddiesLegoSpeechBubble";
import RightLegoSpeechBubble from "../shared/RightLegoSpeechBubble";
import firebase from "../../Firebase/firebase";
import { setFeedbackMessage } from "../shared/feedbackMessage";
import { MessageType } from "../../utils/enum";

export default class StartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { codeInput: "", currentPack: "", promptPackMessage: null };
  }

  updateCodeInputValue = (event) => {
    this.setState({ codeInput: event.target.value });
  };

  findPackFromCode = (e) => {
    e.preventDefault();
    const code = this.state.codeInput;
    new Promise((res, rej) => {
      if (!code) {
        return rej("Please enter a code");
      }
      const ref = firebase.database().ref(`promptPacks`);
      ref
        .orderByChild("code")
        .equalTo(code)
        .once("value", (snapshot) => {
          const promptPack = snapshot.val();
          if (!promptPack) {
            return rej({
              message: `Could not find prompt pack with code ${code}`,
              type: MessageType.ERROR,
            });
          }

          const packName = Object.keys(promptPack)[0];

          // Only allow selecting a pack if it is published (has >10 prompts)
          if (!promptPack[packName].published) {
            const morePromptsMessage = (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p>{packName} requires more prompts to be played.</p>
                <p style={{ marginTop: "-3vh" }}>
                  Go to the <a href={"/prompts?code=" + code}>prompts page</a>{" "}
                  to add prompts.
                </p>
              </div>
            );
            return rej({
              message: morePromptsMessage,
              type: MessageType.WARNING,
            });
          }

          this.setState({ currentPack: packName });
          const message = `Set prompt pack: ${packName}`;
          this.setState({
            promptPackMessage: setFeedbackMessage(message, MessageType.SUCCESS),
          });
          return res(message);
        });
    })
      .catch((rej) => {
        this.setState({
          promptPackMessage: setFeedbackMessage(rej.message, rej.type),
        });
      })
      .then((res) => {
        this.setState({ codeInput: "" });
      });
  };

  render() {
    return (
      <div className="start-page">
        <div className="teamName">
          <div>
            <Logo
              style={{ marginTop: "-10vh", width: "25vw", height: "auto" }}
            />
          </div>
        </div>
        <div className="startPrompt">
          <div className="startLeft">
            <MaddiesLegoSpeechBubble bubbleText={"Find a Prompt Pack"} />
            <Form
              onSubmit={this.findPackFromCode}
              style={{
                width: "21vw",
                minWidth: "300px",
                display: "flex",
              }}
            >
              <Input
                value={this.state.codeInput}
                placeholder="Enter Prompt Pack Code (1234)"
                type="text"
                onChange={this.updateCodeInputValue}
                style={{
                  fontSize: "70%",
                  borderRadius: "4px 0px 0px 4px",
                }}
              />
              <Button
                style={{
                  fontSize: "70%",
                  borderRadius: "0px 4px 4px 0px",
                }}
                type="submit"
              >
                Submit
              </Button>
            </Form>
            <div
              style={{ height: "4vh", marginBottom: "-4vh", marginTop: "1vh" }}
            >
              {this.state.promptPackMessage}
            </div>
          </div>
          <div className="startRight">
            <RightLegoSpeechBubble
              bubbleText={"Or start with Party Mode as default"}
            />
            <div className="prompt">
              <Button
                size="lg"
                style={{
                  width: "25vw",
                  minWidth: "300px",
                  height: "7vh",
                  fontSize: "150%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  this.props.createGame(this.state.currentPack);
                }}
                color="success"
              >
                START
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
