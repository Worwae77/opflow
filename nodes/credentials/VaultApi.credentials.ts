import {
  ICredentialType,
  NodePropertyTypes,
} from 'n8n-workflow';

export class VaultApi implements ICredentialType {
  name = 'vaultApi';
  displayName = 'Vault API';
  properties = [
    {
      displayName: 'URL',
      name: 'url',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: true,
    },
    {
      displayName: 'Token',
      name: 'token',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: true,
    },
    {
      displayName: 'Namespace',
      name: 'namespace',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: false,
      description: 'Vault Enterprise namespace',
    },
  ];
}