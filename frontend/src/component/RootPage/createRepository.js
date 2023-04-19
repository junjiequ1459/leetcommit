export const createRepo = async (repoName, token) => {
  try {
    const response = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        description: "This is a new repository created from JavaScript.",
        private: false,
        permissions: {
          workflows: "write",
        },
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(`Repository ${data.name} created successfully!`);
    } else {
      console.error("Error creating repository:", response.statusText);
    }
  } catch (error) {
    console.error("Error creating repository:", error);
  }
};
