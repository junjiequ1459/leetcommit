function InstructionPage() {
  return (
    <div>
      <h1>Instructions</h1>
      <ul>
        <li>Step 1: click on connect to github and allow permissions</li>
        <li>
          Step 2: go to leetcode.com and use inspect element to open up the
          network tab, click refresh, find leetcode.com and copy everything in
          headers
        </li>
        <li>
          Step 3: paste the header into the textbox to obtain session and csrf
          token
        </li>

        <li>Step 4: set a repo name, click on create repo</li>

        <li>Step 5: click on linkleetcode</li>
        <li>
          Step 6: Nagivate to github repo -> Action -> find the workflow Sync
          Leetcode
        </li>

        <li>Step 7: Click Run Workflow</li>
      </ul>
    </div>
  );
}

export default InstructionPage;
