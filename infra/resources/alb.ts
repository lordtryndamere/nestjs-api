import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { getProvider } from './provider';
import { CreateAlbSecurityGroup } from './security-groups';
import { getTags } from './tags';
import { getVpc } from './vpc';

const project = pulumi.getProject();

const awsConfig = new pulumi.Config('aws');
const ecsConfig = new pulumi.Config('ecs');

const privateSubnets = awsConfig.require('privateSubnets');

const containerPort = ecsConfig.requireNumber('containerPort');
const healthCheck = ecsConfig.require('healthCheck');

export function CreateAlb(): [aws.lb.LoadBalancer, aws.lb.TargetGroup] {
  const provider = getProvider();
  const securityGroup = CreateAlbSecurityGroup();
  const vpc = getVpc();
  const tags = getTags();

  const alb = new aws.lb.LoadBalancer(
    'loadBalancer',
    {
      name: `app-${project}-alb`,
      loadBalancerType: 'application',
      subnets: privateSubnets.split(','),
      securityGroups: [securityGroup.id],
      internal: true,
      tags,
    },
    { provider },
  );

  const tg = new aws.lb.TargetGroup(
    'targetGroup',
    {
      name: `app-${project}-tg-microservice`,
      port: containerPort,
      protocol: 'HTTP',
      vpcId: vpc.id,
      targetType: 'ip',
      healthCheck: {
        healthyThreshold: 3,
        interval: 30,
        protocol: 'HTTP',
        matcher: '200',
        timeout: 5,
        path: healthCheck,
        port: `${containerPort}`,
        unhealthyThreshold: 2,
      },
      tags,
    },
    { provider },
  );

  new aws.lb.Listener(
    'listener',
    {
      loadBalancerArn: alb.arn,
      port: containerPort,
      protocol: 'HTTP',
      defaultActions: [
        {
          type: 'forward',
          targetGroupArn: tg.arn,
        },
      ],
      tags,
    },
    { provider },
  );

  return [alb, tg];
}
