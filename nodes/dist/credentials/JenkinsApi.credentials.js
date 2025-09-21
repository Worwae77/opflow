"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JenkinsApi = void 0;
class JenkinsApi {
    constructor() {
        this.name = 'jenkinsApi';
        this.displayName = 'Jenkins API';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
                required: true,
            },
        ];
    }
}
exports.JenkinsApi = JenkinsApi;
//# sourceMappingURL=JenkinsApi.credentials.js.map