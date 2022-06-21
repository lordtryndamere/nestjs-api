import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { CreateFargateRole } from './iam';
import { getProvider } from './provider';
import { CreateFargateSecurityGroup } from './security-groups';
import { getTags } from './tags';

const awsConfig = new pulumi.Config('aws');
const ecsConfig = new pulumi.Config('ecs');

const region = awsConfig.require('region');
const privateSubnets = awsConfig.require('privateSubnets');

const numberNodes = ecsConfig.getNumber('numberNodes');
const containerPort = ecsConfig.requireNumber('containerPort');
const cpu = ecsConfig.require('cpu');
const memory = ecsConfig.require('memory');

const stack = pulumi.getStack();
const project = pulumi.getProject();
const tags = getTags();

function CreateAutoScaling(
  cluster: aws.ecs.Cluster,
  service: aws.ecs.Service,
  provider: aws.Provider,
): void {
  const ecsTarget = new aws.appautoscaling.Target(
    'ecsTarget',
    {
      serviceNamespace: 'ecs',
      scalableDimension: 'ecs:service:DesiredCount',
      resourceId: pulumi.interpolate`service/${cluster.name}/${service.name}`,
      minCapacity: 1,
      maxCapacity: 5,
    },
    { provider },
  );

  new aws.appautoscaling.Policy(
    'ecsPolicyMemory',
    {
      name: `app-${project}-ecs-policy-memory`,
      policyType: 'TargetTrackingScaling',
      resourceId: ecsTarget.resourceId,
      scalableDimension: ecsTarget.scalableDimension,
      serviceNamespace: ecsTarget.serviceNamespace,
      targetTrackingScalingPolicyConfiguration: {
        predefinedMetricSpecification: {
          predefinedMetricType: 'ECSServiceAverageMemoryUtilization',
        },
        targetValue: 70,
      },
    },
    {
      provider,
    },
  );

  new aws.appautoscaling.Policy(
    'ecsPolicyCpu',
    {
      name: `app-${project}-ecs-policy-cpu`,
      policyType: 'TargetTrackingScaling',
      resourceId: ecsTarget.resourceId,
      scalableDimension: ecsTarget.scalableDimension,
      serviceNamespace: ecsTarget.serviceNamespace,
      targetTrackingScalingPolicyConfiguration: {
        predefinedMetricSpecification: {
          predefinedMetricType: 'ECSServiceAverageCPUUtilization',
        },
        targetValue: 70,
      },
    },
    {
      provider,
    },
  );
}

export function CreateFargate(
  database: aws.dynamodb.Table,
  targetGroup: aws.lb.TargetGroup,
  imageUri: pulumi.Output<string>,
): [aws.ecs.Cluster, pulumi.Output<aws.ecs.TaskDefinition>, aws.ecs.Service] {
  const provider = getProvider();
  const securityGroup = CreateFargateSecurityGroup();
  const [executionRole, taskRole] = CreateFargateRole(database);

  const logGroup = new aws.cloudwatch.LogGroup(
    'logGroup',
    {
      name: `/ecs/td-${project}-${stack}`,
      retentionInDays: 30,
      tags,
    },
    { provider },
  );

  const cluster = new aws.ecs.Cluster(
    'cluster',
    {
      name: `app-${project}-ecs-cluster`,
      capacityProviders: ['FARGATE'],
      settings: [
        {
          name: 'containerInsights',
          value: 'enabled',
        },
      ],
      tags,
    },
    { provider },
  );

  const taskDefinition = pulumi
    .all([imageUri, logGroup.name, database.name, region])
    .apply(
      ([image, logGroupName, databaseName, awsRegion]) =>
        new aws.ecs.TaskDefinition(
          `td-${project}-${stack}`,
          {
            family: `td-${project}-${stack}`,
            requiresCompatibilities: ['FARGATE'],
            taskRoleArn: taskRole.arn,
            executionRoleArn: executionRole.arn,
            networkMode: 'awsvpc',
            cpu,
            memory,
            containerDefinitions: JSON.stringify([
              {
                name: `${project}-${stack}`,
                image,
                essential: true,
                portMappings: [
                  {
                    containerPort,
                    hostPort: containerPort,
                  },
                ],
                environment: [
                  { name: 'ENVIRONMENT', value: stack.toUpperCase() },
                  {
                    name: 'NODE_ENV',
                    value:
                      stack.toUpperCase() == 'PRD'
                        ? 'production'
                        : 'development',
                  },
                  { name: 'DDB_TABLE_NAME', value: databaseName },
                  { name: 'PORT', value: `${containerPort}` },
                  { name: 'AWS_REGION', value: awsRegion },
                  { name: 'APP_TITLE', value: 'Patients API' },
                  {
                    name: 'APP_DESCRIPTION',
                    value: 'It exposes all patients where Auna has presecense.',
                  },
                  { name: 'APP_VERSION', value: '1.0' },
                ],
                logConfiguration: {
                  logDriver: 'awslogs',
                  options: {
                    'awslogs-group': logGroupName,
                    'awslogs-region': region,
                    'awslogs-stream-prefix': 'ecs',
                  },
                },
              },
            ]),
            tags,
          },
          { provider, dependsOn: [database] },
        ),
    );

  const service = new aws.ecs.Service(
    `service-${project}-${stack}`,
    {
      name: `app-${project}-ecs-service`,
      launchType: 'FARGATE',
      taskDefinition: taskDefinition.arn,
      cluster: cluster.arn,
      desiredCount: numberNodes,
      forceNewDeployment: true,
      healthCheckGracePeriodSeconds: 120,
      networkConfiguration: {
        securityGroups: [securityGroup.id],
        subnets: privateSubnets.split(','),
        assignPublicIp: false,
      },
      loadBalancers: [
        {
          targetGroupArn: targetGroup.arn,
          containerName: `${project}-${stack}`,
          containerPort: containerPort,
        },
      ],
      propagateTags: 'SERVICE',
      tags,
    },
    { provider, dependsOn: [targetGroup] },
  );

  CreateAutoScaling(cluster, service, provider);

  return [cluster, taskDefinition, service];
}
