import { IExecuteFunctions, NodeParameterValue } from 'n8n-workflow';

export const createMockExecuteFunction = () => ({
  getInputData: jest.fn().mockReturnValue([{}]),
  getNodeParameter: jest.fn().mockReturnValue(''),
  getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
} as unknown as IExecuteFunctions);