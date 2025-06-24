# AWS CDK Course

AWS CDK (Cloud Development Kit) is a developer-friendly framework that lets you define cloud infrastructure using programming languages like TypeScript or Python, instead of writing CloudFormation templates directly. It synthesizes your code into CloudFormation templates, giving you the best of both worlds: the ease of programming in your favorite language while leveraging AWS's powerful infrastructure management. As an Infrastructure as a Service (IaaS) tool, CDK enables teams to provision and manage virtualized computing resources over the internet, with AWS handling the underlying physical hardware while you focus on building your applications.

During the course, we will build the following stacks: 🏗️

1. S3 Bucket
2. Lambda + API Gateway (v2) + Secrets Manager
3. HTTP API (v2) + DynamoDB
4. SQS + API Gateway (v1)
5. EventBridge
6. Firehose
7. Cognito Auth App

# AWS CDK Course

## Setup

### Create account

To get started, you'll need to create an AWS account here - [aws account](https://aws.amazon.com/). You'll need a valid credit card to sign up, but don't worry—you can still follow along with the course without actually spending any money. During the setup process, AWS might ask you to enable multi-factor authentication (MFA). If it does, go ahead and enable it—it's a good security practice anyway.

Once your account is ready, come back and continue with the videos.Overview of AWS console.

### select region

Pick a region closest to you (or not 😀) and stick with it 😀

### setup budget

- If you want to avoid any unexpected costs, the first thing we want to do inside the AWS console is set up a budget.
- The location of this setting may change in the future, but for now, you can find it under:
- Profile
- Billing and Cost Management
- Budgets (on the left-hand side).
- From there, click **Create a budget** and follow the prompts.

### cli user

First, a quick overview — **IAM (Identity and Access Management)** is the AWS service that lets you manage access to your AWS resources securely. It allows you to create users, assign permissions, and control who can do what in your account.

Next, let's create the CLI user we'll use to deploy our resources to AWS.

- In the AWS Console, navigate to the **IAM** service.
- Click **Create user** and provide a name (e.g., `cli-user`).
- Select **Attach policies directly**, search for **AdministratorAccess**, and attach it.
- Click **Create user**.

After the user is created:

- Click **Create access key**.
- Choose **Command Line Interface (CLI)** as the use case.
- Save the **secret access key** somewhere safe — you won't be able to view it again later.

## AWS CLI and CDK Installation Commands

**AWS CLI Installation**

```bash
sudo npm install -g aws-cli
```

The AWS CLI (Command Line Interface) is a unified tool to manage your AWS services. It allows you to:

- Control multiple AWS services from the command line
- Automate the management of your AWS services through scripts
- Access AWS services programmatically
- Manage AWS resources directly from your terminal

**AWS CDK Installation**

```bash
sudo npm install -g aws-cdk
```

The AWS CDK (Cloud Development Kit) is a software development framework for defining cloud infrastructure in code and provisioning it through AWS CloudFormation. It allows you to:

- Define infrastructure using familiar programming languages (TypeScript, Python, Java, etc.)
- Use high-level constructs to define cloud components
- Deploy infrastructure as code
- Manage and version control your infrastructure
- Create reusable infrastructure patterns

Note: After installing both tools, you should verify the installations by running:

```bash
aws --version
cdk --version
```

## Configuring AWS User Credentials

**Prerequisites**

- You should have already created a CLI user in AWS Console
- You should have your:
  - Access Key ID
  - Secret Access Key
  - Preferred AWS Region (e.g., us-east-1, eu-west-1)

**Configure AWS Credentials**

Run the following command in your terminal:

```bash
aws configure
```

**Enter Your Credentials**

You'll be prompted to enter four pieces of information:

- **AWS Access Key ID**:

  - Enter the Access Key ID you received when creating the CLI user
  - Example: `AKIAIOSFODNN7EXAMPLE`

- **AWS Secret Access Key**:

  - Enter the Secret Access Key you received when creating the CLI user
  - Example: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

- **Default region name**:

  - Enter your preferred AWS region
  - Example: `us-east-1`

- **Default output format**:
  - Press Enter to use the default (json)
  - Other options: yaml, text, table

**Verify Configuration**

To verify your configuration is working, run:

```bash
aws sts get-caller-identity
```

This should return your AWS account ID, user ARN, and user ID if configured correctly.

**Where Credentials are Stored**

Your credentials are stored in:

- `~/.aws/credentials` (on Linux/Mac)
- `C:\Users\USERNAME\.aws\credentials` (on Windows)

## Create First CDK Project

- Create a new project directory named `first-cdk` on your desktop
- Navigate into the project directory and run the command `npx cdk init`

### Understanding `npx cdk init`

The `npx cdk init` command initializes a new CDK project with a specific template. It:

- Creates a new directory structure
- Sets up necessary configuration files
- Installs required dependencies
- Creates a basic CDK app structure

### Available Templates

When you run `npx cdk init`, you'll be presented with several template options:

**app** (Recommended for most cases)

- Creates a basic CDK application
- Includes TypeScript/JavaScript setup
- Best for learning and most use cases
- Command: `npx cdk init app --language typescript`

**sample-app**

- Creates a sample application with example resources
- Good for learning but might be overwhelming
- Command: `npx cdk init sample-app --language typescript`

**lib**

- Creates a CDK construct library
- Used when building reusable CDK components
- Command: `npx cdk init lib --language typescript`

The lib template is used to create reusable infrastructure components that can be shared across multiple projects, ensuring consistency and reducing code duplication.

### Recommended Choice

For your case, I recommend using the **app** template with TypeScript:

```bash
npx cdk init app --language typescript
```

### Why Choose This?

**TypeScript Benefits**

- Better type safety
- Better IDE support
- Better documentation
- Industry standard for CDK development

**App Template Benefits**

- Clean, minimal structure
- Easy to understand
- Perfect for learning
- Flexible for any type of infrastructure

## What Gets Created

After running the command, you'll get:

- `bin/` - Contains your CDK app entry point
- `lib/` - Contains your stack definitions
- `test/` - Contains your test files
- `cdk.json` - CDK configuration file
- `package.json` - Node.js dependencies
- `tsconfig.json` - TypeScript configuration

## File: lib/first-cdk-project-stack.ts

### Imports

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
```

- `aws-cdk-lib`: Main AWS CDK library containing all AWS service constructs
- `Construct`: Fundamental building block from the constructs library
- Commented SQS import shows how to import specific AWS services

### Stack Class Definition

```typescript
export class FirstCdkProjectStack extends cdk.Stack {
```

- Defines `FirstCdkProjectStack` class extending `cdk.Stack`
- A Stack is a deployment unit containing AWS resources

### Constructor

```typescript
constructor(scope: Construct, id: string, props?: cdk.StackProps) {
  super(scope, id, props);
}
```

Parameters:

- `scope`: Parent construct (usually the app)
- `id`: Unique identifier for the stack
- `props`: Optional stack properties (region, environment, etc.)
- `super()` initializes the parent stack class

## File: bin/first-cdk-project.ts

### Shebang Line

```typescript
#!/usr/bin/env node
```

- Indicates this is an executable Node.js script
- Allows the file to be run directly from the command line

### Imports

```typescript
import * as cdk from 'aws-cdk-lib';
import { FirstCdkProjectStack } from '../lib/first-cdk-project-stack';
```

- Imports the main CDK library
- Imports the stack we defined in the previous file
- Uses relative path `../lib` to access the stack definition

### App Initialization

```typescript
const app = new cdk.App();
```

- Creates a new CDK application instance
- This is the root of the CDK application
- All stacks and resources will be children of this app

### Stack Instantiation

```typescript
new FirstCdkProjectStack(app, 'FirstCdkProjectStack', {});
```

- Creates an instance of our `FirstCdkProjectStack`
- Parameters:
  - `app`: The parent CDK app
  - `'FirstCdkProjectStack'`: The stack's logical ID
  - `{}`: Empty props object (can contain stack configuration)

## Purpose

This file serves as the entry point for the CDK application. It:

1. Initializes the CDK app
2. Creates and configures the stack
3. Provides the structure for deploying the infrastructure

When you run CDK commands (like `cdk deploy`), this is the file that gets executed first.

## CDK Configuration File (cdk.json)

The `cdk.json` file is a crucial configuration file that serves as the control center for your CDK application. It defines how your CDK app is executed, contains app-wide settings, and controls various CDK behaviors. The file includes three main sections: the app entry point that specifies how to run your TypeScript code, watch mode configuration that controls which files trigger recompilation during development, and context settings that manage feature flags and default behaviors for AWS services. These settings ensure consistent behavior across team members, control security defaults, and manage the development workflow. For example, it can enforce security best practices like blocking public access to S3 buckets by default or optimize IAM policies. The file is version controlled with your code, making it easy to maintain consistent configurations across different environments and team members.

## CDK Commands

### Development Commands

**`npm run build`**

- Compiles TypeScript code to JavaScript
- Creates the `cdk.out` directory with compiled files
- Required before deployment
- Converts your TypeScript infrastructure code to executable JavaScript

**`npm run watch`**

- Watches for changes in your TypeScript files
- Automatically recompiles when changes are detected
- Useful during development
- Provides real-time feedback as you modify your infrastructure code

**`npm run test`**

- Runs Jest unit tests for your CDK code
- Validates your infrastructure code
- Ensures your CDK constructs work as expected
- Helps catch issues before deployment

### Deployment Commands

**`npx cdk deploy`**

- Deploys your stack to AWS
- Creates or updates resources in your AWS account
- Uses your default AWS credentials
- Shows deployment progress and any errors
- Can be used with `--profile` to specify different AWS profiles

**`npx cdk diff`**

- Shows differences between deployed stack and local code
- Helps understand what will change before deployment
- Useful for reviewing changes
- Shows additions, modifications, and deletions of resources

**`npx cdk synth`**

- Synthesizes CloudFormation template
- Generates the AWS CloudFormation template
- Outputs to `cdk.out` directory
- Useful for:
  - Reviewing the generated CloudFormation
  - Debugging deployment issues
  - Understanding what AWS will create
  - Manual CloudFormation deployment if needed

**cdk deploy**

When you run `npx cdk deploy`, it internally executes these commands in sequence:

**Build and Synthesize**

```bash
npm run build
npx cdk synth
```

Under the hood, `npx cdk deploy` orchestrates a complex deployment process that starts by compiling your TypeScript code and synthesizing it into a CloudFormation template. It then creates a CloudFormation change set to track all the modifications needed (new resources, updates, or deletions), compares it with your existing infrastructure, and shows you a summary of changes. After your confirmation, it executes the change set to create or update resources in your AWS account, and finally waits for all operations to complete while providing real-time feedback. This entire process is automated but can be broken down into specific AWS CLI commands that CDK executes on your behalf.

# Project 1 - S3 Bucket Stack

Amazon S3 (Simple Storage Service) is a highly scalable, secure, and durable object storage service offered by AWS. It allows you to store and retrieve any amount of data from anywhere on the web. S3 is designed to provide 99.999999999% durability and 99.99% availability of objects over a given year. It's commonly used for storing files, hosting static websites, backing up data, and serving as a data lake for big data analytics. S3 organizes data into "buckets" (containers) and "objects" (files), with each object having a unique key within its bucket. The service offers various storage classes optimized for different use cases, from frequently accessed data to long-term archival storage, and includes features like versioning, lifecycle policies, encryption, access control, and event notifications.

## AWS CDK Resources 📚

### Documentation

- [AWS CDK Docs](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
- **Description**: The official documentation provides comprehensive guides, API references, and best practices for implementing CDK in your projects, making it easier to get started and solve common challenges.

### GitHub Repository

-[AWS CKD Github Repository](https://github.com/aws/aws-cdk)

- **Description**: The GitHub repository is a goldmine for developers who want to dive deeper into the framework's implementation, contribute to its development, or stay updated with the latest features and bug fixes. It's also a great place to find examples, understand the codebase, and engage with the CDK community. 🚀

### TypeScript API Reference

- [AWS CDK TypeScript API](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
- **Description**: The AWS CDK API Reference documentation is an essential resource for developers working with CDK in TypeScript. It provides detailed information about all available constructs, methods, and properties, helping you build and customize your infrastructure with confidence. 💻

## Create New S3 Bucket

[S3 Bucket API](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.Bucket.html)

```ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class FirstCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'FirstCdkProjectBucket');
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'The name of the bucket',
    });
  }
}
```

### Import Statement

```typescript
import * as s3 from 'aws-cdk-lib/aws-s3';
```

This line imports the S3 module from the AWS CDK library, which provides constructs for creating and configuring S3 buckets.

### Bucket Creation

```typescript
const bucket = new s3.Bucket(this, 'FirstCdkProjectBucket');
```

This line creates a new S3 bucket with:

**`this` Parameter**

- The current stack instance that owns the bucket
- Determines where and how the bucket will be created in AWS
- Links the bucket to the stack's lifecycle and configuration

**`'FirstCdkProjectBucket'`**

- logical ID
- A unique identifier for the bucket in your CDK code
- Used to reference the bucket in CloudFormation and CDK
- Different from the actual AWS bucket name (which is auto-generated in this case)
- Must be unique within the stack
- The bucket is created with default settings, which means:
  - It's private (no public access)
  - Has default encryption enabled
  - Uses standard storage class
  - Has versioning disabled by default
  - Has default lifecycle rules

```ts
const bucket = new s3.Bucket(this, 'FirstCdkProjectBucket', {});
```

The third argument is an options object that can contain various configuration properties for the S3 bucket. When left empty ({}), it means we're using all the default settings for the bucket.

### CloudFormation Output

```typescript
new cdk.CfnOutput(this, 'BucketName', {
  value: bucket.bucketName,
  description: 'The name of the bucket',
});
```

This creates a CloudFormation output that:

- Exposes the bucket's name after deployment
- Can be viewed in the AWS CloudFormation console
- Can be referenced by other stacks if needed
- The `bucketName` property is automatically generated by AWS to ensure uniqueness

## CDK Build and Deployment Process

- `npm run build`
- `npx cdk synth`
- `npx cdk deploy`

### Command Behavior Differences

#### `npm run build`

- Runs TypeScript compiler directly
- Generates permanent `.js` and `.d.ts` files in:
  - `bin/` directory
  - `lib/` directory
- Files persist on disk
- Useful for development and debugging

#### `npx cdk synth`

- Runs TypeScript compilation in memory
- `cdk synth` actually runs `build` internally if needed
- No permanent JavaScript files created
- Generates CloudFormation template in `cdk.out`
- Shows what AWS resources will be created
- Good for reviewing changes before deployment

#### `npx cdk deploy`

- Runs everything in memory
- Internal sequence:
  1. Compiles TypeScript (in memory)
  2. Generates CloudFormation template
  3. Creates change set
  4. Deploys to AWS
- No permanent JavaScript files created
- Most efficient for deployment

### When to Use Each

- Use `npm run build` when:
  - Debugging TypeScript code
  - Need to see compiled JavaScript
  - Developing locally
- Use `cdk synth` when:
  - Reviewing CloudFormation template
  - Checking what will be deployed
  - Testing changes
- Use `cdk deploy` when:
  - Ready to deploy to AWS
  - Don't need to see intermediate files
  - Want the most efficient process

## CloudFormation Template in cdk.out

### What is template.json?

- A JSON file that describes your AWS infrastructure
- Generated by `cdk synth` command
- Contains all AWS resources defined in your CDK code
- Used by CloudFormation to create/update resources

### What's Inside?

- Resource definitions (like S3 buckets, IAM roles)
- Resource properties and configurations
- Dependencies between resources
- Output values (like bucket names)
- Metadata and parameters

### Purpose

- Blueprint for AWS infrastructure
- Used by CloudFormation to deploy resources
- Can be reviewed before deployment
- Helps understand what will be created

## CDK Bootstrapping

### What is Bootstrapping?

- A one-time setup process for CDK
- Creates a "bootstrap stack" in your AWS account
- Contains resources needed for CDK deployments
- Required before deploying any CDK stacks

### What Bootstrap Stack Contains

- S3 bucket for assets
- IAM roles for deployment
- ECR repositories (if needed)
- Other deployment resources

### How to Bootstrap

```bash
npx cdk bootstrap
```

### What Happens Without Bootstrap

- `npx cdk deploy` will fail
- Error message will tell you to bootstrap
- Deployment can't proceed without bootstrap stack

## Deploy and Review Bucket

After bootstrapping, deploy to AWS and review the bucket's configuration.

## Resource Removal Policies

Before we continue, let's discuss how to remove resources from the stack. In general, we have two main options. The first option is to remove the resource from your code and deploy the changes. This method involves deleting or commenting out the resource definition in your code and running `cdk deploy` to apply the changes. CloudFormation will attempt to remove the resource while keeping other resources in the stack intact. However, this may not work for resources with a RETAIN policy. The second option is to destroy the entire stack using the `npx cdk destroy` command. This will remove all resources in the stack and delete the CloudFormation stack completely. While this method is safe to use in development and testing environments, it should be used with caution in production. It's important to note that some resources may persist even after stack deletion due to their removal policy.

### Default Policies

- Some resources default to `RETAIN`:

  - S3 buckets (to prevent data loss)
  - DynamoDB tables (to protect data)
  - RDS databases (to preserve data)
  - EFS file systems (to keep files)

- Some resources default to `DESTROY`:
  - Lambda functions (stateless)
  - API Gateway (stateless)
  - CloudWatch logs (temporary)
  - SQS queues (stateless)

### Why Different Defaults?

- `RETAIN` for resources that:

  - Store important data
  - Are expensive to recreate
  - Need protection from accidental deletion
  - Have long-term value

- `DESTROY` for resources that:
  - Are stateless
  - Can be easily recreated
  - Are temporary by nature
  - Don't store critical data

### Key Point

- Default policies are AWS best practices
- Designed to prevent accidental data loss
- Can be overridden when needed
- Important to understand before deployment

## Resource Removal in Practice

In our case, even when we comment out the S3 bucket code and destroy the stack, the bucket will remain in AWS. This happens because S3 buckets default to the RETAIN policy to prevent accidental data loss. At this point, the only option is to manually delete the bucket through the AWS Console. Since I prefer not to have unused resources lingering in AWS, throughout this tutorial, I will add `applyRemovalPolicy(cdk.RemovalPolicy.DESTROY)` to all resources, even those that would be removed automatically. This ensures clean removal of resources when the stack is destroyed. However, please remember that in production environments, you need to be more careful with these settings. You might want to keep certain resources like S3 buckets around, especially if they contain important data that shouldn't be deleted automatically.

First, deploy the code with the S3 bucket configuration. Then, comment out all the code after the super() call in the constructor and deploy again - this will remove the bucket from your stack. Alternatively, you can add the bucket code, deploy it, and then run npx cdk destroy to completely remove the stack and its resources, including the bucket. Since we've set the removal policy to DESTROY, the bucket will be completely removed from AWS when you run the destroy command.

```ts
export class FirstCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'FirstCdkProjectBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    // bucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'The name of the bucket',
    });
  }
}
```

## S3 Bucket Default Configuration

- When you try to upload a file to the bucket, you'll receive an "Access Denied" error
- This is expected behavior as the bucket is private by default for security

## Common Error: Stack Deletion Failure

### Problem

When attempting to delete a CDK stack containing an S3 bucket with objects:

- The deletion fails because AWS requires buckets to be empty before removal
- The stack enters a DELETE_FAILED state
- Subsequent `cdk deploy` commands will fail due to the stack's failed state

### How to Reproduce

1. Upload some objects to your S3 bucket
2. Run `npx cdk destroy`
3. The deletion will fail because buckets must be empty before removal
4. The stack enters DELETE_FAILED state
5. Subsequent `cdk deploy` commands will fail

### Solution

1. **Immediate Fix**:

   - Log into AWS Console
   - Navigate to the S3 bucket
   - Manually delete all objects
   - Run `npx cdk destroy` again
   - Alternatively, delete the stack directly from AWS Console

2. **Prevent Future Issues**:
   - Add `autoDeleteObjects: true` to your bucket configuration
   - This will automatically empty the bucket during stack deletion

### Production Warning

⚠️ In production environments, the goal is often to preserve data. Use `RemovalPolicy.DESTROY` and `autoDeleteObjects: true` with caution, as they will permanently delete all bucket contents when the stack is destroyed. Consider using `RemovalPolicy.RETAIN` for production buckets to prevent accidental data loss.

### Development Troubleshooting

During development, it's common to encounter errors that prevent further deployments to a stack. When this happens, the stack can be manually updated or deleted through the AWS Console. This is a normal part of the development process and can be resolved by either:

- Manually updating the problematic resources in AWS Console
- Deleting the entire stack and redeploying from scratch

## Common Error: Stack Creation Failed

### How to Reproduce

1. Remove the existing stack
2. Add code after the first bucket that will generate an error
3. Fix the error in your code
4. Subsequent deployments will fail because the bucket resource already exists in AWS

### Solution

1. **Immediate Fix**:

   - Log into AWS Console
   - Navigate to the S3 bucket
   - Manually delete it

## Second Bucket

```ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class FirstCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucket = new s3.Bucket(this, 'FirstCdkProjectBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const bucket2 = new s3.Bucket(this, 'MySecondCdkBucket', {
      bucketName: 'my-second-cdk-bucket-1234',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      autoDeleteObjects: true,
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
    });
    // bucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'The name of the bucket',
    });
    new cdk.CfnOutput(this, 'BucketName2', {
      value: bucket2.bucketName,
      description: 'The name of the bucket',
    });
  }
}
```

### Bucket Configuration Properties Explained

- `bucketName`: Explicitly sets the bucket name. Must be globally unique across all AWS accounts

- `websiteIndexDocument`: Enables static website hosting and sets the default page
- `websiteErrorDocument`: (optional) Sets the error page for the website

- `publicReadAccess`: Enables public read access to bucket objects
- `blockPublicAccess`: Fine-grained control over public access:

  - `blockPublicAcls`: Blocks public ACLs on objects
  - `blockPublicPolicy`: Blocks public bucket policies
  - `ignorePublicAcls`: Ignores public ACLs on objects
  - `restrictPublicBuckets`: Restricts public bucket access

## Deploy The Stack

- Deploy the stack and upload `index.html` and `main.css` from `website` folder
- Properties -> Static website hosting -> bucket website endpoint

# Project 2 - Lambda + API Gateway (v2) + Secrets Manager Stack

**AWS Lambda** is a serverless computing service that lets you run code without managing servers. You simply upload your code and AWS handles the infrastructure, automatically scaling up or down based on demand. Lambda functions are triggered by events like HTTP requests, file uploads, or database changes, making them perfect for building responsive applications that only pay for the compute time they actually use.

**API Gateway** is a fully managed service that makes it easy to create, publish, and manage APIs at any scale. It acts as a front door for your applications, handling incoming HTTP requests and routing them to the appropriate backend services like Lambda functions. API Gateway handles common tasks like authentication, rate limiting, and CORS (Cross-Origin Resource Sharing), so you can focus on building your application logic instead of managing API infrastructure.

**Secrets Manager** is a service that helps you protect sensitive information like database passwords, API keys, and other credentials. Instead of hardcoding secrets in your application code (which is a security risk), Secrets Manager securely stores them and provides a simple way to retrieve them when needed. It automatically rotates credentials on a schedule, reducing the risk of security breaches and ensuring your applications always use up-to-date credentials.

## Create a Project

On the desktop, create the project `lambda`, open it, and run `npx cdk init`. Pick "app" and run the command.

## Create First Lambda - Logic

- create `src/lambda/handler.ts`

```ts
export const lambdaExample = async (event: any) => {
  console.log('TEMP Event log', event);
  return {
    message: 'Hello World',
  };
};
```

1. Handler Function

- **Must be exported**: `export const lambdaExample` - AWS Lambda needs to access this function
- **Function name**: Can be any valid identifier, but should be descriptive
- **Async handler recommended**: For Node.js Lambdas, it's recommended to use an `async` handler (or return a Promise) to ensure the return value is properly handled by the Lambda runtime and tools like the Lambda console. Synchronous handlers may result in `null` responses in some cases.
- **Event parameter**: Required - Lambda always receives an event object containing trigger data

2. Event Parameter

- **Purpose**: Contains all data from the trigger source (API Gateway, S3, DynamoDB, etc.)
- **Structure**: Varies based on trigger type (API Gateway events have different structure than S3 events)
- **Type**: `any` is acceptable but not ideal for production

3. Response Format

- **Must return**: A JSON-serializable object
- **API Gateway integration**: Response should include status code and headers if needed
- **Error handling**: Should handle exceptions and return appropriate error responses

4. Logging

- **`console.log()`**: Automatically goes to CloudWatch logs
- **Best practice**: Log important events for debugging and monitoring
- **Security**: Be careful not to log sensitive data

## Create First Lambda - Stack

`stack`

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

const exampleLambda = new NodejsFunction(this, 'ExampleHandler', {
  runtime: lambda.Runtime.NODEJS_22_X,
  entry: path.join(__dirname, '../src/lambda/handler.ts'),
  handler: 'lambdaExample',
  functionName: 'cdk-course-example-lambda',
});
new cdk.CfnOutput(this, 'ExampleLambdaArn', {
  value: exampleLambda.functionArn,
  description: 'The ARN of the example lambda function',
});
```

## Code Explanation

This code creates an AWS Lambda function using AWS CDK with the `NodejsFunction` construct:

- **`NodejsFunction`**: Specialized construct for Node.js Lambda functions that automatically bundles TypeScript/JavaScript code
- **`runtime: lambda.Runtime.NODEJS_22_X`**: Specifies Node.js 22.x runtime environment
- **`entry: path.join(__dirname, '../src/handler.ts')`**: Points to the TypeScript source file
- **`handler: 'lambdaExample'`**: References the exported function name from the handler file
- **`functionName: 'cdk-course-example-lambda'`**: Sets a custom name for the Lambda function
- **`CfnOutput`**: Creates a CloudFormation output to display the Lambda ARN after deployment
- **ARN (Amazon Resource Name)**: Unique identifier for AWS resources - format: `arn:aws:lambda:region:account:function:name` - used for IAM permissions, cross-service references, and resource identification
- **esbuild requirement**: `NodejsFunction` uses esbuild to bundle TypeScript code into JavaScript - without esbuild installed, the bundling process will fail during deployment because CDK cannot compile TypeScript files into the JavaScript that Lambda runtime expects

## Multiple Ways to Create Lambda in CDK

- **`NodejsFunction`**: Best for TypeScript/JavaScript - auto-bundles code, handles dependencies
- **`lambda.Function`**: Basic construct for any runtime - requires manual bundling
- **`lambda.DockerImageFunction`**: Uses Docker containers for custom runtimes
- **`lambda.SingletonFunction`**: Ensures only one instance exists across deployments
- **`lambda.Version`**: Creates versioned Lambda functions for blue/green deployments

## esbuild

- try running `npx cdk synth`, if everything is correct you will get an error.
- run `npm i esbuild`

## Deploy the stack

- run `npx cdk deploy`

## Lambda GUI

### Test Event

### Automatic CloudWatch Log Group

A Log Group is a logical container in AWS CloudWatch that holds related log streams. Think of it as a folder that organizes logs from the same source or application. Each Log Group can contain multiple Log Streams, which are the actual sequences of log events. Log Streams are the individual log files within a Log Group - each Lambda function invocation creates a new Log Stream, and all the console.log statements, errors, and execution details from that specific invocation are written to that stream. This allows you to trace the complete execution of a single Lambda function call from start to finish. For Lambda functions, AWS automatically creates one Log Group per function, and each function execution creates a new Log Stream within that Log Group. This hierarchical structure allows you to easily filter, search, and analyze logs from specific functions while maintaining organization across your entire application's logging infrastructure. Every AWS Lambda function automatically creates a CloudWatch Log Group with the naming convention `/aws/lambda/{function-name}`. This log group captures all console output, errors, and execution details from your Lambda function. When you use `console.log()` in your handler, the messages are automatically sent to this log group, providing real-time visibility into function execution, debugging capabilities, and performance monitoring. The log group retains logs based on your retention settings and can be configured to automatically expire old log entries to manage storage costs.

## API Gateway Intro

## Home Route Lambda

- run `npm install --save-dev @types/aws-lambda`

`handler.ts`

```ts
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const lambdaExample = async (event: any) => {
  console.log('TEMP Event log', event);
  return {
    message: 'Hello World',
  };
};

export const homeRoute = async (event: APIGatewayProxyEventV2) => {
  console.log('Home Route Event log', event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Welcome to the API!',
    }),
  };
};
```

## Create API Gateway

`stack`

```ts
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigateway_integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const homeLambda = new NodejsFunction(this, 'HomeHandler', {
  runtime: lambda.Runtime.NODEJS_22_X,
  entry: path.join(__dirname, '../src/lambda/handler.ts'),
  handler: 'homeRoute',
  functionName: `${this.stackName}-home-route-lambda`,
});
// Create HTTP API (API Gateway v2)
const httpApi = new apigateway.HttpApi(this, 'FirstApi', {
  apiName: 'First Api',
  description: 'First Api with CDK',
});

// Create routes
httpApi.addRoutes({
  path: '/',
  methods: [apigateway.HttpMethod.GET],
  integration: new apigateway_integrations.HttpLambdaIntegration('HomeIntegration', homeLambda),
});

new cdk.CfnOutput(this, 'HttpApiUrl', {
  value: httpApi.url ?? '',
  description: 'HTTP API URL',
});
```

This code creates an HTTP API using API Gateway v2 and connects it to a Lambda function:

- An HTTP API resource is created with a specified name and description, serving as the entry point for your RESTful API.
- A route is added for the root path ("/") that listens for HTTP GET requests. This route is integrated with a Lambda function, so whenever a GET request is made to the root path, API Gateway invokes the Lambda.
- The integration uses a construct that connects the API Gateway route directly to the Lambda function, allowing the Lambda to process incoming HTTP requests and return responses.
- After deployment, the URL of the HTTP API is output, making it easy to find and test your new API endpoint.

## POST Route

`handler.ts`

```ts
export const createProfileRoute = async (event: APIGatewayProxyEventV2) => {
  console.log('event : ', event);
  const body = JSON.parse(event.body ?? '{}');

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Profile created successfully',
      username: body.username,
    }),
  };
};
```

`stack.ts`

```ts
const createProfileLambda = new NodejsFunction(this, 'ProfileHandler', {
  runtime: lambda.Runtime.NODEJS_22_X,
  entry: path.join(__dirname, '../src/lambda/handler.ts'),
  handler: 'createProfileRoute',
  functionName: `${this.stackName}-profile-lambda`,
});

httpApi.addRoutes({
  path: '/profile',
  methods: [apigateway.HttpMethod.POST],
  integration: new apigateway_integrations.HttpLambdaIntegration('ProfileIntegration', createProfileLambda),
});
```

## REST Client Extension

[Docs](https://open-vsx.org/extension/humao/rest-client)

- install extension
- create file `makeRequests.http`

```ts
@URL = your url

### Get Home Route
GET {{URL}}

### Create Profile
POST {{URL}}/profile
Content-Type: application/json

{
    "username": "John Doe"
}
```

## CORS Error

- navigate to the the front-end app (course repo)
- spin up the app `npm install && npm run dev`
- if everything is correct, you will hit the error

`stack.ts`

```ts
const httpApi = new apigateway.HttpApi(this, 'FirstApi', {
  apiName: 'First Api',
  description: 'First Api with CDK',
  corsPreflight: {
    allowOrigins: ['*'],
    allowMethods: [apigateway.CorsHttpMethod.ANY],
    allowHeaders: ['*'],
  },
});
```

## ENV Variables

`handler.ts`

```ts
export const welcomeRoute = async (event: APIGatewayProxyEventV2) => {
  const username = process.env.USERNAME;
  const message = username ? `Welcome ${username}!` : 'Welcome to the API!';

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };
};
```

`stack`

```ts
const welcomeLambda = new NodejsFunction(this, 'WelcomeHandler', {
  runtime: lambda.Runtime.NODEJS_22_X,
  entry: path.join(__dirname, '../src/lambda/handler.ts'),
  handler: 'welcomeRoute',
  functionName: `${this.stackName}-welcome-route-lambda`,
});

httpApi.addRoutes({
  path: '/welcome',
  methods: [apigateway.HttpMethod.GET],
  integration: new apigateway_integrations.HttpLambdaIntegration('WelcomeIntegration', welcomeLambda),
});
```

`makeRequests.http`

```ts
### Get Welcome Route
GET {{URL}}/welcome
```

- add ENV Variable in AWS Lambda GUI (useful for testing)

## ENV Variables in CDK

```ts
const welcomeLambda = new NodejsFunction(this, 'WelcomeHandler', {
  runtime: lambda.Runtime.NODEJS_22_X,
  entry: path.join(__dirname, '../src/lambda/handler.ts'),
  handler: 'welcomeRoute',
  functionName: `${this.stackName}-welcome-route-lambda`,
  environment: {
    USERNAME: 'ShakeAndBake',
  },
});
// welcomeLambda.addEnvironment('USERNAME', 'ShakeAndBake');
```
