import { config } from 'dotenv';

// Load environment variables from .env.test
config({ path: '.env.test' });

// Mock n8n-workflow module
jest.mock('n8n-workflow', () => ({
  IExecuteFunctions: jest.fn(),
  NodeOperationError: jest.fn(),
  NodePropertyTypes: {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    options: 'options',
  },
}));

// Global test setup
beforeAll(() => {
  // Add any global setup here
});

// Global test teardown
afterAll(() => {
  // Add any global cleanup here
});