"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Jenkins_node_1 = require("../Jenkins/Jenkins.node");
describe('Jenkins Node', () => {
    let jenkins;
    let mockExecuteFunction;
    beforeEach(() => {
        jenkins = new Jenkins_node_1.Jenkins();
        mockExecuteFunction = {
            getInputData: jest.fn().mockReturnValue([{}]),
            getNodeParameter: jest.fn(),
            getNode: jest.fn().mockReturnValue({ name: 'Jenkins Test Node' }),
        };
    });
    describe('Node Description', () => {
        it('should have correct properties', () => {
            expect(jenkins.description.displayName).toBe('Jenkins');
            expect(jenkins.description.name).toBe('jenkins');
            expect(jenkins.description.group).toContain('automation');
            expect(jenkins.description.version).toBe(1);
        });
        it('should require credentials', () => {
            var _a, _b;
            const credentials = jenkins.description.credentials;
            expect(credentials).toBeDefined();
            expect(credentials).toHaveLength(1);
            expect((_a = credentials === null || credentials === void 0 ? void 0 : credentials[0]) === null || _a === void 0 ? void 0 : _a.name).toBe('jenkinsApi');
            expect((_b = credentials === null || credentials === void 0 ? void 0 : credentials[0]) === null || _b === void 0 ? void 0 : _b.required).toBe(true);
        });
    });
    describe('Build Job Operation', () => {
        it('should successfully trigger a build job', async () => {
            mockExecuteFunction.getNodeParameter = jest.fn()
                .mockReturnValueOnce('buildJob')
                .mockReturnValueOnce('test-job');
            const result = await jenkins.execute.call(mockExecuteFunction);
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(1);
            expect(result[0][0].json).toEqual({
                success: true,
                message: 'Build triggered for job: test-job',
            });
        });
    });
    describe('Get Build Status Operation', () => {
        it('should retrieve build status', async () => {
            mockExecuteFunction.getNodeParameter = jest.fn()
                .mockReturnValueOnce('getBuildStatus')
                .mockReturnValueOnce('test-job')
                .mockReturnValueOnce(123);
            const result = await jenkins.execute.call(mockExecuteFunction);
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(1);
            expect(result[0][0].json).toEqual({
                success: true,
                jobName: 'test-job',
                buildNumber: 123,
                status: 'SUCCESS',
            });
        });
    });
    describe('Error Handling', () => {
        it('should handle invalid operation gracefully', async () => {
            mockExecuteFunction.getNodeParameter = jest.fn()
                .mockReturnValueOnce('invalidOperation');
            await expect(jenkins.execute.call(mockExecuteFunction))
                .rejects
                .toThrow();
        });
    });
});
//# sourceMappingURL=Jenkins.test.js.map