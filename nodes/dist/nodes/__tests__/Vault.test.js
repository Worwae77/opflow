"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vault_node_1 = require("../Vault/Vault.node");
describe('Vault Node', () => {
    let vault;
    let mockExecuteFunction;
    beforeEach(() => {
        vault = new Vault_node_1.Vault();
        mockExecuteFunction = {
            getInputData: jest.fn().mockReturnValue([{}]),
            getNodeParameter: jest.fn(),
            getNode: jest.fn().mockReturnValue({ name: 'Vault Test Node' }),
        };
    });
    describe('Node Description', () => {
        it('should have correct properties', () => {
            expect(vault.description.displayName).toBe('HashiCorp Vault');
            expect(vault.description.name).toBe('vault');
            expect(vault.description.group).toContain('automation');
            expect(vault.description.version).toBe(1);
        });
        it('should require credentials', () => {
            var _a, _b;
            const credentials = vault.description.credentials;
            expect(credentials).toBeDefined();
            expect(credentials).toHaveLength(1);
            expect((_a = credentials === null || credentials === void 0 ? void 0 : credentials[0]) === null || _a === void 0 ? void 0 : _a.name).toBe('vaultApi');
            expect((_b = credentials === null || credentials === void 0 ? void 0 : credentials[0]) === null || _b === void 0 ? void 0 : _b.required).toBe(true);
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
//# sourceMappingURL=Vault.test.js.map