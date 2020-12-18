import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input } from 'reactstrap';
import LegoSpeechBubble from '../LegoSpeechBubble';
import './index.css';
import { ClientGameContext } from '../GameContext';
import { setFeedbackMessage } from '../../shared/feedbackMessage';
import { MessageType } from '../../../utils/enum';

function Quipping() {
  const thing = useContext(ClientGameContext);
  let quipRef = useRef(null);
  const [prompts, setPrompts] = useState([]);
  const [promptIndex, changePromptIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [quipMessage, setQuipMessage] = useState(null);

  useEffect(() => {
    if (loading === true) {
      thing.getPrompts().then((res) => {
        if (res === null) {
          alert('Failed to get prompts, sorry :(');
        } else {
          setPrompts(res);
          setLoading(false);
        }
      });
    }
  }, [loading, prompts, thing]);

  const handleInputOnChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleQuipSubmit = (e) => {
    e.preventDefault();

    if (!answer) {
      setQuipMessage(
        setFeedbackMessage('Cannot submit a blank quip.', MessageType.ERROR)
      );
      document.getElementById('quip-input').focus();
      return;
    }
    if (answer.length > 80) {
      setQuipMessage(
        setFeedbackMessage('Too long. 80 character limit.', MessageType.WARNING)
      );
      document.getElementById('quip-input').focus();
      return;
    }

    thing.submitQuip(prompts[promptIndex], answer, promptIndex).then((res) => {
      // console.log("PROMPT:", prompts[promptIndex]);

      // clear prompt
      setAnswer('');
      setQuipMessage(null);

      if (res === null) {
        setQuipMessage(
          setFeedbackMessage('Failed to submit quip.', MessageType.ERROR)
        );
      } else {
        changePromptIndex(promptIndex + 1);
        if (promptIndex <= 2) {
          document.getElementById('quip-input') &&
            document.getElementById('quip-input').focus();
        }
      }
    });
  };

  return (
    <div className="quipping-container">
      <div>
        {promptIndex < 2 && ( // TODO: hardcoded for 2 prompts per player, should fix that
          <div>
            <div className="quipping-question-container">
              <LegoSpeechBubble
                bubbleText={!loading ? prompts[promptIndex] : 'Loading...'}
              />
            </div>
            <div className="quipping-answer-container">
              <Form onSubmit={handleQuipSubmit}>
                <Input
                  id="quip-input"
                  className="quipping-answer-input"
                  placeholder="Enter quip here"
                  type="textarea"
                  value={answer}
                  onChange={handleInputOnChange}
                  innerRef={quipRef}
                  autoFocus={true}
                ></Input>
                <div
                  style={{
                    height: '3vh',
                    fontSize: '80%',
                    textAlign: 'center',
                    margin: '1%',
                  }}
                >
                  {quipMessage}
                </div>
                <Button
                  type="submit"
                  className="quipping-answer-button"
                  color="primary"
                >
                  Submit Answer
                </Button>
              </Form>
            </div>
          </div>
        )}
        {promptIndex >= 2 && (
          <div>
            <div className="quipping-question-container">
              <LegoSpeechBubble
                bubbleText={'Please wait while others finish quipping.'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quipping;
