import * as pulumi from '@pulumi/pulumi';

const stack = pulumi.getStack();
const project = pulumi.getProject();

export function getTags(): { [key: string]: string } {
  return {
    CostCenter: '501A000400',
    Area: 'AunaDigital',
    Environment: stack,
    Team: 'CommonComponents',
    Project: project,
  };
}
