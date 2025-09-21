"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockExecuteFunction = void 0;
const createMockExecuteFunction = () => ({
    getInputData: jest.fn().mockReturnValue([{}]),
    getNodeParameter: jest.fn().mockReturnValue(''),
    getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
});
exports.createMockExecuteFunction = createMockExecuteFunction;
//# sourceMappingURL=test-helpers.js.map