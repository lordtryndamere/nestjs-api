import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { getProvider } from './provider';
import { getTags } from './tags';

const tags = getTags();
const provider = getProvider();
const project = pulumi.getProject();

const engine = 'aurora-mysql';
const dbUser = 'root';

const projectConfig = new pulumi.Config('project');
const moduleType = projectConfig.require('moduleType');

export function CreateAuroraServerless(
  name: string,
  minCapacity: number,
  maxCapacity: number,
  securityGroup: aws.ec2.SecurityGroup,
  dbPassword: string,
  dbSubnetGroupName: string,
): aws.rds.Cluster {
  const cluster = new aws.rds.Cluster(
    `${name}-serverlessCluster`,
    {
      clusterIdentifier: `${moduleType}-${project}-rds-${name}`,
      dbSubnetGroupName,
      engine,
      copyTagsToSnapshot: true,
      engineMode: 'serverless',
      masterUsername: dbUser,
      masterPassword: dbPassword,
      vpcSecurityGroupIds: [securityGroup.id],
      skipFinalSnapshot: true,
      scalingConfiguration: {
        autoPause: true,
        maxCapacity: maxCapacity,
        minCapacity: minCapacity,
        secondsUntilAutoPause: 1800,
      },
      tags,
    },
    { provider },
  );

  return cluster;
}
