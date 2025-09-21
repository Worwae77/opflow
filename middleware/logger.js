// Audit Logging Middleware for OpFlow
// Comprehensive logging for compliance and monitoring

const fs = require('fs').promises;
const path = require('path');

class AuditLogger {
  constructor(options = {}) {
    this.logLevel = options.level || 'info';
    this.output = options.output || 'console';
    this.filePath = options.filePath || 'logs/opflow.log';
    this.dbConnection = options.dbConnection;
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  // Initialize logger
  async initialize() {
    if (this.output === 'file') {
      const logDir = path.dirname(this.filePath);
      try {
        await fs.access(logDir);
      } catch {
        await fs.mkdir(logDir, { recursive: true });
      }
    }
  }

  // Log audit event
  async log(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: event.level || 'info',
      userId: event.userId,
      action: event.action,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      details: event.details || {},
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      sessionId: event.sessionId,
      workflowId: event.workflowId,
      nodeId: event.nodeId,
      status: event.status || 'success',
      errorMessage: event.errorMessage
    };

    // Write to file if configured
    if (this.output === 'file') {
      await this.writeToFile(logEntry);
    }

    // Write to console
    this.writeToConsole(logEntry);

    // Write to database if available
    if (this.dbConnection) {
      await this.writeToDatabase(logEntry);
    }
  }

  // Write to file
  async writeToFile(entry) {
    try {
      const logLine = JSON.stringify(entry) + '\n';
      await fs.appendFile(this.filePath, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  // Write to console
  writeToConsole(entry) {
    const level = entry.level.toUpperCase();
    const message = `[${entry.timestamp}] ${level}: ${entry.action} by ${entry.userId || 'unknown'}`;
    console.log(message);
  }

  // Write to database
  async writeToDatabase(entry) {
    try {
      const query = `
        INSERT INTO audit_logs (
          user_id, action, resource_type, resource_id, details,
          ip_address, user_agent, session_id, workflow_id, node_id,
          status, error_message
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;
      const values = [
        entry.userId,
        entry.action,
        entry.resourceType,
        entry.resourceId,
        JSON.stringify(entry.details),
        entry.ipAddress,
        entry.userAgent,
        entry.sessionId,
        entry.workflowId,
        entry.nodeId,
        entry.status,
        entry.errorMessage
      ];

      await this.dbConnection.query(query, values);
    } catch (error) {
      console.error('Failed to write to database:', error);
    }
  }

  // Middleware for Express
  middleware() {
    return async (req, res, next) => {
      const startTime = Date.now();

      // Capture request details
      const userId = req.user?.id || req.headers['x-user-id'];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const sessionId = req.session?.id;

      // Override res.end to capture response
      const originalEnd = res.end;
      res.end = async (...args) => {
        const duration = Date.now() - startTime;
        const status = res.statusCode >= 400 ? 'error' : 'success';

        await this.log({
          level: status === 'error' ? 'error' : 'info',
          userId,
          action: `${req.method} ${req.path}`,
          resourceType: 'api',
          resourceId: req.path,
          details: {
            method: req.method,
            path: req.path,
            query: req.query,
            duration,
            statusCode: res.statusCode
          },
          ipAddress,
          userAgent,
          sessionId,
          status
        });

        originalEnd.apply(res, args);
      };

      next();
    };
  }

  // Log workflow execution
  async logWorkflowExecution(workflowId, executionId, status, details = {}) {
    await this.log({
      level: 'info',
      action: 'workflow_execution',
      resourceType: 'workflow',
      resourceId: workflowId,
      details: {
        executionId,
        status,
        ...details
      },
      workflowId
    });
  }

  // Log node execution
  async logNodeExecution(workflowId, nodeId, status, details = {}) {
    await this.log({
      level: 'info',
      action: 'node_execution',
      resourceType: 'node',
      resourceId: nodeId,
      details: {
        status,
        ...details
      },
      workflowId,
      nodeId
    });
  }

  // Log approval events
  async logApproval(workflowId, approverId, status, details = {}) {
    await this.log({
      level: 'info',
      action: 'approval',
      resourceType: 'approval',
      resourceId: workflowId,
      details: {
        approverId,
        status,
        ...details
      },
      workflowId
    });
  }
}

module.exports = AuditLogger;