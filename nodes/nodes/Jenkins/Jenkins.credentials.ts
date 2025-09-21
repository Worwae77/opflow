import { ICredentialType, NodePropertyTypes } from 'n8n-workflow';

export class JenkinsApi implements ICredentialType {
  name = 'jenkinsApi';
  displayName = 'Jenkins API';
  documentationUrl = 'https://www.jenkins.io/doc/book/using/using-credentials/';
  properties = [
    {
      displayName: 'Jenkins URL',
      name: 'url',
      type: 'string' as NodePropertyTypes,
      default: 'http://localhost:8080',
      required: true,
      description: 'The URL of your Jenkins instance',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: true,
      description: 'Jenkins username',
    },
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string' as NodePropertyTypes,
      default: '',
      required: true,
      description: 'Jenkins API token for authentication',
    },
  ];
}