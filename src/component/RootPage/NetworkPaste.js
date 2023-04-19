import React, { useState } from "react";
import InstructionPage from "../InstructionPage/InstructionPage";
import { setSecret } from "./SetSecret";
import { createRepo } from "./createRepository";
import { createFile } from "./createFile";

function NetworkPaste() {
  const [csrfToken, setCsrfToken] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [logMessages, setLogMessages] = useState([]);

  const csrfName = "LEETCODE_CSRF_TOKEN";
  const sessionName = "LEETCODE_SESSION";
  let owner;

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = event.target.elements.text.value;

    const csrfTokenRegex = /csrftoken=([a-zA-Z0-9]+)/;
    const sessionTokenRegex = /LEETCODE_SESSION=([a-zA-Z0-9._-]+)/;

    const newCsrfToken = text.match(csrfTokenRegex)?.[1] || null;
    const newSessionToken = text.match(sessionTokenRegex)?.[1] || null;

    setCsrfToken(newCsrfToken);
    setSessionToken(newSessionToken);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const handleCreateRepo = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLogMessages([]);

    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      owner = data.login;
    } catch (error) {
      console.error("Error fetching user:", error.message);
      setLogMessages([...logMessages, `Error fetching user: ${error.message}`]);
      return;
    }

    try {
      // Create the repository
      await createRepo(repo, token);
      // Create the sync.yml file
    } catch (error) {
      console.error(
        "Error creating repository, secrets, or sync.yml file:",
        error.message
      );
    }

    try {
      // Set the secrets
      await setSecret(owner, repo, csrfName, csrfToken, token);
      console.log("Secret 1 created successfully");

      await setSecret(owner, repo, sessionName, sessionToken, token);
      console.log("Secret 2 created successfully");

      // Create the sync.yml file
      const content = `
       name: LeetCode Sync
      
       on:
         workflow_dispatch:
         schedule:
           - cron: "0 8 * * *" #runs once a day

       permissions:
          contents: write
          pull-requests: write
          issues: write

       jobs:
         build:
           runs-on: ubuntu-latest
    
           steps:
             - name: Sync
               uses: joshcai/leetcode-sync@v1.5
               with:
                 github-token: \${{ secrets.GITHUB_TOKEN }}
                 leetcode-csrf-token: \${{ secrets.LEETCODE_CSRF_TOKEN }}
                 leetcode-session: \${{ secrets.LEETCODE_SESSION }}
                 destination-folder: my-folder`;

      await createFile(
        owner,
        repo,
        ".github/workflows/sync_leetcode.yml",
        content,
        token
      );
      console.log("Sync.yml file created successfully");

      setLogMessages([
        `Repository ${repo} created successfully!`,
        `Secret ${csrfName} created successfully`,
        `Secret ${sessionName} created successfully`,
        "Sync.yml file created successfully",
      ]);
    } catch (error) {
      console.error(
        "Error creating repository, secrets, or sync.yml file:",
        error.message
      );
      setLogMessages([
        `Error creating repository, secrets, or sync.yml file: ${error.message}`,
      ]);
    }
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
      {csrfToken ? (
        <div className="token-div">
          <label htmlFor="csrfTokenInput" className="purple-text">
            LEETCODE_CSRF_TOKEN:
          </label>
          <span className="checkmark">&#10003;</span>
        </div>
      ) : (
        <div className="token-div">
          <label htmlFor="csrfTokenInput" className="purple-text">
            LEETCODE_CSRF_TOKEN:
          </label>
          <span className="red-x">&#10005;</span>
        </div>
      )}

      {sessionToken ? (
        <div className="token-div">
          <label htmlFor="sessionTokenInput" className="purple-text">
            LEETCODE_SESSION:
          </label>
          <span className="checkmark">&#10003;</span>
        </div>
      ) : (
        <div className="token-div">
          <label htmlFor="sessionTokenInput" className="purple-text">
            LEETCODE_SESSION:
          </label>
          <span className="xmark">&#10005;</span>
        </div>
      )}
      <div className="create-repo-form">
        <form onSubmit={handleCreateRepo}>
          <label htmlFor="repoName">Repository Name:</label>
          <input
            type="text"
            id="repoName"
            name="repoName"
            value={repo}
            onChange={(event) => setRepo(event.target.value)}
          />
          <label htmlFor="accessToken">Access Token:</label>
          <input
            type="text"
            id="accessToken"
            name="accessToken"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
          <button type="submit">Create Repo</button>
        </form>
      </div>
      <div className="console-logs">
        {logMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
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
