import * as pulumi from '@pulumi/pulumi';

const stack = pulumi.getStack();
const project = pulumi.getProject();

export function getTags(): { [key: string]: string } {
  return {
    CostCenter: '5010211025',
    Area: 'AunaDigital',
    Environment: stack,
    Team: 'PODIEHR',
    Project: project,
  };
}
