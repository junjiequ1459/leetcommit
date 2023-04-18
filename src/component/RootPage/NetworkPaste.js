import React, { useState } from "react";
import InstructionPage from "../InstructionPage/InstructionPage";
import { setSecret } from "./SetSecret";
import { createRepo } from "./createRepository";
import { createFile } from "./createFile";

function NetworkPaste() {
  const [csrfToken, setCsrfToken] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // const token = "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j";
  const token =
    "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";
  const csrfName = "LEETCODE_CSRF_TOKEN";
  const sessionName = "LEETCODE_SESSION";
  const repo = "Tests";
  const owner = "junjiequ1459";

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

  const handleCreateRepo = async () => {
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
  };

  const handleSyncLeetCode = async () => {
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
    } catch (error) {
      console.error(
        "Error creating repository, secrets, or sync.yml file:",
        error.message
      );
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
      <div className="create-repo-button">
        <button onClick={handleCreateRepo}>Create Repo</button>
      </div>
      <div className="create-repo-button">
        <button onClick={handleSyncLeetCode}>Sync LeetCode</button>
      </div>
    </>
  );
}

export default NetworkPaste;
