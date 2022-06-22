import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { getProvider } from './provider';
import { getTags } from './tags';

const awsConfig = new pulumi.Config('aws');
const tags = getTags();
const provider = getProvider();

const privateSubnetZones = awsConfig.require('privateSubnets');

export function createAuroraSubnetGroup(
  dbSubnetGroupName: string,
): aws.rds.SubnetGroup {
  const subnetGroup = new aws.rds.SubnetGroup(
    'serverlessSubnetGroup',
    {
      name: dbSubnetGroupName,
      subnetIds: privateSubnetZones.split(','),
      tags,
    },
    { provider },
  );

  return subnetGroup;
}
