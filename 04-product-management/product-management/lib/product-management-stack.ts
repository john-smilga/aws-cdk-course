import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2_integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambdaRuntime from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class ProductManagementStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productsTable = new dynamodb.Table(this, `${this.stackName}-Products-Table`, {
      tableName: `${this.stackName}-Products-Table`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const productImagesBucket = new s3.Bucket(this, `${this.stackName}-Product-Images-Bucket`, {
      bucketName: `${this.stackName.toLowerCase()}-images`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: false,
        ignorePublicAcls: true,
        restrictPublicBuckets: false,
      }),
    });

    productImagesBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:GetObject'],
        resources: [`${productImagesBucket.bucketArn}/products/*`],
      })
    );

    const createProductLambda = new NodejsFunction(this, `${this.stackName}-create-product-lambda`, {
      runtime: lambdaRuntime.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: path.join(__dirname, '../src/lambda/products/createProduct.ts'),
      functionName: `${this.stackName}-create-product-lambda`,
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        PRODUCT_IMAGES_BUCKET_NAME: productImagesBucket.bucketName,
      },
      timeout: cdk.Duration.seconds(60),
    });

    const getAllProductsLambda = new NodejsFunction(this, `${this.stackName}-get-all-products-lambda`, {
      runtime: lambdaRuntime.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: path.join(__dirname, '../src/lambda/products/getAllProducts.ts'),
      functionName: `${this.stackName}-get-all-products-lambda`,
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
      },
    });
    const deleteProductLambda = new NodejsFunction(this, `${this.stackName}-delete-product-lambda`, {
      runtime: lambdaRuntime.Runtime.NODEJS_22_X,
      handler: 'handler',
      entry: path.join(__dirname, '../src/lambda/products/deleteProduct.ts'),
      functionName: `${this.stackName}-delete-product-lambda`,
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        PRODUCT_IMAGES_BUCKET_NAME: productImagesBucket.bucketName,
      },
    });

    productsTable.grantWriteData(createProductLambda);
    productsTable.grantReadData(getAllProductsLambda);
    productsTable.grantReadWriteData(deleteProductLambda);

    productImagesBucket.grantWrite(createProductLambda);
    productImagesBucket.grantWrite(deleteProductLambda);

    const api = new apigatewayv2.HttpApi(this, `${this.stackName}-API`, {
      apiName: `${this.stackName}-API`,
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [apigatewayv2.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
    });

    api.addRoutes({
      path: '/products',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2_integrations.HttpLambdaIntegration('CreateProductIntegration', createProductLambda),
    });

    api.addRoutes({
      path: '/products',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2_integrations.HttpLambdaIntegration('GetAllProductsIntegration', getAllProductsLambda),
    });

    api.addRoutes({
      path: '/products/{id}',
      methods: [apigatewayv2.HttpMethod.DELETE],
      integration: new apigatewayv2_integrations.HttpLambdaIntegration('DeleteProductIntegration', deleteProductLambda),
    });

    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url!,
      description: 'API Gateway URL for the products API',
      exportName: `${this.stackName}-ApiGatewayUrl`,
    });

    new cdk.CfnOutput(this, 'ProductsTableName', {
      value: productsTable.tableName,
      description: 'DynamoDB table name for products',
      exportName: `${this.stackName}-Products-TableName`,
    });

    new cdk.CfnOutput(this, 'ProductsImagesBucketName', {
      value: productImagesBucket.bucketName,
      description: 'S3 Bucket name for product images',
      exportName: `${this.stackName}-Product-Images-BucketName`,
    });
  }
}
