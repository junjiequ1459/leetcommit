import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function InstructionPage() {
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div>
      <h1>Instructions</h1>
      <ul>
        <li>
          Step 1: go to leetcode.com and use inspect element to open up the
          network tab, click refresh, find leetcode.com and copy everything in
          headers
        </li>
        <li>
          Step 2: paste the header into the textbox to obtain session and csrf
          token
        </li>
        <li>
          Step 3: go to github repo settings -> security -> Secrets and
          Variables -> Actions -> New Repository Secret
        </li>
        <li>
          Step 4: create two secret keys called LEETCODE_SESSION and
          LEETCODE_CSRF_TOKEN and paste in the value
        </li>
        <li>
          Step 5: download the YML file put it in a new folder called
          ./github/workflows
        </li>
        <li>
          Step 6: Nagivate to github repo -> Action -> find the workflow Sync
          Leetcode
        </li>
        <li>Step 7: Click Run Workflow</li>
      </ul>
      <button onClick={handleGoBack}>Go back</button>
    </div>
  );
}

export default InstructionPage;
