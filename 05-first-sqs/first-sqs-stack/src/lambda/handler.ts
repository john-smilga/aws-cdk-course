import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({ region: 'eu-north-1' });

export const producer = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { orderId } = JSON.parse(event.body!);
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.QUEUE_URL!,
        MessageBody: JSON.stringify({ orderId }),
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order placed in queue',
        orderId,
      }),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating order',
      }),
    };
  }
};

export const consumer = async (event: SQSEvent): Promise<void> => {
  throw new Error('test');
  console.log('TEMP : ', event);

  const messages = event.Records;

  for (const message of messages) {
    const { orderId } = JSON.parse(message.body);
    console.log('Processing order :', orderId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Finished processing order : ', orderId);
  }
};
