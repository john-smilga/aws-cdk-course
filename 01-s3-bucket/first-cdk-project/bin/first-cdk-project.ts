#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FirstCdkProjectStack } from '../lib/first-cdk-project-stack';

const app = new cdk.App();
new FirstCdkProjectStack(app, 'FirstCdkProjectStack', {});
