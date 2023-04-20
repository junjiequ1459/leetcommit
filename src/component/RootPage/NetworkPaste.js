import React, { useEffect, useState } from "react";
import InstructionPage from "../InstructionPage/InstructionPage";
import { setSecret } from "./SetSecret";
import { createRepo } from "./createRepository";
import { createFile } from "./createFile";

function NetworkPaste() {
  const [csrfToken, setCsrfToken] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [repo, setRepo] = useState("");
  const [owner, setOwner] = useState("");
  const [token, setToken] = useState("");
  const [logMessages, setLogMessages] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  // const [reRender, setReRender] = useState(false);

  const csrfName = "LEETCODE_CSRF_TOKEN";
  const sessionName = "LEETCODE_SESSION";

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    if (codeParam) {
      async function getAccessToken() {
        await fetch(
          "https://seahorse-app-qclkm.ondigitalocean.app/getAccessToken?code=" +
            codeParam
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.access_token) {
              setToken(data.access_token);
              // setToken(
              //   "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"
              // );
              // setReRender(!reRender);
            }
          });
      }
      getAccessToken();
    }
  }, []);
  const CLIENT_ID = "aba66794a802d297acff";

  const handleConnectGitHub = () => {
    const SCOPE =
      "repo,user,workflow,write:repo_hook,read:user,user:email,user:follow";
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`
    );
  };

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

    // Get the access token from localStorage
    console.log(token);
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      setOwner(data.login);
      setUserName(data.name); // The user's name
      setEmail(data.email); // The user's email
    } catch (error) {
      console.error("Error fetching user:", error.message);
      setLogMessages([...logMessages, `Error fetching user: ${error.message}`]);
      return;
    }
    try {
      // Create the repository
      await createRepo(repo, token);

      setLogMessages([`Repository ${repo} created successfully!`]);
    } catch (error) {
      console.error("Error creating repository:", error.message);
      setLogMessages([
        ...logMessages,
        `Error creating repository: ${error.message}`,
      ]);
    }
  };

  const handleSetRepo = async (e) => {
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
             - name: Checkout
               uses: actions/checkout@v2

             - name: Set Git Config
               run: |
                 git config user.name "${userName}"
                 git config user.email "${email}"

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
        "Error setting secrets or creating sync.yml file:",
        error.message
      );
      setLogMessages([
        `Error setting secrets or creating sync.yml file: ${error.message}`,
      ]);
    }
  };

  return (
    <>
      <h1 className="purple-text">LeetCommit</h1>
      <div className="instruction-button">
        <button onClick={toggleInstructions}>Instructions</button>
      </div>
      {showInstructions && (
        <div className="instructions">
          <InstructionPage />
        </div>
      )}
      <button onClick={handleConnectGitHub}>ConnectToGitHub</button>

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
          <span className="red-x">&#10005;</span>
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
          <button type="submit">Create Repo</button>
        </form>
      </div>

      <button onClick={handleSetRepo}>LinkLeetCode</button>

      <div className="console-logs">
        {logMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </>
  );
}
export default NetworkPaste;
