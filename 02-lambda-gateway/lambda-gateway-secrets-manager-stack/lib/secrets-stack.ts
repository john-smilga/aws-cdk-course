import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class SecretsStack extends cdk.Stack {
  public readonly secret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.secret = new secretsmanager.Secret(this, 'MyAppSecret', {
      secretName: 'my-app-secret',
      secretObjectValue: {},
    });
    this.secret.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    new cdk.CfnOutput(this, 'SecretArn', {
      value: this.secret.secretArn,
      description: 'The ARN of the secret',
    });
  }
}
