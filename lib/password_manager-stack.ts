import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PasswordManagerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// MARK: DEFINING THE TABLE 
     const passwordManagerTable = new dynamodb.Table(this, 'PasswordManager', {
      partitionKey: { name: 'UserId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'PasswordId', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
      tableName: 'PasswordManagerTable'
     });

    // Create a global secondary index
    passwordManagerTable.addGlobalSecondaryIndex({
      indexName: 'WebsiteIndex',
      partitionKey: { name: 'Website', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });
   
    /// MARK: DEFINING API GATEWAY
    const getWay = new apigateway.RestApi(this, 'PasswordManagerAPI', {});

    // Gateway GET all saved passwords
    getWay.root
    .addResource('passwords') // to get a list of all passwords
    .addMethod('GET')

    // Add password
    getWay.root
    .addResource('save') // Saves a new password
    .addMethod('POST')

    /// MARK: LAMBDA CONSTRUCT
    new lambda.Function(this, 'PasswordManagerLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'passwordHandler.lambdaHandler',
      code: lambda.Code.fromAsset('src/lambda'),

    })
  

    
  

  }
}
