import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Spinner,
} from "reactstrap";
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
      packs: [],
      prompts: [],
      dropdownOpen: false,
      promptInput: "",
      loading: true,
    };
  }

  componentDidMount() {
    this.getPacks();
  }

  submitPrompt = (e) => {
    e.preventDefault();
    const newPrompt = this.state.promptInput;

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
        existingPrompts.push(newPrompt);
        ref.update(existingPrompts);
        return res(`Prompt submitted: ${newPrompt}`);
      });
    }).then(() => {
      this.setState({ promptInput: "" });
    });
  };

  getPacks = () => {
    const ref = firebase.database().ref("promptPacks");
    new Promise((res, rej) => {
      ref.once("value", (snapshot) => {
        const promptPacks = snapshot.val();
        if (!promptPacks) {
          return rej("No Prompt packs available.");
        }
        const packs = Object.keys(promptPacks);
        return res(packs);
      });
    }).then((packs) => {
      this.setState({ packs, currentPack: "Party" });
      this.getPromptPackData(this.state.currentPack);
    });
  };

  getPromptPackData = (selectedPack) => {
    const ref = firebase.database().ref(`promptPacks`);
    new Promise((res, rej) => {
      ref.on("value", (snapshot) => {
        const promptPacks = snapshot.val();
        if (!promptPacks) {
          return rej("No Prompt packs available.");
        }
        this.setState({
          prompts: promptPacks[selectedPack].prompts.reverse(),
        });
        return res(promptPacks);
      });
    }).then(() => {
      this.setState({ loading: false });
    });
  };

  removePrompt = (prompt) => {
    console.log("REMOVING");
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
        existingPrompts.pop(prompt);
        console.log(existingPrompts);
        ref.set(existingPrompts);
        this.setState({
          prompts: existingPrompts.reverse(),
        });
        return res(`Removed prompt: ${prompt}`);
      });
    });
  };

  toggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  updatePromptInputValue = (event) => {
    this.setState({ promptInput: event.target.value });
  };

  render() {
    return (
      <div className="App-body">
        {!this.state.loading && (
          <>
            {this.state.currentPack && (
              <>
                <h1>Submit Prompt</h1>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: "#000000",
                        width: "30vh",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        borderRadius: "4px 0px 0px 4px",
                      }}
                    >
                      {this.state.currentPack}
                    </div>
                    <DropdownToggle
                      caret
                      style={{
                        width: "25%",
                        overflow: "hidden",
                        borderRadius: "0px 4px 4px 0px",
                      }}
                    />
                  </div>
                  <DropdownMenu>
                    {this.state.packs.map((pack, index) => (
                      <DropdownItem
                        key={index}
                        onClick={() => {
                          this.setState({ currentPack: pack });
                          this.getPromptPackData(pack);
                        }}
                      >
                        {pack}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Form
                  style={{ marginTop: "2vh", width: "90%", maxWidth: "700px" }}
                  onSubmit={this.submitPrompt}
                >
                  <div style={{ display: "flex" }}>
                    <Input
                      value={this.state.promptInput}
                      placeholder="Enter prompt here"
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
                              this.removePrompt(prompt);
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
          </>
        )}
        {this.state.loading && (
          <Spinner style={{ width: "5rem", height: "5rem" }} />
        )}
        <Footer exit={this.exitGame} inGame={!!this.state.gameid} />
      </div>
    );
  }
}
