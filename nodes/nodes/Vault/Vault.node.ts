import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

export class Vault implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'HashiCorp Vault',
    name: 'vault',
    group: ['automation'],
    version: 1,
    description: 'Interact with HashiCorp Vault',
    defaults: {
      name: 'Vault',
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
        name: 'vaultApi',
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
            name: 'Read Secret',
            value: 'readSecret',
            description: 'Read a secret from Vault',
          },
          {
            name: 'Write Secret',
            value: 'writeSecret',
            description: 'Write a secret to Vault',
          },
          {
            name: 'Delete Secret',
            value: 'deleteSecret',
            description: 'Delete a secret from Vault',
          },
          {
            name: 'Rotate Secret',
            value: 'rotateSecret',
            description: 'Rotate a secret in Vault',
          },
        ],
        default: 'readSecret',
        noDataExpression: true,
        required: true,
      },
      {
        displayName: 'Path',
        name: 'path',
        type: 'string',
        default: '',
        required: true,
        description: 'Path to the secret in Vault',
      },
      {
        displayName: 'Secret Data',
        name: 'secretData',
        type: 'json',
        default: '{}',
        required: true,
        displayOptions: {
          show: {
            operation: ['writeSecret', 'rotateSecret'],
          },
        },
        description: 'Secret data to write (as JSON object)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;

    try {
      for (let i = 0; i < items.length; i++) {
        const path = this.getNodeParameter('path', i) as string;

        if (operation === 'readSecret') {
          // TODO: Implement Vault API call to read secret
          returnData.push({
            json: {
              success: true,
              path,
              data: {}, // This will be populated with actual secret data
            },
          });
        } else if (operation === 'writeSecret' || operation === 'rotateSecret') {
          const secretData = JSON.parse(this.getNodeParameter('secretData', i) as string);
          // TODO: Implement Vault API call to write/rotate secret
          returnData.push({
            json: {
              success: true,
              path,
              message: `Secret ${operation === 'writeSecret' ? 'written' : 'rotated'} successfully`,
            },
          });
        } else if (operation === 'deleteSecret') {
          // TODO: Implement Vault API call to delete secret
          returnData.push({
            json: {
              success: true,
              path,
              message: 'Secret deleted successfully',
            },
          });
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