import React from "react";
import Logo from "../Logo";
import "./index.css";

function NotFound() {
  return (
    <div className="notfound-body">
      <h1 style={{ fontSize: "200%" }}>404: Page Not Found</h1>
      <p style={{ fontSize: "90%" }}>Try Going Home</p>
      <Logo style={{ width: "15vw", height: "auto" }} />
    </div>
  );
}

export default NotFound;
