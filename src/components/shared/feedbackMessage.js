import { MessageType } from "../../utils/enum";

export function setFeedbackMessage(text, type) {
  if (type === MessageType.ERROR) {
    return <p style={{ color: "Tomato" }}>{text}</p>;
  } else if (type === MessageType.SUCCESS) {
    return <p style={{ color: "LightGreen" }}>{text}</p>;
  } else if (type === MessageType.WARNING) {
    return <p style={{ color: "GoldenRod" }}>{text}</p>;
  }
}
