import React from "react";
import { Button, Form, Input } from "reactstrap";
import "../../App.css";
import Footer from "../footer";
import firebase from "../../Firebase/firebase";
import "firebase/database";
import "./prompts.css";

export default class Prompts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPack: "",
      prompts: [],
      promptInput: "",
      codeInput: "",
    };
  }

  submitPrompt = (e) => {
    e.preventDefault();
    const newPrompt = this.state.promptInput;

    return new Promise((res, rej) => {
      const ref = firebase
        .database()
        .ref(`promptPacks/${this.state.currentPack}`);
      ref.once("value", (snapshot) => {
        const snapshotValue = snapshot.val().prompts;
        if (!snapshotValue) {
          ref.set({ prompts: [newPrompt], code: snapshot.val().code });
          return res(`First prompt submitted: ${newPrompt}`);
        }
        let existingPrompts = snapshotValue;
        existingPrompts.push(newPrompt);
        const promptRef = firebase
          .database()
          .ref(`promptPacks/${this.state.currentPack}/prompts`);
        promptRef.update(existingPrompts);
        return res(`Prompt submitted: ${newPrompt}`);
      });
    }).then(() => {
      this.setState({ promptInput: "" });
    });
  };

  findPackFromCode = (e) => {
    e.preventDefault();
    const code = this.state.codeInput;
    new Promise((res, rej) => {
      const ref = firebase.database().ref(`promptPacks`);
      ref
        .orderByChild("code")
        .equalTo(code)
        .once("value", (snapshot) => {
          const promptPack = snapshot.val();
          if (!promptPack) {
            return rej("Could not find prompt pack with this code");
          }
          const packName = Object.keys(promptPack)[0];
          this.setState({ currentPack: packName });
          this.getPromptPackData(packName);
          return res("Found prompt pack");
        });
    })
      .catch((rej) => {
        alert(rej);
        this.setState({ codeInput: "" });
      })
      .then(() => {
        this.setState({ codeInput: "" });
      });
  };

  getPromptPackData = (selectedPack) => {
    const ref = firebase.database().ref(`promptPacks/${selectedPack}/prompts`);
    new Promise((res, rej) => {
      ref.on("value", (snapshot) => {
        const prompts = snapshot.val();
        if (!prompts) {
          return rej("No prompts available.");
        }
        this.setState({
          prompts: prompts.reverse(),
        });
        return res(prompts);
      });
    }).catch((rej) => {
      this.setState({ prompts: [] });
    });
  };

  removePrompt = (prompt, index) => {
    return new Promise((res, rej) => {
      const ref = firebase
        .database()
        .ref(`promptPacks/${this.state.currentPack}/prompts`);
      ref.once("value", (snapshot) => {
        const snapshotValue = snapshot.val();
        if (!snapshotValue) {
          return rej(null);
        }

        let existingPrompts = snapshotValue;
        existingPrompts.splice(existingPrompts.length - 1 - index, 1);

        ref.set(existingPrompts);
        this.setState({
          prompts: existingPrompts.reverse(),
        });
        return res(`Removed prompt: ${prompt}`);
      });
    });
  };

  updatePromptInputValue = (event) => {
    this.setState({ promptInput: event.target.value });
  };

  updateCodeInputValue = (event) => {
    this.setState({ codeInput: event.target.value });
  };

  render() {
    return (
      <div className="App-body">
        <h1>Prompt Packs</h1>
        <h4>Find pack by code</h4>
        <Form
          style={{ width: "15%", minWidth: "200px" }}
          onSubmit={this.findPackFromCode}
        >
          <div style={{ display: "flex" }}>
            <Input
              autoFocus
              value={this.state.codeInput}
              placeholder="code"
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
              Search
            </Button>
          </div>
        </Form>
        {this.state.currentPack && (
          <>
            <h1 style={{ marginTop: "2vh" }}>{this.state.currentPack}</h1>
            <h4>Submit a prompt to this pack</h4>
            <Form
              style={{ width: "90%", maxWidth: "700px" }}
              onSubmit={this.submitPrompt}
            >
              <div style={{ display: "flex" }}>
                <Input
                  value={this.state.promptInput}
                  placeholder="Enter new prompt here"
                  type="text"
                  autoFocus={true}
                  onChange={this.updatePromptInputValue}
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
              </div>
            </Form>
          </>
        )}
        {this.state.prompts.length !== 0 && (
          <div
            style={{
              height: "50vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h4 style={{ marginTop: "2vh" }}>Prompts in this pack:</h4>
            <table
              style={{
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                color: "#000000",
                fontSize: "70%",
                width: "90vw",
              }}
            >
              <tbody style={{ width: "90vw" }}>
                {this.state.prompts.map((prompt, index) => (
                  <tr className="prompt-row" key={index}>
                    <td className="prompt-cell">
                      {prompt}
                      <Button
                        close
                        className="remove-prompt"
                        onClick={() => {
                          this.removePrompt(prompt, index);
                        }}
                      >
                        x
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {this.state.currentPack && this.state.prompts.length === 0 && (
          <h2
            style={{
              height: "47.1vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFFFFF",
              color: "#000000",
              width: "90vw",
              marginTop: "2vh",
              textAlign: "center",
            }}
          >
            This pack is empty.
            <br />
            Submit some prompts to it!
          </h2>
        )}
        {!this.state.currentPack && (
          <div
            style={{
              height: "66.4vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "90vw",
              textAlign: "center",
            }}
          ></div>
        )}
        <Footer exit={this.exitGame} inGame={!!this.state.gameid} />
      </div>
    );
  }
}
