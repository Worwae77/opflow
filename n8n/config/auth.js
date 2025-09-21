// n8n Keycloak SSO Configuration
// This file configures n8n to use Keycloak for authentication

const config = {
  // Database configuration
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_POSTGRESDB_HOST || 'localhost',
    port: parseInt(process.env.DB_POSTGRESDB_PORT || '5432'),
    database: process.env.DB_POSTGRESDB_DATABASE || 'n8n',
    username: process.env.DB_POSTGRESDB_USER || 'n8n',
    password: process.env.DB_POSTGRESDB_PASSWORD || 'n8n_password',
  },

  // Keycloak SSO configuration
  auth: {
    identityProvider: process.env.N8N_AUTH_IDENTITY_PROVIDER || 'keycloak',
    keycloak: {
      realm: process.env.N8N_AUTH_KEYCLOAK_REALM || 'n8n',
      authServerUrl: process.env.N8N_AUTH_KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8080/auth',
      clientId: process.env.N8N_AUTH_KEYCLOAK_CLIENT_ID || 'n8n-client',
      clientSecret: process.env.N8N_AUTH_KEYCLOAK_CLIENT_SECRET || 'n8n-secret',
      publicClient: false,
      confidentialPort: 0,
      sslRequired: 'external',
      resource: 'n8n',
      useResourceRoleMappings: true,
      policyEnforcer: {},
    },
  },

  // Security settings
  security: {
    encryptionKey: process.env.N8N_ENCRYPTION_KEY || 'your_32_character_encryption_key_here',
    jwtSecret: process.env.N8N_JWT_SECRET || 'your_jwt_secret_here',
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    output: process.env.LOG_OUTPUT || 'console',
    file: {
      path: process.env.LOG_FILE_PATH || 'logs/n8n.log',
    },
  },
};

module.exports = config;