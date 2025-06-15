import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  try {
    if (path === '/users') {
      switch (method) {
        case 'GET':
          return getAllUsers(event);
        case 'POST':
          return createUser(event);
        default:
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Unsupported HTTP method for /users path ' }),
          };
      }
    }

    if (path.startsWith('/users/')) {
      const userId = path.split('/users/')[1];
      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'User ID is required' }),
        };
      }
      switch (method) {
        case 'GET':
          return getUser(userId);
        case 'PUT':
          return updateUser(event, userId);
        case 'DELETE':
          return deleteUser(userId);
        default:
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Unsupported HTTP method for users path ' }),
          };
      }
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found' }),
    };
  } catch (error) {
    console.error('Error :', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

async function getAllUsers(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const result = await dynamoDB.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify(result.Items || []),
  };
}
async function createUser(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const { name, email } = JSON.parse(event.body!);
  const userId = uuidv4();

  const user = {
    id: userId,
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  // const user = {
  //   id: userId,
  //   name: faker.person.fullName(),
  //   email: faker.internet.email(),
  //   createdAt: new Date().toISOString(),
  // };

  await dynamoDB.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: user,
    })
  );
  return {
    statusCode: 201,
    body: JSON.stringify(user),
  };
}

async function getUser(userId: string): Promise<APIGatewayProxyResultV2> {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: userId },
    })
  );
  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'User not found' }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
}
async function updateUser(event: APIGatewayProxyEventV2, userId: string): Promise<APIGatewayProxyResultV2> {
  const { name, email } = JSON.parse(event.body!);

  const result = await dynamoDB.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id: userId },
      UpdateExpression: 'SET #name = :name, #email = :email',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email',
      },
      ExpressionAttributeValues: {
        ':name': name || null,
        ':email': email || null,
      },
      ReturnValues: 'ALL_NEW',
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
  };
}
async function deleteUser(userId: string): Promise<APIGatewayProxyResultV2> {
  await dynamoDB.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id: userId },
    })
  );
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `user deleted : ${userId}` }),
  };
}
