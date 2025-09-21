#!/usr/bin/env node

// Workflow Versioning Script for OpFlow
// Automatically versions workflow changes and stores in database

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class WorkflowVersioner {
  constructor() {
    this.workflowsDir = path.join(__dirname, '..', 'workflows');
    this.databaseDir = path.join(__dirname, '..', 'database');
  }

  // Main execution
  async run() {
    try {
      console.log('Starting workflow versioning...');

      const workflows = await this.getWorkflowFiles();
      const versions = await this.loadExistingVersions();

      for (const workflow of workflows) {
        await this.versionWorkflow(workflow, versions);
      }

      await this.saveVersionsToDatabase(versions);
      console.log('Workflow versioning completed successfully');
    } catch (error) {
      console.error('Error during workflow versioning:', error);
      process.exit(1);
    }
  }

  // Get all workflow files
  async getWorkflowFiles() {
    const files = await fs.readdir(this.workflowsDir);
    return files.filter(file => file.endsWith('.json'));
  }

  // Load existing versions from database
  async loadExistingVersions() {
    const versionsFile = path.join(this.databaseDir, 'workflow_versions.json');
    try {
      const data = await fs.readFile(versionsFile, 'utf8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  // Version a single workflow
  async versionWorkflow(filename, versions) {
    const filePath = path.join(this.workflowsDir, filename);
    const content = await fs.readFile(filePath, 'utf8');
    const workflow = JSON.parse(content);

    const workflowId = this.getWorkflowId(filename);
    const currentHash = this.hashContent(content);

    if (!versions[workflowId]) {
      versions[workflowId] = [];
    }

    const existingVersion = versions[workflowId].find(v => v.hash === currentHash);

    if (!existingVersion) {
      const newVersion = {
        version: this.generateVersion(versions[workflowId]),
        hash: currentHash,
        content: workflow,
        createdAt: new Date().toISOString(),
        createdBy: process.env.GITHUB_ACTOR || 'system',
        commitHash: process.env.GITHUB_SHA || '',
        isActive: true,
        description: `Auto-versioned ${filename}`
      };

      // Mark previous versions as inactive
      versions[workflowId].forEach(v => v.isActive = false);

      versions[workflowId].push(newVersion);
      console.log(`Versioned ${filename} as ${newVersion.version}`);
    } else {
      console.log(`No changes detected for ${filename}`);
    }
  }

  // Get workflow ID from filename
  getWorkflowId(filename) {
    return filename.replace('.json', '').replace(/[^a-zA-Z0-9]/g, '_');
  }

  // Generate hash of content
  hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Generate semantic version
  generateVersion(existingVersions) {
    if (existingVersions.length === 0) {
      return '1.0.0';
    }

    const latest = existingVersions[existingVersions.length - 1];
    const [major, minor, patch] = latest.version.split('.').map(Number);

    // Simple increment - in real implementation, analyze changes
    return `${major}.${minor}.${patch + 1}`;
  }

  // Save versions to database file
  async saveVersionsToDatabase(versions) {
    const versionsFile = path.join(this.databaseDir, 'workflow_versions.json');
    await fs.writeFile(versionsFile, JSON.stringify(versions, null, 2));

    // Also generate SQL for database insertion
    const sqlFile = path.join(this.databaseDir, 'workflow_versions.sql');
    let sql = '-- Workflow Versions SQL\n\n';

    for (const [workflowId, workflowVersions] of Object.entries(versions)) {
      for (const version of workflowVersions) {
        sql += `INSERT INTO workflow_versions (workflow_id, version, content, created_at, created_by, commit_hash, is_active, description)
VALUES ('${workflowId}', '${version.version}', '${JSON.stringify(version.content).replace(/'/g, "''")}', '${version.createdAt}', '${version.createdBy}', '${version.commitHash}', ${version.isActive}, '${version.description}')
ON CONFLICT (workflow_id, version) DO NOTHING;\n\n`;
      }
    }

    await fs.writeFile(sqlFile, sql);
  }
}

// Run if called directly
if (require.main === module) {
  const versioner = new WorkflowVersioner();
  versioner.run();
}

module.exports = WorkflowVersioner;