import { ICredentialType, NodePropertyTypes } from 'n8n-workflow';

export class VaultApi implements ICredentialType {
  name = 'vaultApi';
  displayName = 'HashiCorp Vault API';
  documentationUrl = 'https://developer.hashicorp.com/vault/docs/auth';
  properties = [
    {
      displayName: 'Vault Address',
      name: 'url',
      type: 'string' as NodePropertyTypes,
      default: 'http://localhost:8200',
      required: true,
      description: 'The URL of your Vault instance',
    },
    {
      displayName: 'Token',
      name: 'token',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: true,
      description: 'Vault authentication token',
    },
    {
      displayName: 'Namespace',
      name: 'namespace',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: false,
      description: 'Vault namespace (optional)',
    },
  ];
}