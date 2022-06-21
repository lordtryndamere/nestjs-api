import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { getProvider } from './provider';
import { getTags } from './tags';

const stack = pulumi.getStack();
const project = pulumi.getProject();
const provider = getProvider();

export function getDynamodb(): aws.dynamodb.Table {
  const tableName = `${project}-${stack}-table`;
  const tags = getTags();

  const table = new aws.dynamodb.Table(
    'ddbTable',
    {
      name: tableName,
      attributes: [
        {
          name: 'id',
          type: 'S',
        },
        {
          name: 'sk',
          type: 'S',
        },
        {
          name: 'identifier',
          type: 'S',
        },
      ],
      billingMode: 'PAY_PER_REQUEST',
      globalSecondaryIndexes: [
        {
          name: 'identifier_index',
          hashKey: 'identifier',
          rangeKey: 'sk',
          projectionType: 'ALL',
          readCapacity: 10,
          writeCapacity: 10,
        },
      ],
      hashKey: 'id',
      rangeKey: 'sk',
      streamEnabled: false,
      tags,
    },
    { provider },
  );

  return table;
}
