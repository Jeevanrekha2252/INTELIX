/**
 * Intelix Backend API Client
 * Connects frontend views to Spring Boot REST APIs on http://localhost:8080
 */

const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('intelix_jwt_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('intelix_jwt_token', token);
  } else {
    localStorage.removeItem('intelix_jwt_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    if (response.status === 401) {
      setAuthToken(null);
    }
    const errorBody = await response.text().catch(() => '');
    throw new Error(`API ${response.status}: ${errorBody || response.statusText}`);
  }

  // If response is empty (e.g. 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export const api = {
  // Authentication
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data?.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async register(registerData) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData)
    });
  },

  async getMe() {
    return request('/auth/me');
  },

  // Health check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}
      });
      return res.status === 200 || res.status === 401 || res.status === 403;
    } catch {
      return false;
    }
  },

  // Projects
  async getProjects() {
    return request('/projects');
  },

  async getProjectById(id) {
    return request(`/projects/${id}`);
  },

  async createProject(project) {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
  },

  async updateProject(id, project) {
    return request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project)
    });
  },

  // Tasks
  async getProjectTasks(projectId) {
    return request(`/projects/${projectId}/tasks`);
  },

  async getMyTasks() {
    return request('/tasks/my');
  },

  async createTask(projectId, taskData) {
    return request(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  async updateTask(id, taskData) {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  },

  async updateTaskProgress(id, progressPercentage, hoursSpent = 0, workNotes = '') {
    return request(`/tasks/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progressPercentage, hoursSpent, workNotes })
    });
  },

  async updateTaskStatus(id, status) {
    return request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async toggleTaskBlocker(id, blockerReason = '') {
    return request(`/tasks/${id}/blocker`, {
      method: 'POST',
      body: JSON.stringify({ blockerReason })
    });
  },

  // Dependencies
  async getDependencies(projectId) {
    return request(`/projects/${projectId}/dependencies`);
  },

  async createDependency(depData) {
    return request('/dependencies', {
      method: 'POST',
      body: JSON.stringify(depData)
    });
  },

  async deleteDependency(depId) {
    return request(`/dependencies/${depId}`, {
      method: 'DELETE'
    });
  },

  // Analytics & Risks
  async getProjectRisks(projectId) {
    return request(`/projects/${projectId}/risks`);
  },

  async getTaskRisk(taskId) {
    return request(`/tasks/${taskId}/risk`);
  },

  async recalculateProjectRisks(projectId) {
    return request(`/projects/${projectId}/risk/recalculate`, {
      method: 'POST'
    });
  },

  async getProjectAnalytics(projectId) {
    return request(`/projects/${projectId}/analytics`);
  },

  // Approvals & Deliverables
  async getApprovals(projectId) {
    return request(`/projects/${projectId}/approvals`);
  },

  async submitApprovalDecision(approvalId, decision, comments = '') {
    return request(`/approvals/${approvalId}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, comments })
    });
  },

  // AI Copilot
  async getAiRecommendations(projectId) {
    return request(`/projects/${projectId}/copilot/recommendations`);
  },

  async applyAiRecommendation(projectId, recommendationId) {
    return request(`/projects/${projectId}/copilot/apply/${recommendationId}`, {
      method: 'POST'
    });
  },

  // Users & Administration
  async getUsers() {
    return request('/users');
  },

  async toggleUserStatus(userId, active) {
    return request(`/users/${userId}/status?active=${active}`, {
      method: 'PUT'
    });
  },

  // Change Requests
  async getChangeRequests(projectId) {
    return request(`/projects/${projectId}/change-requests`);
  },

  async createChangeRequest(projectId, crData) {
    return request(`/projects/${projectId}/change-requests`, {
      method: 'POST',
      body: JSON.stringify(crData)
    });
  },

  async reviewChangeRequest(id, reviewData) {
    return request(`/change-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  },

  async convertChangeRequestToTask(id) {
    return request(`/change-requests/${id}/convert-to-task`, {
      method: 'POST'
    });
  },

  // Meetings & Action Items
  async getMeetings(projectId) {
    return request(`/projects/${projectId}/meetings`);
  },

  async scheduleMeeting(projectId, meetingData) {
    return request(`/projects/${projectId}/meetings`, {
      method: 'POST',
      body: JSON.stringify(meetingData)
    });
  },

  async getActionItems(meetingId) {
    return request(`/meetings/${meetingId}/actions`);
  },

  async convertActionItemToTask(actionId) {
    return request(`/meetings/actions/${actionId}/convert-to-task`, {
      method: 'POST'
    });
  },

  // Documents
  async getDocuments(projectId) {
    return request(`/projects/${projectId}/documents`);
  },

  async uploadDocument(projectId, docData) {
    return request(`/projects/${projectId}/documents`, {
      method: 'POST',
      body: JSON.stringify(docData)
    });
  },

  // Activity & Audit Log
  async getProjectActivity(projectId) {
    return request(`/projects/${projectId}/activity`);
  },

  // Notifications
  async getNotifications() {
    return request('/notifications');
  },

  async markNotificationRead(id) {
    return request(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  async markAllNotificationsRead() {
    return request('/notifications/read-all', {
      method: 'PUT'
    });
  }
};

export default api;
