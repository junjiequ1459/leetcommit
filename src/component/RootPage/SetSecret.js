import sodium from "libsodium-wrappers";

export async function setSecret(
  owner,
  repo,
  secretName,
  secretValue,
  accessToken
) {
  const apiBaseUrl = "https://api.github.com";

  // Wait for libsodium to be ready before proceeding
  await sodium.ready;
  const headers = {
    Authorization: `token ${accessToken}`,
    Accept: "application/vnd.github+json",
  };

  // Get the public key for the repository
  const publicKeyUrl = `${apiBaseUrl}/repos/${owner}/${repo}/actions/secrets/public-key`;
  const publicKeyResponse = await fetch(publicKeyUrl, { headers });

  if (!publicKeyResponse.ok) {
    throw new Error(
      `Failed to fetch public key: ${publicKeyResponse.statusText}`
    );
  }

  const publicKeyData = await publicKeyResponse.json();

  // Encrypt the secret value using the repository's public key
  const key = sodium.from_base64(
    publicKeyData.key,
    sodium.base64_variants.ORIGINAL
  );
  const secret = sodium.from_string(secretValue);
  const encryptedSecret = sodium.crypto_box_seal(secret, key);
  const encodedSecretValue = sodium.to_base64(
    encryptedSecret,
    sodium.base64_variants.ORIGINAL
  );

  // Create the action secret using the encrypted secret value
  const secretUrl = `${apiBaseUrl}/repos/${owner}/${repo}/actions/secrets/${secretName}`;
  const secretPayload = {
    encrypted_value: encodedSecretValue,
    key_id: publicKeyData.key_id,
  };

  const response = await fetch(secretUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify(secretPayload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create secret: ${response.statusText}`);
  }

  console.log(
    `Secret '${secretName}' created successfully for repository '${owner}/${repo}'`
  );
}
