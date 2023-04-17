import React, { useState } from "react";
import InstructionPage from "../InstructionPage/InstructionPage";

function NetworkPaste(props) {
  const [csrfToken, setCsrfToken] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = event.target.elements.text.value;

    const csrfTokenRegex = /csrftoken=([a-zA-Z0-9]+)/;
    const sessionTokenRegex = /LEETCODE_SESSION=([a-zA-Z0-9._-]+)/;

    const newCsrfToken = text.match(csrfTokenRegex)?.[1] || "Not found";
    const newSessionToken = text.match(sessionTokenRegex)?.[1] || "Not found";

    setCsrfToken(newCsrfToken);
    setSessionToken(newSessionToken);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <>
      <h1 className="purple-text">LeetCommit</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="text"
          rows={props.rows}
          cols={props.cols}
          placeholder={props.placeholder}
          style={{
            backgroundColor: props.backgroundColor,
            resize: props.resize,
          }}
        />
        <button type="submit">Submit</button>
        <div className="token-div">
          {csrfToken && (
            <p>
              <span className="purple-text">LEETCODE_CSRF_TOKEN:</span>{" "}
              {csrfToken}
            </p>
          )}
        </div>
        <div className="token-div">
          {sessionToken && (
            <p>
              <span className="purple-text">LEETCODE_SESSION:</span>{" "}
              {sessionToken}
            </p>
          )}
        </div>
      </form>
      <div className="instruction-button">
        <button onClick={toggleInstructions}>Instructions</button>
      </div>
      {showInstructions && (
        <div className="instructions">
          <InstructionPage />
        </div>
      )}
    </>
  );
}

export default NetworkPaste;
