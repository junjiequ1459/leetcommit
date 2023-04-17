import React from "react";

function DownloadButton() {
  const handleDownload = () => {
    const fileName = "sync_leetcode.yml";
    const fileContent = `name: Sync Leetcode

on:
  workflow_dispatch:
  schedule:
    - cron: "0 8 * * *" #runs once a day

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Sync
        uses: joshcai/leetcode-sync@v1.5
        with:
          github-token: \${{ github.token }}
          leetcode-csrf-token: \${{ secrets.LEETCODE_CSRF_TOKEN }}
          leetcode-session: \${{ secrets.LEETCODE_SESSION }}
          destination-folder: my-folder`;

    const blob = new Blob([fileContent], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <button onClick={handleDownload}>Download YAML file</button>;
}

export default DownloadButton;
