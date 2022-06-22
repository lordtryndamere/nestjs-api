import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { getProvider } from './provider';
import { getVpc } from './vpc';
import { getTags } from './tags';

const project = pulumi.getProject();
const provider = getProvider();
const vpc = getVpc();
const projectConfig = new pulumi.Config('project');
const moduleType = projectConfig.require('moduleType');

export function CreateMysqlSecurityGroup(
  name: string,
  securityGroupsList: string[],
): aws.ec2.SecurityGroup {
  const tags = getTags();
  tags['Name'] = `SG_${project.toUpperCase()}_${name.toUpperCase()}_AURORA`;

  const auroraSecurityGroup = new aws.ec2.SecurityGroup(
    `${name}-auroraSecurityGroup`,
    {
      name: `${moduleType}-${project}-sg-${name}`,
      description: `${name.toUpperCase()} - Aurora Security Group`,
      vpcId: vpc.id,
      ingress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: '-1',
          cidrBlocks: ['0.0.0.0/0'],
          ipv6CidrBlocks: ['::/0'],
        },
      ],
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: '-1',
          cidrBlocks: ['0.0.0.0/0'],
          ipv6CidrBlocks: ['::/0'],
        },
      ],
      tags,
    },
    { provider },
  );

  if (securityGroupsList.length > 0) {
    securityGroupsList.forEach((v, k) => {
      new aws.ec2.SecurityGroupRule(
        `${name}-${k}-SecurityGroupRule`,
        {
          type: 'ingress',
          fromPort: 3306,
          toPort: 3306,
          protocol: 'tcp',
          securityGroupId: auroraSecurityGroup.id,
          sourceSecurityGroupId: v,
        },
        { provider },
      );
    });
  } else {
    new aws.ec2.SecurityGroupRule(
      `${name}-SecurityGroupRule`,
      {
        type: 'ingress',
        fromPort: 3306,
        toPort: 3306,
        protocol: 'tcp',
        cidrBlocks: ['0.0.0.0/0'],
        securityGroupId: auroraSecurityGroup.id,
      },
      { provider },
    );
  }

  return auroraSecurityGroup;
}

export function CreateAlbSecurityGroup(portNumberList: number[]) {
  const tags = getTags();

  tags['Name'] = `SG_${project.toUpperCase()}_ALB`;

  const albSecurityGroup = new aws.ec2.SecurityGroup(
    'albSecurityGroup',
    {
      name: `${moduleType}-${project}-sg`,
      description: `${project.toUpperCase()} - ALB Security Group`,
      vpcId: vpc.id,
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: '-1',
          cidrBlocks: ['0.0.0.0/0'],
          ipv6CidrBlocks: ['::/0'],
        },
      ],
      tags,
    },
    { provider },
  );

  portNumberList.forEach((v, k) => {
    new aws.ec2.SecurityGroupRule(
      `${k}-SecurityGroupRule`,
      {
        type: 'ingress',
        fromPort: v,
        toPort: v,
        protocol: 'tcp',
        securityGroupId: albSecurityGroup.id,
        cidrBlocks: ['0.0.0.0/0'],
      },
      { provider },
    );
  });

  return albSecurityGroup;
}
