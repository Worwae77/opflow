import { IExecuteFunctions } from 'n8n-workflow';
import { Vault } from '../Vault/Vault.node';

describe('Vault Node', () => {
  let vault: Vault;
  let mockExecuteFunction: IExecuteFunctions;

  beforeEach(() => {
    vault = new Vault();
    mockExecuteFunction = {
      getInputData: jest.fn().mockReturnValue([{}]),
      getNodeParameter: jest.fn(),
      getNode: jest.fn().mockReturnValue({ name: 'Vault Test Node' }),
    } as unknown as IExecuteFunctions;
  });

  describe('Node Description', () => {
    it('should have correct properties', () => {
      expect(vault.description.displayName).toBe('HashiCorp Vault');
      expect(vault.description.name).toBe('vault');
      expect(vault.description.group).toContain('automation');
      expect(vault.description.version).toBe(1);
    });

    it('should require credentials', () => {
      const credentials = vault.description.credentials;
      expect(credentials).toBeDefined();
      expect(credentials).toHaveLength(1);
      expect(credentials?.[0]?.name).toBe('vaultApi');
      expect(credentials?.[0]?.required).toBe(true);
    });
  });

  describe('Read Secret Operation', () => {
    it('should successfully read a secret', async () => {
      mockExecuteFunction.getNodeParameter = jest.fn()
        .mockReturnValueOnce('readSecret')
        .mockReturnValueOnce('secret/test');

      const result = await vault.execute.call(mockExecuteFunction);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toEqual({
        success: true,
        path: 'secret/test',
        data: {},
      });
    });
  });

  describe('Write Secret Operation', () => {
    const testSecretData = { key: 'value' };

    it('should successfully write a secret', async () => {
      mockExecuteFunction.getNodeParameter = jest.fn()
        .mockReturnValueOnce('writeSecret')
        .mockReturnValueOnce('secret/test')
        .mockReturnValueOnce(JSON.stringify(testSecretData));

      const result = await vault.execute.call(mockExecuteFunction);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toEqual({
        success: true,
        path: 'secret/test',
        message: 'Secret written successfully',
      });
    });
  });

  describe('Delete Secret Operation', () => {
    it('should successfully delete a secret', async () => {
      mockExecuteFunction.getNodeParameter = jest.fn()
        .mockReturnValueOnce('deleteSecret')
        .mockReturnValueOnce('secret/test');

      const result = await vault.execute.call(mockExecuteFunction);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toEqual({
        success: true,
        path: 'secret/test',
        message: 'Secret deleted successfully',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON data gracefully', async () => {
      mockExecuteFunction.getNodeParameter = jest.fn()
        .mockReturnValueOnce('writeSecret')
        .mockReturnValueOnce('secret/test')
        .mockReturnValueOnce('invalid-json');

      await expect(vault.execute.call(mockExecuteFunction))
        .rejects
        .toThrow();
    });
  });
});