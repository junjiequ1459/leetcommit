import React, { useState } from "react";

function TextareaBox(props) {
  const [csrfToken, setCsrfToken] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = event.target.elements.text.value;

    const csrfTokenRegex = /csrftoken=([a-zA-Z0-9]+)/;
    const sessionTokenRegex = /LEETCODE_SESSION=([a-zA-Z0-9._-]+)/;

    const newCsrfToken = text.match(csrfTokenRegex)?.[1];
    const newSessionToken = text.match(sessionTokenRegex)?.[1];

    setCsrfToken(newCsrfToken);
    setSessionToken(newSessionToken);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="text"
        rows={props.rows}
        cols={props.cols}
        placeholder={props.placeholder}
        style={{ backgroundColor: props.backgroundColor, resize: props.resize }}
      />
      <button type="submit">Submit</button>
      {csrfToken && <p>CSRF Token: {csrfToken}</p>}
      {sessionToken && <p>Session Token: {sessionToken}</p>}
    </form>
  );
}

export default TextareaBox;
