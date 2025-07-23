import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambdaBase from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';

export class FirstSqsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dlq = new sqs.Queue(this, 'OrdersDLQ', {
      queueName: `${this.stackName}-orders-dlq`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const queue = new sqs.Queue(this, 'OrdersQueue', {
      visibilityTimeout: cdk.Duration.seconds(1),
      queueName: `${this.stackName}-orders-queue`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 3,
      },
    });

    const producerLambda = new NodejsFunction(this, 'OrderProducer', {
      runtime: lambdaBase.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../src/lambda/handler.ts'),
      handler: 'producer',
      functionName: `${this.stackName}-producer`,
      environment: {
        QUEUE_URL: queue.queueUrl,
      },
    });

    queue.grantSendMessages(producerLambda);

    const consumerLambda = new NodejsFunction(this, 'OrderConsumer', {
      runtime: lambdaBase.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../src/lambda/handler.ts'),
      handler: 'consumer',
      functionName: `${this.stackName}-consumer`,
    });

    consumerLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(queue, {
        batchSize: 10,
      })
    );

    const api = new apigateway.RestApi(this, 'OrdersAPI');

    const orders = api.root.addResource('orders');
    orders.addMethod('POST', new apigateway.LambdaIntegration(producerLambda));

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url!,
    });
  }
}
