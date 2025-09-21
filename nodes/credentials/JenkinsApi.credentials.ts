import {
  ICredentialType,
  NodePropertyTypes,
} from 'n8n-workflow';

export class JenkinsApi implements ICredentialType {
  name = 'jenkinsApi';
  displayName = 'Jenkins API';
  properties = [
    {
      displayName: 'URL',
      name: 'url',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: true,
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: true,
    },
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: true,
    },
  ];
}