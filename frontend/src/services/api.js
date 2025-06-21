const API_BASE_URL = 'https://8xhpiqce71k1.manus.space/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // User endpoints
  async getUsers() {
    return this.request('/users')
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`)
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Agent endpoints
  async getAgents(userId = 1) {
    return this.request(`/agents?user_id=${userId}`)
  }

  async createAgent(agentData) {
    return this.request('/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    })
  }

  async getAgent(agentId) {
    return this.request(`/agents/${agentId}`)
  }

  async updateAgent(agentId, agentData) {
    return this.request(`/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    })
  }

  async deleteAgent(agentId) {
    return this.request(`/agents/${agentId}`, {
      method: 'DELETE',
    })
  }

  async executeAgent(agentId, inputData) {
    return this.request(`/agents/${agentId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ input_data: inputData }),
    })
  }

  async getAgentExecutions(agentId) {
    return this.request(`/agents/${agentId}/executions`)
  }

  // Template endpoints
  async getTemplates() {
    return this.request('/templates')
  }

  async createAgentFromTemplate(templateId, agentData) {
    return this.request(`/templates/${templateId}/create-agent`, {
      method: 'POST',
      body: JSON.stringify(agentData),
    })
  }

  async seedTemplates() {
    return this.request('/seed-templates', {
      method: 'POST',
    })
  }
}

export default new ApiService()

