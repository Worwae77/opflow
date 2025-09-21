import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class Jenkins implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Jenkins',
    name: 'jenkins',
    group: ['automation'],
    version: 1,
    description: 'Interact with Jenkins API',
    defaults: {
      name: 'Jenkins',
    },
    inputs: [
      {
        type: NodeConnectionType.Main,
        required: true,
      },
    ],
    outputs: [
      {
        type: NodeConnectionType.Main,
        required: true,
      },
    ],
    credentials: [
      {
        name: 'jenkinsApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          {
            name: 'Create Job',
            value: 'createJob',
            description: 'Create a new Jenkins job',
          },
          {
            name: 'Build Job',
            value: 'buildJob',
            description: 'Trigger a build for an existing job',
          },
          {
            name: 'Get Build Status',
            value: 'getBuildStatus',
            description: 'Get the status of a specific build',
          },
        ],
        default: 'buildJob',
        noDataExpression: true,
        required: true,
      },
      {
        displayName: 'Job Name',
        name: 'jobName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['buildJob', 'getBuildStatus'],
          },
        },
      },
      {
        displayName: 'Build Number',
        name: 'buildNumber',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: {
            operation: ['getBuildStatus'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;

    try {
      for (let i = 0; i < items.length; i++) {
        if (operation === 'buildJob') {
          const jobName = this.getNodeParameter('jobName', i) as string;
          // TODO: Implement Jenkins API call to build job
          returnData.push({
            json: {
              success: true,
              message: `Build triggered for job: ${jobName}`,
            },
          });
        } else if (operation === 'getBuildStatus') {
          const jobName = this.getNodeParameter('jobName', i) as string;
          const buildNumber = this.getNodeParameter('buildNumber', i) as number;
          // TODO: Implement Jenkins API call to get build status
          returnData.push({
            json: {
              success: true,
              jobName,
              buildNumber,
              status: 'SUCCESS', // This will come from the actual API call
            },
          });
        } else {
          throw new Error(`Invalid operation: ${operation}`);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new NodeOperationError(this.getNode(), error.message);
      }
      throw new NodeOperationError(this.getNode(), 'An unknown error occurred');
    }

    return [returnData];
  }
}