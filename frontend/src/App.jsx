import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Progress } from './components/ui/progress'
import { Play, Settings, Trash2, Crown, Users, TrendingUp, Activity } from 'lucide-react'
import './App.css'

const API_BASE_URL = 'https://j6h5i7c1l1ly.manus.space/api'

function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [agents, setAgents] = useState([])
  const [templates, setTemplates] = useState([])
  const [executions, setExecutions] = useState([])
  const [activeTab, setActiveTab] = useState('agents')

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch templates
        const templatesResponse = await fetch(`${API_BASE_URL}/templates`)
        if (!templatesResponse.ok) {
          throw new Error(`Failed to fetch templates: ${templatesResponse.status}`)
        }
        const templatesData = await templatesResponse.json()
        setTemplates(templatesData)
        
        // Mock agents data for now
        setAgents([
          {
            id: 1,
            name: "My Support Bot",
            agent_type: "customer_support",
            is_active: true,
            executions_count: 42,
            created_at: "2025-06-19T04:34:54.187172"
          }
        ])
        
        // Mock executions data
        setExecutions([
          {
            id: 1,
            agent_name: "My Support Bot",
            status: "completed",
            start_time: "2025-06-20T05:00:00",
            duration: "2.3s",
            result: "Customer inquiry resolved successfully"
          },
          {
            id: 2,
            agent_name: "My Support Bot", 
            status: "completed",
            start_time: "2025-06-20T04:45:00",
            duration: "1.8s",
            result: "FAQ response provided"
          }
        ])
        
      } catch (err) {
        console.error('Error initializing app:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  const executeAgent = async (agentId) => {
    try {
      // Mock execution for now
      console.log(`Executing agent ${agentId}`)
      
      // Update execution count
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, executions_count: agent.executions_count + 1 }
          : agent
      ))
      
      // Add new execution
      const newExecution = {
        id: executions.length + 1,
        agent_name: agents.find(a => a.id === agentId)?.name || "Unknown Agent",
        status: "completed",
        start_time: new Date().toISOString(),
        duration: "1.5s",
        result: "Agent executed successfully"
      }
      setExecutions(prev => [newExecution, ...prev])
      
    } catch (err) {
      console.error('Error executing agent:', err)
    }
  }

  const createAgentFromTemplate = async (templateId) => {
    try {
      const template = templates.find(t => t.id === templateId)
      if (!template) return
      
      const newAgent = {
        id: agents.length + 1,
        name: `My ${template.name}`,
        agent_type: template.agent_type,
        is_active: true,
        executions_count: 0,
        created_at: new Date().toISOString()
      }
      
      setAgents(prev => [...prev, newAgent])
      setActiveTab('agents')
      
    } catch (err) {
      console.error('Error creating agent:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Chit.ai...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chit.ai</h1>
              <p className="text-gray-600">Autonomous AI agents for your startup</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Free Tier
              </Badge>
              <Button variant="outline">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents.filter(a => a.is_active).length}</div>
              <p className="text-xs text-muted-foreground">of 5 max (Free tier)</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{executions.length}</div>
              <p className="text-xs text-muted-foreground">of 100 max (Free tier)</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Saved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,247</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agents">My Agents</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* My Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Agents</h2>
              <Button onClick={() => setActiveTab('templates')}>
                Create New Agent
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription className="capitalize">
                          {agent.agent_type.replace('_', ' ')}
                        </CardDescription>
                      </div>
                      <Badge variant={agent.is_active ? "default" : "secondary"}>
                        {agent.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <strong>Executions:</strong> {agent.executions_count}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Created:</strong> {new Date(agent.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => executeAgent(agent.id)}
                          className="flex-1"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Execute
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {agents.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 mb-4">No agents created yet</p>
                    <Button onClick={() => setActiveTab('templates')}>
                      Create Your First Agent
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <h2 className="text-2xl font-bold">Agent Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="relative">
                  {template.is_premium && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {template.agent_type.replace('_', ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <div className="text-xs text-gray-500">
                        <strong>Features:</strong>
                        <ul className="mt-1 space-y-1">
                          {Object.entries(template.default_configuration).slice(0, 3).map(([key, value]) => (
                            <li key={key}>• {key.replace('_', ' ')}: {Array.isArray(value) ? value.join(', ') : String(value)}</li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => createAgentFromTemplate(template.id)}
                        disabled={template.is_premium}
                      >
                        {template.is_premium ? "Upgrade Required" : "Use Template"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Executions Tab */}
          <TabsContent value="executions" className="space-y-6">
            <h2 className="text-2xl font-bold">Execution History</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
                <CardDescription>Monitor your agent performance and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executions.map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{execution.agent_name}</div>
                        <div className="text-sm text-gray-600">{execution.result}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={execution.status === 'completed' ? 'default' : 'secondary'}>
                          {execution.status}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(execution.start_time).toLocaleTimeString()} • {execution.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {executions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No executions yet. Execute an agent to see results here.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Pricing</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                  <CardDescription>Track your platform usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Agents Used</span>
                      <span>{agents.length}/5</span>
                    </div>
                    <Progress value={(agents.length / 5) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Executions</span>
                      <span>{executions.length}/100</span>
                    </div>
                    <Progress value={(executions.length / 100) * 100} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upgrade to Premium</CardTitle>
                  <CardDescription>Unlock advanced features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm">✓ 50 agents (vs 5)</div>
                    <div className="text-sm">✓ 10,000 executions/month (vs 100)</div>
                    <div className="text-sm">✓ Premium agent templates</div>
                    <div className="text-sm">✓ Advanced analytics</div>
                    <div className="text-sm">✓ Priority support</div>
                  </div>
                  <div className="text-2xl font-bold">$29/month</div>
                  <Button className="w-full">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

