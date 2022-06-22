import * as pulumi from '@pulumi/pulumi';

import { CreateAuroraServerless } from './resources/aurora';
import { createAuroraSubnetGroup } from './resources/aurora-configurations';
import { CreateMysqlSecurityGroup } from './resources/security-groups';
import { CreateEcsCluster } from './resources/ecs';
import { CreateAlb } from './resources/alb';
import { CreateEcr } from './resources/ecr';

const project = pulumi.getProject();
const dbConfig = new pulumi.Config('db');

const projectConfig = new pulumi.Config('project');
const moduleType = projectConfig.require('moduleType');

const dbSubnetGroupName = `${moduleType}-${project}-rds-sng`;
createAuroraSubnetGroup(dbSubnetGroupName);

const usersAllowSecurityGroups = dbConfig.require('usersSecurityGroupList');

const usersDbPassword = dbConfig.require('usersPassword');

const usersSecurityGroup = CreateMysqlSecurityGroup(
  `users`,
  usersAllowSecurityGroups ? usersAllowSecurityGroups.split(',') : [],
);

const usersAuroraServerless = CreateAuroraServerless(
  `users`,
  1,
  2,
  usersSecurityGroup,
  usersDbPassword,
  dbSubnetGroupName,
);

const ecsCluster = CreateEcsCluster(`${moduleType}-${project}-ecs`);
const apiEcr = CreateEcr();
const applicationLoadBalancer = CreateAlb();

export const albEndpoint = applicationLoadBalancer.dnsName;
export const ecsClusterArn = ecsCluster.arn;
export const usersAuroraServerlessEndpoint = usersAuroraServerless.endpoint;
export const apiEcrUrl = apiEcr.repository.repositoryUrl;
