import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { IExecuteFunctions } from 'n8n-workflow';
import { Jenkins } from './Jenkins.node';
import { createMockExecuteFunction } from '../__tests__/test-helpers';

describe('Jenkins Node', () => {
  let jenkins: Jenkins;
  let mockExecuteFunction: IExecuteFunctions;

  beforeEach(() => {
    jenkins = new Jenkins();
    mockExecuteFunction = createMockExecuteFunction();
  });

  describe('Node Description', () => {
    it('should have correct properties', () => {
      expect(jenkins.description.displayName).toBe('Jenkins');
      expect(jenkins.description.name).toBe('jenkins');
      expect(jenkins.description.group).toContain('automation');
      expect(jenkins.description.version).toBe(1);
    });

    it('should require credentials', () => {
      const credentials = jenkins.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials).toHaveLength(1);
      expect(credentials?.[0]?.name).toBe('jenkinsApi');
      expect(credentials?.[0]?.required).toBe(true);
    });

    it('should have required operations', () => {
      const operations = jenkins.description.properties.find(p => p.name === 'operation');
      expect(operations?.options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ value: 'buildJob' }),
          expect.objectContaining({ value: 'getBuildStatus' }),
        ])
      );
    });
  });

  describe('Execute Method', () => {
    it('should handle buildJob operation', async () => {
      const jobName = 'test-job';
      (mockExecuteFunction.getNodeParameter as jest.Mock).mockReturnValueOnce('buildJob').mockReturnValueOnce(jobName);

      const result = await jenkins.execute.call(mockExecuteFunction);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toEqual({
        success: true,
        message: `Build triggered for job: ${jobName}`,
      });
    });

    it('should handle getBuildStatus operation', async () => {
      const jobName = 'test-job';
      const buildNumber = 123;
      (mockExecuteFunction.getNodeParameter as jest.Mock)
        .mockReturnValueOnce('getBuildStatus')
        .mockReturnValueOnce(jobName)
        .mockReturnValueOnce(buildNumber);

      const result = await jenkins.execute.call(mockExecuteFunction);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toEqual({
        success: true,
        jobName,
        buildNumber,
        status: 'SUCCESS',
      });
    });
  });
});