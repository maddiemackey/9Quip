import React from "react";
import { Button, Form, Input } from "reactstrap";
import "../../App.css";
import Footer from "../footer";
import firebase from "../../Firebase/firebase";
import "firebase/database";
import "./prompts.css";
import { setFeedbackMessage } from "../shared/feedbackMessage";
import { MessageType } from "../../utils/enum";
import { generateGamecode } from "../../utils/generateGameCode";
import _ from "lodash";
import qs from "qs";

export default class Prompts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPack: "",
      currentCode: "",
      prompts: [],
      promptInput: "",
      codeInput: "",
      nameInput: "",
      publishedMessage: null,
      promptPackMessage: null,
      lowerHeight: 0,
    };
  }

  componentDidMount() {
    const codeParam = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).code;
    if (codeParam) {
      this.findPackFromCode(codeParam);
    }
  }

  submitPrompt = (e) => {
    e.preventDefault();
    const newPrompt = this.state.promptInput;

    return new Promise((res, rej) => {
      if (!newPrompt) {
        return rej("Please enter prompt");
      }
      const ref = firebase
        .database()
        .ref(`promptPacks/${this.state.currentPack}`);
      ref.once("value", (snapshot) => {
        const snapshotValue = snapshot.val().prompts;
        if (!snapshotValue) {
          ref.set({
            prompts: [newPrompt],
            code: snapshot.val().code,
            published: snapshot.val().published,
          });
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
    })
      .catch((rej) => {
        alert(rej);
      })
      .then(() => {
        this.setState({ promptInput: "" });
      });
  };

  onSearch = (e) => {
    e.preventDefault();
    const code = this.state.codeInput;
    this.findPackFromCode(code);
  };

  findPackFromCode = (code) => {
    new Promise((res, rej) => {
      const ref = firebase.database().ref(`promptPacks`);
      ref
        .orderByChild("code")
        .equalTo(code)
        .once("value", (snapshot) => {
          const promptPack = snapshot.val();
          if (!promptPack) {
            return rej(`Could not find prompt pack with code ${code}`);
          }
          const packName = Object.keys(promptPack)[0];
          this.setState({ currentPack: packName, currentCode: code });
          this.getPromptPackData(packName);
          this.setState({
            promptPackMessage: "",
          });
          return res("Found prompt pack");
        });
    })
      .catch((rej) => {
        this.setState({
          promptPackMessage: setFeedbackMessage(rej, MessageType.ERROR),
          currentPack: "",
          currentCode: "",
          prompts: [],
        });
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
    }).catch(() => {
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

  removePromptPack = () => {
    if (window.confirm("Are you sure to delete this Prompt Pack?")) {
      return new Promise((res, rej) => {
        const ref = firebase
          .database()
          .ref(`promptPacks/${this.state.currentPack}`);
        ref.remove();
        return res();
      }).then(() => {
        this.setState({
          currentPack: "",
          currentCode: "",
          promptPackMessage: null,
          nameInput: "",
        });
      });
    }
  };

  addNewPromptPack = (e) => {
    e.preventDefault();
    const promptPackName = this.state.nameInput;

    return new Promise((res, rej) => {
      if (!promptPackName) {
        return rej("Please enter new Prompt Pack name");
      }
      const ref = firebase.database().ref(`promptPacks`);
      ref.once("value", (snapshot) => {
        const promptPacks = snapshot.val();
        if (promptPacks[promptPackName]) {
          return rej(`Prompt Pack with name ${promptPackName} already exists`);
        }

        let promptPackCode = generateGamecode(4);
        if (promptPacks) {
          // Get prompt pack code that doesn't already exist
          let flag = false;
          const iterations = _.size(promptPacks);
          while (!flag) {
            let i = 0;
            // eslint-disable-next-line
            for (const [key, value] of Object.entries(promptPacks)) {
              if (value.code === promptPackCode) {
                break;
              }
              i++;
              // If it makes it through all the prompt packs and none match, break out of while loop.
              if (i === iterations) {
                flag = true;
              }
              promptPackCode = generateGamecode(4);
            }
          }
        }

        const newPack = { code: promptPackCode, published: false };
        const newPromptRef = firebase
          .database()
          .ref(`promptPacks/${promptPackName}`);
        newPromptRef.set(newPack);
        this.getPromptPackData(promptPackName);

        this.setState({
          currentPack: promptPackName,
          currentCode: promptPackCode,
          promptPackMessage: null,
          nameInput: "",
        });

        return res(`${promptPackName} Prompt Pack submitted`);
      });
    }).catch((rej) => {
      this.setState({
        promptPackMessage: setFeedbackMessage(rej, MessageType.ERROR),
      });
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPack !== this.state.currentPack) {
      const upperHeight = document.getElementById("upper-container")
        .clientHeight;
      const fullHeight = document.getElementById("main-container").clientHeight;
      const lowerHeight = fullHeight - upperHeight - 20;
      this.setState({ lowerHeight });
    }
    if (prevState.prompts !== this.state.prompts) {
      if (this.state.prompts.length < 10) {
        this.setState({
          publishedMessage: setFeedbackMessage(
            "Warning: 10 prompts minimum required to play",
            MessageType.WARNING
          ),
        });
      } else {
        this.setState({
          publishedMessage: setFeedbackMessage(
            "Ready to play",
            MessageType.SUCCESS
          ),
        });
      }
    }
  }

  updatePromptInputValue = (event) => {
    this.setState({ promptInput: event.target.value });
  };

  updateCodeInputValue = (event) => {
    this.setState({ codeInput: event.target.value });
  };

  updateNameInputValue = (event) => {
    this.setState({ nameInput: event.target.value });
  };

  render() {
    return (
      <div className="prompts-body" id="main-container">
        <div id="upper-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifySelf: "flex-start",
              alignItems: "center",
            }}
          >
            <h1>Prompt Packs</h1>
            <h4 style={{ marginTop: "-1vh" }}>Find pack by code</h4>
            <div
              style={{
                marginTop: "-1vh",
                height: "3vh",
                fontSize: "70%",
                marginBottom: "0.5vh",
              }}
            >
              {this.state.promptPackMessage}
            </div>

            <Form
              style={{
                width: "30%",
                minWidth: "400px",
              }}
              onSubmit={this.onSearch}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Input
                  autoFocus
                  value={this.state.codeInput}
                  placeholder="code"
                  type="text"
                  onChange={this.updateCodeInputValue}
                  style={{
                    maxWidth: "35%",
                    fontSize: "70%",
                    borderRadius: "4px 0px 0px 4px",
                  }}
                />
                <Button
                  style={{
                    fontSize: "70%",
                    border: "1px solid #636363",
                    borderRadius: "0px 4px 4px 0px",
                  }}
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </Form>
            <Form
              style={{ width: "50%", minWidth: "400px", marginTop: "1.5vh" }}
              onSubmit={this.addNewPromptPack}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Input
                  autoFocus
                  value={this.state.nameInput}
                  placeholder="Prompt Pack Name"
                  type="text"
                  onChange={this.updateNameInputValue}
                  style={{
                    maxWidth: "35%",
                    fontSize: "70%",
                    borderRadius: "4px 0px 0px 4px",
                  }}
                />
                <Button
                  style={{
                    fontSize: "70%",
                    border: "1px solid #2966d6",
                    borderRadius: "0px 4px 4px 0px",
                  }}
                  color="primary"
                  type="submit"
                >
                  Create New
                </Button>
              </div>
            </Form>
          </div>
          {this.state.currentPack && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  position: "relative",
                  marginTop: "2vh",
                  height: "100%",
                }}
              >
                <h1 className="prompt-pack-heading">
                  {`${this.state.currentPack} [${this.state.currentCode}]`}
                </h1>
                <Button
                  close
                  className="remove-prompt-pack"
                  onClick={this.removePromptPack}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    x
                  </div>
                </Button>
              </div>
              <div
                style={{ marginTop: "-1vh", height: "3vh", fontSize: "70%" }}
              >
                {this.state.publishedMessage}
              </div>
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
            </div>
          )}
        </div>
        {this.state.prompts.length !== 0 && (
          <div
            style={{
              height: `${this.state.lowerHeight}px`,
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h2
              style={{
                height: this.state.lowerHeight,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
          </div>
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
