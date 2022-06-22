import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { CreateAlbSecurityGroup } from './security-groups';
import { getProvider } from './provider';
import { getTags } from './tags';

const project = pulumi.getProject();

const awsConfig = new pulumi.Config('aws');
const privateSubnets = awsConfig.require('privateSubnets');

const projectConfig = new pulumi.Config('project');
const moduleType = projectConfig.require('moduleType');

export function CreateAlb(): aws.lb.LoadBalancer {
  const provider = getProvider();
  const securityGroup = CreateAlbSecurityGroup([9000]);
  const tags = getTags();

  const alb = new aws.lb.LoadBalancer(
    'loadBalancer',
    {
      name: `${moduleType}-${project}-alb`,
      loadBalancerType: 'application',
      subnets: privateSubnets.split(','),
      securityGroups: [securityGroup.id],
      internal: true,
      tags,
    },
    { provider },
  );

  return alb;
}
