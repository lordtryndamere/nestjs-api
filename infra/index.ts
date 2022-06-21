import { CreateAlb } from './resources/alb';
import { getDynamodb } from './resources/dynamodb';
import { CreateEcr } from './resources/ecr';
import { CreateFargate } from './resources/fargate';
import { CreateIamUser } from './resources/iam';

CreateIamUser();
const [alb, tg] = CreateAlb();
const dynamoTable = getDynamodb();
const apiEcr = CreateEcr();
const [cluster, taskDefinition, service] = CreateFargate(
  dynamoTable,
  tg,
  apiEcr.repository.repositoryUrl.apply(
    (_value) => `${_value}:${process.env.SHORT_COMMIT || ':latest'}`,
  ),
);

export const albEndpoint = alb.dnsName;
export const dynamoTableArn = dynamoTable.arn;
export const apiEcrUrl = apiEcr.repository.repositoryUrl;
export const clusterArn = cluster.arn;
export const taskDefinitionArn = taskDefinition.arn;
export const serviceUrn = service.urn;
