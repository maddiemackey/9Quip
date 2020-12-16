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
import ConfirmModal from "./confirmModal";

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
      searchMessage: null,
      createMessage: null,
      deleteModalVisible: false,
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
    if (newPrompt.length > 120) {
      this.setState({
        publishedMessage: setFeedbackMessage(
          "120 character limit on prompts, sorry.",
          MessageType.WARNING
        ),
      });
      return;
    }

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

        // Publish pack if more than 10 prompts
        if (existingPrompts.length >= 10) {
          ref.update({ published: true });
        }
        return res(`Prompt submitted: ${newPrompt}`);
      });
    })
      .catch((rej) => {
        this.setState({
          publishedMessage: setFeedbackMessage(rej, MessageType.ERROR),
        });
      })
      .then(() => {
        this.setState({ promptInput: "", publishedMessage: null });
      });
  };

  onSearch = (e) => {
    e.preventDefault();
    const code = this.state.codeInput;
    this.findPackFromCode(code);
  };

  findPackFromCode = (code) => {
    new Promise((res, rej) => {
      if (!code) {
        return rej(`Please enter a code to search`);
      }
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
            searchMessage: null,
            createMessage: null,
          });
          return res("Found prompt pack");
        });
    })
      .catch((rej) => {
        this.setState({
          searchMessage: setFeedbackMessage(rej, MessageType.ERROR),
          createMessage: null,
          // currentPack: "",
          // currentCode: "",
          // prompts: [],
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

        // Update published to FALSE if less than 10 prompts
        if (existingPrompts.length < 10) {
          const publishRef = firebase
            .database()
            .ref(`promptPacks/${this.state.currentPack}`);
          publishRef.update({ published: false });
        }
        return res(`Removed prompt: ${prompt}`);
      });
    });
  };

  onDelete = () => {
    this.setState({ deleteModalVisible: true });
  };

  removePromptPack = () => {
    this.setState({ deleteModalVisible: false });
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
        searchMessage: null,
        createMessage: null,
        nameInput: "",
        prompts: [],
      });
    });
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
          createMessage: null,
          searchMessage: null,
          nameInput: "",
        });

        return res(`${promptPackName} Prompt Pack submitted`);
      });
    }).catch((rej) => {
      this.setState({
        createMessage: setFeedbackMessage(rej, MessageType.ERROR),
        searchMessage: null,
      });
    });
  };

  componentDidUpdate(prevProps, prevState) {
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
        <div>
          <h2>Prompt Packs</h2>
        </div>
        <div
          className="row-body"
          style={{ height: "100%", minHeight: "100%", marginTop: "1vh" }}
        >
          <div
            style={{
              width: "40vw",
              marginTop: "1%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifySelf: "flex-start",
                alignItems: "center",
              }}
            >
              <h4 style={{ marginTop: "-1vh" }}>Find pack by code</h4>

              <Form
                style={{
                  width: "50%",
                  minWidth: "400px",
                }}
                onSubmit={this.onSearch}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Input
                    autoFocus
                    value={this.state.codeInput}
                    placeholder="Code"
                    type="text"
                    onChange={this.updateCodeInputValue}
                    style={{
                      maxWidth: "60%",
                      fontSize: "60%",
                      borderRadius: "4px 0px 0px 4px",
                    }}
                  />
                  <Button
                    style={{
                      fontSize: "60%",
                      border: "1px solid #636363",
                      borderRadius: "0px 4px 4px 0px",
                      width: "10vw",
                    }}
                    type="submit"
                    color="secondary"
                  >
                    Search
                  </Button>
                </div>
              </Form>
              <div
                style={{
                  height: "3vh",
                  fontSize: "60%",
                  marginBottom: "0.75vh",
                }}
              >
                {this.state.searchMessage}
              </div>

              <h4 style={{ marginTop: "1.5vh" }}>Or create a new pack!</h4>
              <Form
                style={{ width: "50%", minWidth: "400px" }}
                onSubmit={this.addNewPromptPack}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Input
                    value={this.state.nameInput}
                    placeholder="New Name"
                    type="text"
                    onChange={this.updateNameInputValue}
                    style={{
                      maxWidth: "60%",
                      fontSize: "60%",
                      borderRadius: "4px 0px 0px 4px",
                    }}
                  />
                  <Button
                    style={{
                      fontSize: "60%",
                      border: "1px solid #2966d6",
                      borderRadius: "0px 4px 4px 0px",
                      width: "10vw",
                    }}
                    color="primary"
                    type="submit"
                  >
                    Create New
                  </Button>
                </div>
              </Form>
              <div
                style={{
                  height: "3vh",
                  fontSize: "70%",
                  marginBottom: "0.75vh",
                }}
              >
                {this.state.createMessage}
              </div>
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
                    height: "100%",
                  }}
                >
                  <h3 className="prompt-pack-heading">
                    {`${this.state.currentPack} [${this.state.currentCode}]`}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      className="remove-prompt-pack"
                      onClick={this.onDelete}
                      color="danger"
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
                        DELETE
                      </div>
                    </Button>
                    <ConfirmModal
                      text={`Are you sure you want to delete ${this.state.currentPack}?`}
                      onConfirm={this.removePromptPack}
                      modalVisible={this.state.deleteModalVisible}
                      type="danger"
                      close={() => {
                        this.setState({ deleteModalVisible: false });
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{ marginTop: "-1vh", height: "3vh", fontSize: "70%" }}
                >
                  {this.state.publishedMessage}
                </div>
                <h5>Submit a prompt to this pack</h5>
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
                        fontSize: "60%",
                        borderRadius: "0px 4px 4px 0px",
                        width: "45%",
                      }}
                      type="submit"
                      color="primary"
                    >
                      Submit Prompt
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </div>
          {this.state.prompts.length !== 0 && (
            <div
              style={{
                height: "85%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #636363",
                width: "50vw",
              }}
            >
              <h5 style={{ marginTop: "1vh" }}>Prompts in this pack:</h5>
              <table
                style={{
                  overflow: "scroll",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  fontSize: "70%",
                }}
              >
                <tbody style={{ width: "50vw" }}>
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
                        />
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
                  height: "85%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #636363",
                  color: "#FFFFFF",
                  width: "50vw",
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
                height: "85%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50vw",
                textAlign: "center",
                border: "1px solid #636363",
                color: "#FFFFFF",
              }}
            >
              Search/Create to see Prompts
            </div>
          )}
        </div>
        <Footer exit={this.exitGame} inGame={!!this.state.gameid} />
      </div>
    );
  }
}
