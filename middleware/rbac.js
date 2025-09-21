// RBAC Middleware for OpFlow
// Implements role-based access control for workflows and operations

const ROLES = {
  ADMIN: 'admin',
  DEVELOPER: 'developer',
  APPROVER: 'approver',
  VIEWER: 'viewer'
};

const PERMISSIONS = {
  // Workflow permissions
  WORKFLOW_CREATE: 'workflow:create',
  WORKFLOW_READ: 'workflow:read',
  WORKFLOW_UPDATE: 'workflow:update',
  WORKFLOW_DELETE: 'workflow:delete',
  WORKFLOW_EXECUTE: 'workflow:execute',

  // Approval permissions
  APPROVAL_REQUEST: 'approval:request',
  APPROVAL_APPROVE: 'approval:approve',
  APPROVAL_REJECT: 'approval:reject',

  // Node permissions
  NODE_EXECUTE: 'node:execute',
  NODE_CONFIGURE: 'node:configure',

  // Audit permissions
  AUDIT_READ: 'audit:read'
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.WORKFLOW_CREATE,
    PERMISSIONS.WORKFLOW_READ,
    PERMISSIONS.WORKFLOW_UPDATE,
    PERMISSIONS.WORKFLOW_DELETE,
    PERMISSIONS.WORKFLOW_EXECUTE,
    PERMISSIONS.APPROVAL_REQUEST,
    PERMISSIONS.APPROVAL_APPROVE,
    PERMISSIONS.APPROVAL_REJECT,
    PERMISSIONS.NODE_EXECUTE,
    PERMISSIONS.NODE_CONFIGURE,
    PERMISSIONS.AUDIT_READ
  ],
  [ROLES.DEVELOPER]: [
    PERMISSIONS.WORKFLOW_READ,
    PERMISSIONS.WORKFLOW_EXECUTE,
    PERMISSIONS.APPROVAL_REQUEST,
    PERMISSIONS.NODE_EXECUTE
  ],
  [ROLES.APPROVER]: [
    PERMISSIONS.WORKFLOW_READ,
    PERMISSIONS.APPROVAL_APPROVE,
    PERMISSIONS.APPROVAL_REJECT,
    PERMISSIONS.AUDIT_READ
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.WORKFLOW_READ,
    PERMISSIONS.AUDIT_READ
  ]
};

class RBACMiddleware {
  constructor() {
    this.userRoles = new Map();
    this.rolePermissions = ROLE_PERMISSIONS;
  }

  // Assign role to user
  assignRole(userId, role) {
    if (!Object.values(ROLES).includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
    this.userRoles.set(userId, role);
  }

  // Get user role
  getUserRole(userId) {
    return this.userRoles.get(userId) || ROLES.VIEWER;
  }

  // Check if user has permission
  hasPermission(userId, permission) {
    const userRole = this.getUserRole(userId);
    const permissions = this.rolePermissions[userRole] || [];
    return permissions.includes(permission);
  }

  // Check multiple permissions
  hasAnyPermission(userId, permissions) {
    return permissions.some(permission => this.hasPermission(userId, permission));
  }

  // Check all permissions
  hasAllPermissions(userId, permissions) {
    return permissions.every(permission => this.hasPermission(userId, permission));
  }

  // Middleware function for Express
  middleware() {
    return (req, res, next) => {
      const userId = req.user?.id || req.headers['x-user-id'];
      const action = this.getActionFromRequest(req);

      if (!this.hasPermission(userId, action)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions for this action'
        });
      }

      // Log the access
      console.log(`User ${userId} accessed ${action} at ${new Date().toISOString()}`);

      next();
    };
  }

  // Extract action from request
  getActionFromRequest(req) {
    const method = req.method;
    const path = req.path;

    if (path.startsWith('/workflows')) {
      switch (method) {
        case 'GET': return PERMISSIONS.WORKFLOW_READ;
        case 'POST': return PERMISSIONS.WORKFLOW_CREATE;
        case 'PUT': return PERMISSIONS.WORKFLOW_UPDATE;
        case 'DELETE': return PERMISSIONS.WORKFLOW_DELETE;
      }
    }

    if (path.startsWith('/approvals')) {
      switch (method) {
        case 'POST': return PERMISSIONS.APPROVAL_REQUEST;
        case 'PUT': return PERMISSIONS.APPROVAL_APPROVE;
      }
    }

    if (path.startsWith('/audit')) {
      return PERMISSIONS.AUDIT_READ;
    }

    return PERMISSIONS.WORKFLOW_READ; // Default
  }

  // Initialize default roles
  initializeDefaults() {
    // This would typically load from database
    this.assignRole('admin', ROLES.ADMIN);
    this.assignRole('approver1', ROLES.APPROVER);
    this.assignRole('approver2', ROLES.APPROVER);
  }
}

module.exports = { RBACMiddleware, ROLES, PERMISSIONS };