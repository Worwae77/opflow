"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jenkins = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Jenkins {
    constructor() {
        this.description = {
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
                    type: "main" /* NodeConnectionType.Main */,
                    required: true,
                },
            ],
            outputs: [
                {
                    type: "main" /* NodeConnectionType.Main */,
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
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        try {
            for (let i = 0; i < items.length; i++) {
                if (operation === 'buildJob') {
                    const jobName = this.getNodeParameter('jobName', i);
                    // TODO: Implement Jenkins API call to build job
                    returnData.push({
                        json: {
                            success: true,
                            message: `Build triggered for job: ${jobName}`,
                        },
                    });
                }
                else if (operation === 'getBuildStatus') {
                    const jobName = this.getNodeParameter('jobName', i);
                    const buildNumber = this.getNodeParameter('buildNumber', i);
                    // TODO: Implement Jenkins API call to get build status
                    returnData.push({
                        json: {
                            success: true,
                            jobName,
                            buildNumber,
                            status: 'SUCCESS', // This will come from the actual API call
                        },
                    });
                }
                else {
                    throw new Error(`Invalid operation: ${operation}`);
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error.message);
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'An unknown error occurred');
        }
        return [returnData];
    }
}
exports.Jenkins = Jenkins;
//# sourceMappingURL=Jenkins.node.js.map