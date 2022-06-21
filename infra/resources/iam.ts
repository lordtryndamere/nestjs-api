import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { getProvider } from './provider';
import { getTags } from './tags';

const project = pulumi.getProject();
const tags = getTags();

export function CreateFargateRole(
  database: aws.dynamodb.Table,
): [aws.iam.Role, aws.iam.Role] {
  const provider = getProvider();

  const executionRole = new aws.iam.Role(
    'taskExecutionRole',
    {
      name: `app-${project}-task-execution-role`,
      assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(
        aws.iam.Principals.EcsTasksPrincipal,
      ),
      tags,
    },
    { provider },
  );

  new aws.iam.RolePolicyAttachment(
    'taskExecutionRoleAttachment',
    {
      role: executionRole,
      policyArn: aws.iam.ManagedPolicy.AmazonECSTaskExecutionRolePolicy,
    },
    { provider },
  );

  const taskRole = new aws.iam.Role(
    'taskRole',
    {
      name: `app-${project}-task-role`,
      assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(
        aws.iam.Principals.EcsTasksPrincipal,
      ),
      tags,
    },
    { provider },
  );

  new aws.iam.RolePolicy(
    'taskRolePolicy',
    {
      role: taskRole.id,
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['logs:DescribeLogGroups'],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: [
              'logs:CreateLogStream',
              'logs:CreateLogGroup',
              'logs:DescribeLogStreams',
              'logs:PutLogEvents',
            ],
            Resource: '*',
          },
          {
            Sid: 'CanReadDynamoDbTable',
            Action: [
              'dynamodb:BatchGet*',
              'dynamodb:DescribeStream',
              'dynamodb:DescribeTable',
              'dynamodb:Get*',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:BatchWrite*',
              'dynamodb:CreateTable',
              'dynamodb:Delete*',
              'dynamodb:Update*',
              'dynamodb:PutItem',
            ],
            Effect: 'Allow',
            Resource: [
              database.arn.apply((_value) => `${_value}`),
              database.arn.apply((_value) => `${_value}/*`),
            ],
          },
        ],
      },
    },
    { provider },
  );

  return [executionRole, taskRole];
}

export function CreateIamUser(): [aws.iam.User, aws.iam.AccessKey] {
  const provider = getProvider();

  const user = new aws.iam.User(
    'user',
    {
      name: `app-${project}-user`,
      path: '/',
      tags,
    },
    { provider },
  );

  const accessKey = new aws.iam.AccessKey(
    'accessKey',
    {
      user: user.name,
    },
    { provider },
  );

  new aws.iam.UserPolicy(
    'ecsTaskUserPolicy',
    {
      user: user.name,
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: '*',
          },
        ],
      },
    },
    { provider },
  );

  return [user, accessKey];
}
