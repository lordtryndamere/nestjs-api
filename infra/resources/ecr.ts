import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

import { getProvider } from './provider';
import { getTags } from './tags';

const stack = pulumi.getStack();
const project = pulumi.getProject();

export function CreateEcr(): awsx.ecr.Repository {
  const repositoryName = `app-${project}-ecr-${stack}`;
  const prod_retention_count = 10;
  const image_retention_days = 30;
  const provider = getProvider();
  const tags = getTags();

  const rules: awsx.ecr.LifecyclePolicyRule[] = [];

  if (stack === 'prd')
    rules.push({
      description: `Keep ${prod_retention_count} ${stack} images`,
      selection: 'any',
      maximumNumberOfImages: prod_retention_count,
    });
  else
    rules.push({
      description: `Expire images older than ${image_retention_days} days`,
      selection: 'any',
      maximumAgeLimit: image_retention_days,
    });

  const repository = new awsx.ecr.Repository(
    'ecrRepository',
    {
      repository: new aws.ecr.Repository(
        repositoryName,
        {
          name: repositoryName,
          tags,
        },
        {
          provider,
        },
      ),
      lifeCyclePolicyArgs: {
        rules,
      },
      tags,
    },
    {
      provider,
    },
  );

  return repository;
}
