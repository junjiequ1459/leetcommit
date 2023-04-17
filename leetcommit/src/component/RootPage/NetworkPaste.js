import React, { useState } from "react";
import InstructionPage from "../InstructionPage/InstructionPage";

function NetworkPaste() {
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
        <textarea name="text" />
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
      {csrfToken && (
        <div className="token-div">
          <label htmlFor="csrfTokenInput" className="purple-text">
            LEETCODE_CSRF_TOKEN:
          </label>
          <input
            type="text"
            id="csrfTokenInput"
            value={csrfToken}
            size={csrfToken.length}
            readOnly={true}
          />
          <button
            className="copy-button"
            onClick={() => navigator.clipboard.writeText(csrfToken)}
          >
            Copy
          </button>
        </div>
      )}
      {sessionToken && (
        <div className="token-div">
          <label htmlFor="sessionTokenInput" className="purple-text">
            LEETCODE_SESSION:
          </label>
          <input
            type="text"
            id="sessionTokenInput"
            value={sessionToken}
            size={sessionToken.length}
            readOnly={true}
          />
          <button
            className="copy-button"
            onClick={() => navigator.clipboard.writeText(sessionToken)}
          >
            Copy
          </button>
        </div>
      )}
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
