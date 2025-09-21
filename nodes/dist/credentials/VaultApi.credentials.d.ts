import { ICredentialType, NodePropertyTypes } from 'n8n-workflow';
export declare class VaultApi implements ICredentialType {
    name: string;
    displayName: string;
    properties: ({
        displayName: string;
        name: string;
        type: NodePropertyTypes;
        default: string;
        required: boolean;
        description?: undefined;
    } | {
        displayName: string;
        name: string;
        type: NodePropertyTypes;
        default: string;
        required: boolean;
        description: string;
    })[];
}
