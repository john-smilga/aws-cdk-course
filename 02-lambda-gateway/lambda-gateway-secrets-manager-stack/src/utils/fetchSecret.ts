import { SecretsManagerClient, GetSecretValueCommand, GetSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager';

const secretsClient = new SecretsManagerClient({});

export const fetchSecret = async (secretId: string): Promise<string> => {
  const command = new GetSecretValueCommand({
    SecretId: secretId,
  });
  let response: GetSecretValueCommandOutput;

  try {
    response = await secretsClient.send(command);
  } catch (error) {
    throw new Error('Failed to fetch secret');
  }
  if (!response.SecretString) {
    throw new Error('Secret value is undefined');
  }
  return response.SecretString;
};
