from flask import Blueprint, jsonify, request
from src.models.user import Agent, AgentTemplate, AgentExecution, User, db
from datetime import datetime
import json

agent_bp = Blueprint('agent', __name__)

@agent_bp.route('/agents', methods=['GET'])
def get_agents():
    """Get all agents for the current user (simplified - no auth for now)"""
    user_id = request.args.get('user_id', 1)  # Default to user 1 for demo
    agents = Agent.query.filter_by(user_id=user_id).all()
    return jsonify([agent.to_dict() for agent in agents])

@agent_bp.route('/agents', methods=['POST'])
def create_agent():
    """Create a new agent"""
    data = request.json
    
    # Validate required fields
    if not data.get('name') or not data.get('agent_type'):
        return jsonify({'error': 'Name and agent_type are required'}), 400
    
    agent = Agent(
        name=data['name'],
        description=data.get('description', ''),
        agent_type=data['agent_type'],
        configuration=data.get('configuration', {}),
        user_id=data.get('user_id', 1)  # Default to user 1 for demo
    )
    
    db.session.add(agent)
    db.session.commit()
    
    return jsonify(agent.to_dict()), 201

@agent_bp.route('/agents/<int:agent_id>', methods=['GET'])
def get_agent(agent_id):
    """Get a specific agent"""
    agent = Agent.query.get_or_404(agent_id)
    return jsonify(agent.to_dict())

@agent_bp.route('/agents/<int:agent_id>', methods=['PUT'])
def update_agent(agent_id):
    """Update an agent"""
    agent = Agent.query.get_or_404(agent_id)
    data = request.json
    
    agent.name = data.get('name', agent.name)
    agent.description = data.get('description', agent.description)
    agent.agent_type = data.get('agent_type', agent.agent_type)
    agent.configuration = data.get('configuration', agent.configuration)
    agent.is_active = data.get('is_active', agent.is_active)
    agent.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify(agent.to_dict())

@agent_bp.route('/agents/<int:agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    """Delete an agent"""
    agent = Agent.query.get_or_404(agent_id)
    db.session.delete(agent)
    db.session.commit()
    return '', 204

@agent_bp.route('/agents/<int:agent_id>/execute', methods=['POST'])
def execute_agent(agent_id):
    """Execute an agent with given input"""
    agent = Agent.query.get_or_404(agent_id)
    data = request.json
    
    if not agent.is_active:
        return jsonify({'error': 'Agent is not active'}), 400
    
    # Create execution record
    execution = AgentExecution(
        agent_id=agent_id,
        input_data=data.get('input_data', {}),
        status='running'
    )
    db.session.add(execution)
    db.session.commit()
    
    try:
        # Execute the agent based on its type
        result = execute_agent_logic(agent, data.get('input_data', {}))
        
        # Update execution with result
        execution.output_data = result
        execution.status = 'completed'
        execution.completed_at = datetime.utcnow()
        
    except Exception as e:
        execution.status = 'failed'
        execution.error_message = str(e)
        execution.completed_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify(execution.to_dict())

@agent_bp.route('/agents/<int:agent_id>/executions', methods=['GET'])
def get_agent_executions(agent_id):
    """Get execution history for an agent"""
    executions = AgentExecution.query.filter_by(agent_id=agent_id).order_by(AgentExecution.started_at.desc()).all()
    return jsonify([execution.to_dict() for execution in executions])

@agent_bp.route('/templates', methods=['GET'])
def get_agent_templates():
    """Get available agent templates"""
    templates = AgentTemplate.query.all()
    return jsonify([template.to_dict() for template in templates])

@agent_bp.route('/templates/<int:template_id>/create-agent', methods=['POST'])
def create_agent_from_template(template_id):
    """Create an agent from a template"""
    template = AgentTemplate.query.get_or_404(template_id)
    data = request.json
    
    # Check if user has premium access for premium templates
    user_id = data.get('user_id', 1)
    user = User.query.get(user_id)
    
    if template.is_premium and not (user and user.is_premium):
        return jsonify({'error': 'Premium subscription required for this template'}), 403
    
    agent = Agent(
        name=data.get('name', template.name),
        description=data.get('description', template.description),
        agent_type=template.agent_type,
        configuration=template.default_configuration.copy(),
        user_id=user_id
    )
    
    db.session.add(agent)
    db.session.commit()
    
    return jsonify(agent.to_dict()), 201

def execute_agent_logic(agent, input_data):
    """
    Execute agent logic based on agent type
    This is a simplified implementation - in a real system, this would
    integrate with LangChain, CrewAI, or other AI frameworks
    """
    agent_type = agent.agent_type
    config = agent.configuration or {}
    
    if agent_type == 'customer_support':
        return execute_customer_support_agent(input_data, config)
    elif agent_type == 'data_analysis':
        return execute_data_analysis_agent(input_data, config)
    elif agent_type == 'marketing':
        return execute_marketing_agent(input_data, config)
    elif agent_type == 'content_generation':
        return execute_content_generation_agent(input_data, config)
    else:
        return {'error': f'Unknown agent type: {agent_type}'}

def execute_customer_support_agent(input_data, config):
    """Execute customer support agent logic"""
    user_message = input_data.get('message', '')
    
    # Simplified response - in real implementation, this would use LLM
    if 'refund' in user_message.lower():
        return {
            'response': 'I understand you\'re looking for a refund. Let me help you with that. Please provide your order number.',
            'suggested_actions': ['escalate_to_human', 'request_order_number'],
            'confidence': 0.85
        }
    elif 'technical' in user_message.lower() or 'bug' in user_message.lower():
        return {
            'response': 'I see you\'re experiencing a technical issue. Let me gather some information to help resolve this.',
            'suggested_actions': ['collect_system_info', 'create_ticket'],
            'confidence': 0.90
        }
    else:
        return {
            'response': 'Thank you for contacting us. How can I assist you today?',
            'suggested_actions': ['clarify_intent'],
            'confidence': 0.70
        }

def execute_data_analysis_agent(input_data, config):
    """Execute data analysis agent logic"""
    data = input_data.get('data', [])
    analysis_type = input_data.get('analysis_type', 'summary')
    
    if not data:
        return {'error': 'No data provided for analysis'}
    
    # Simplified analysis
    if analysis_type == 'summary':
        return {
            'total_records': len(data),
            'summary': 'Data analysis completed',
            'insights': ['Sample insight 1', 'Sample insight 2']
        }
    else:
        return {'error': f'Unsupported analysis type: {analysis_type}'}

def execute_marketing_agent(input_data, config):
    """Execute marketing agent logic"""
    campaign_type = input_data.get('campaign_type', 'email')
    target_audience = input_data.get('target_audience', 'general')
    
    return {
        'campaign_suggestions': [
            f'Create {campaign_type} campaign for {target_audience}',
            'Focus on value proposition',
            'Include clear call-to-action'
        ],
        'recommended_channels': ['email', 'social_media', 'content_marketing'],
        'estimated_reach': 1000
    }

def execute_content_generation_agent(input_data, config):
    """Execute content generation agent logic"""
    content_type = input_data.get('content_type', 'blog_post')
    topic = input_data.get('topic', 'AI and automation')
    
    return {
        'content_type': content_type,
        'topic': topic,
        'generated_content': f'This is a sample {content_type} about {topic}. In a real implementation, this would be generated using advanced language models.',
        'word_count': 150,
        'suggestions': ['Add more examples', 'Include statistics', 'Optimize for SEO']
    }

