"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultApi = void 0;
class VaultApi {
    constructor() {
        this.name = 'vaultApi';
        this.displayName = 'Vault API';
        this.properties = [
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Namespace',
                name: 'namespace',
                type: 'string',
                default: '',
                required: false,
                description: 'Vault Enterprise namespace',
            },
        ];
    }
}
exports.VaultApi = VaultApi;
//# sourceMappingURL=VaultApi.credentials.js.map