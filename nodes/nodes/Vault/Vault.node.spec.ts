import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { IExecuteFunctions } from 'n8n-workflow';
import { Vault } from './Vault.node';
import { createMockExecuteFunction } from '../__tests__/test-helpers';

describe('Vault Node', () => {
	let vault: Vault;
	let mockExecuteFunction: IExecuteFunctions;

	beforeEach(() => {
		vault = new Vault();
		mockExecuteFunction = createMockExecuteFunction();
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

		it('should have required operations', () => {
			const operations = vault.description.properties.find((p) => p.name === 'operation');
			expect(operations?.options).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ value: 'readSecret' }),
					expect.objectContaining({ value: 'writeSecret' }),
					expect.objectContaining({ value: 'deleteSecret' }),
					expect.objectContaining({ value: 'rotateSecret' }),
				])
			);
		});
	});

	describe('Execute Method', () => {
		const testPath = 'secret/test';
		const testSecretData = { key: 'value' };

		it('should handle readSecret operation', async () => {
			(mockExecuteFunction.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('readSecret')
				.mockReturnValueOnce(testPath);

			const result = await vault.execute.call(mockExecuteFunction);

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toEqual({
				success: true,
				path: testPath,
				data: {},
			});
		});

		it('should handle writeSecret operation', async () => {
			(mockExecuteFunction.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('writeSecret')
				.mockReturnValueOnce(testPath)
				.mockReturnValueOnce(JSON.stringify(testSecretData));

			const result = await vault.execute.call(mockExecuteFunction);

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toEqual({
				success: true,
				path: testPath,
				message: 'Secret written successfully',
			});
		});

		it('should handle rotateSecret operation', async () => {
			(mockExecuteFunction.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('rotateSecret')
				.mockReturnValueOnce(testPath)
				.mockReturnValueOnce(JSON.stringify(testSecretData));

			const result = await vault.execute.call(mockExecuteFunction);

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toEqual({
				success: true,
				path: testPath,
				message: 'Secret rotated successfully',
			});
		});

		it('should handle deleteSecret operation', async () => {
			(mockExecuteFunction.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('deleteSecret')
				.mockReturnValueOnce(testPath);

			const result = await vault.execute.call(mockExecuteFunction);

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toEqual({
				success: true,
				path: testPath,
				message: 'Secret deleted successfully',
			});
		});
	});
});