import { MessageType } from "../../utils/enum";

export function setFeedbackMessage(text, type) {
  if (type === MessageType.ERROR) {
    return <div style={{ color: "Tomato" }}>{text}</div>;
  } else if (type === MessageType.SUCCESS) {
    return <div style={{ color: "LightGreen" }}>{text}</div>;
  } else if (type === MessageType.WARNING) {
    return <div style={{ color: "GoldenRod" }}>{text}</div>;
  }
}
