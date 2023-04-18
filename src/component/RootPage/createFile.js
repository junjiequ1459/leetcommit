export const createFile = async (
  owner,
  repo,
  path,
  content,
  token,
  message = "Create file via LeetCommit"
) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
    path
  )}`;
  const encodedContent = btoa(content);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: encodedContent,
      }),
    });

    if (response.ok) {
      console.log(`File ${path} created successfully!`);
    } else {
      console.error("Error creating file:", response.statusText);
    }
  } catch (error) {
    console.error("Error creating file:", error.message);
  }
};
