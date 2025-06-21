from flask import Blueprint, jsonify, request
from src.models.user import AgentTemplate, db

template_bp = Blueprint('template', __name__)

@template_bp.route('/seed-templates', methods=['POST'])
def seed_templates():
    """Seed the database with initial agent templates"""
    
    # Check if templates already exist
    if AgentTemplate.query.count() > 0:
        return jsonify({'message': 'Templates already exist'}), 200
    
    templates = [
        {
            'name': 'Basic Customer Support Bot',
            'description': 'A simple customer support agent that can handle common inquiries and escalate complex issues.',
            'agent_type': 'customer_support',
            'is_premium': False,
            'default_configuration': {
                'response_style': 'friendly',
                'escalation_threshold': 0.7,
                'supported_languages': ['en'],
                'max_conversation_length': 10
            }
        },
        {
            'name': 'Advanced Customer Support Agent',
            'description': 'An advanced customer support agent with multi-language support and sentiment analysis.',
            'agent_type': 'customer_support',
            'is_premium': True,
            'default_configuration': {
                'response_style': 'professional',
                'escalation_threshold': 0.8,
                'supported_languages': ['en', 'es', 'fr', 'de'],
                'sentiment_analysis': True,
                'max_conversation_length': 20,
                'integration_apis': ['zendesk', 'salesforce']
            }
        },
        {
            'name': 'Data Analysis Assistant',
            'description': 'Analyzes datasets and provides insights and visualizations.',
            'agent_type': 'data_analysis',
            'is_premium': False,
            'default_configuration': {
                'supported_formats': ['csv', 'json'],
                'max_file_size': '10MB',
                'analysis_types': ['summary', 'trends', 'correlations']
            }
        },
        {
            'name': 'Advanced Data Scientist',
            'description': 'Advanced data analysis with machine learning capabilities and custom visualizations.',
            'agent_type': 'data_analysis',
            'is_premium': True,
            'default_configuration': {
                'supported_formats': ['csv', 'json', 'xlsx', 'parquet'],
                'max_file_size': '100MB',
                'analysis_types': ['summary', 'trends', 'correlations', 'predictions', 'clustering'],
                'ml_models': ['regression', 'classification', 'clustering'],
                'custom_visualizations': True
            }
        },
        {
            'name': 'Marketing Campaign Assistant',
            'description': 'Helps create and optimize marketing campaigns across different channels.',
            'agent_type': 'marketing',
            'is_premium': False,
            'default_configuration': {
                'campaign_types': ['email', 'social_media'],
                'target_audiences': ['general', 'existing_customers'],
                'content_suggestions': True
            }
        },
        {
            'name': 'AI Marketing Strategist',
            'description': 'Advanced marketing agent with A/B testing, personalization, and multi-channel optimization.',
            'agent_type': 'marketing',
            'is_premium': True,
            'default_configuration': {
                'campaign_types': ['email', 'social_media', 'ppc', 'content_marketing'],
                'target_audiences': ['general', 'existing_customers', 'prospects', 'custom_segments'],
                'ab_testing': True,
                'personalization': True,
                'roi_optimization': True,
                'integration_apis': ['mailchimp', 'hubspot', 'google_ads']
            }
        },
        {
            'name': 'Content Writer',
            'description': 'Generates various types of content including blog posts, social media posts, and marketing copy.',
            'agent_type': 'content_generation',
            'is_premium': False,
            'default_configuration': {
                'content_types': ['blog_post', 'social_media_post', 'email'],
                'max_word_count': 500,
                'tone_options': ['professional', 'casual', 'friendly']
            }
        },
        {
            'name': 'AI Content Creator Pro',
            'description': 'Advanced content generation with SEO optimization, brand voice consistency, and multi-format support.',
            'agent_type': 'content_generation',
            'is_premium': True,
            'default_configuration': {
                'content_types': ['blog_post', 'social_media_post', 'email', 'landing_page', 'product_description', 'press_release'],
                'max_word_count': 2000,
                'tone_options': ['professional', 'casual', 'friendly', 'authoritative', 'conversational'],
                'seo_optimization': True,
                'brand_voice_training': True,
                'plagiarism_check': True,
                'multi_language_support': True
            }
        }
    ]
    
    for template_data in templates:
        template = AgentTemplate(**template_data)
        db.session.add(template)
    
    db.session.commit()
    
    return jsonify({
        'message': f'Successfully created {len(templates)} agent templates',
        'templates': [template.to_dict() for template in AgentTemplate.query.all()]
    }), 201

