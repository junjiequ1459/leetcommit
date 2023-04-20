function InstructionPage() {
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
          Step 3: set a repo name and enter in your accessToken, click on create
          repo
        </li>
        <li>
          Step 4: Nagivate to github repo -> Action -> find the workflow Sync
          Leetcode
        </li>
        <li>Step 5: Click Run Workflow</li>
      </ul>
    </div>
  );
}

export default InstructionPage;
