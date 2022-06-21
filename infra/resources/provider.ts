import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

const awsConfig = new pulumi.Config('aws');
const assumeRole = awsConfig.require('assume-role');
const sessionName = awsConfig.require('sessionName');

let provider: aws.Provider;

export function getProvider() {
  if (provider) return provider;

  provider = new aws.Provider('privileged', {
    assumeRole: {
      roleArn: assumeRole,
      sessionName,
    },
    region: aws.config.requireRegion(),
  });

  return provider;
}
