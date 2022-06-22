import * as aws from '@pulumi/aws';
//import * as pulumi from '@pulumi/pulumi';
import { getProvider } from './provider';
import { getTags } from './tags';

const tags = getTags();
const provider = getProvider();

export function CreateEcsCluster(name: string): aws.ecs.Cluster {
  const cluster = new aws.ecs.Cluster(
    'cluster',
    {
      name,
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

  return cluster;
}
