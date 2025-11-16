"""
Knowledge base of AI use cases categorized by business function and industry
"""

USE_CASE_CATEGORIES = {
    "customer_service": {
        "name": "Customer Service & Support",
        "use_cases": [
            {
                "id": "cs_chatbot",
                "name": "AI-Powered Customer Support Chatbot",
                "description": "Intelligent chatbot that handles customer inquiries 24/7",
                "business_value": "Reduce support costs by 40-60%, improve response times",
                "difficulty": "Medium",
                "time_to_implement": "4-8 weeks",
                "technologies": ["Claude API", "RAG", "Vector Database", "Web Framework"],
                "industries": ["Retail", "SaaS", "E-commerce", "Banking", "Healthcare"],
                "quick_wins": True
            },
            {
                "id": "cs_email_automation",
                "name": "Automated Email Response System",
                "description": "AI system that drafts responses to customer emails",
                "business_value": "70% faster email response times, improved consistency",
                "difficulty": "Low",
                "time_to_implement": "2-4 weeks",
                "technologies": ["Claude API", "Email Integration", "Workflow Automation"],
                "industries": ["All"],
                "quick_wins": True
            },
            {
                "id": "cs_sentiment_analysis",
                "name": "Customer Sentiment Analysis",
                "description": "Analyze customer feedback and support tickets for sentiment and trends",
                "business_value": "Early detection of issues, improved customer satisfaction",
                "difficulty": "Medium",
                "time_to_implement": "3-6 weeks",
                "technologies": ["Claude API", "Data Analytics", "Dashboard"],
                "industries": ["All"],
                "quick_wins": False
            }
        ]
    },
    "operations": {
        "name": "Operations & Process Automation",
        "use_cases": [
            {
                "id": "ops_document_processing",
                "name": "Intelligent Document Processing",
                "description": "Extract, classify, and process information from documents",
                "business_value": "90% reduction in manual data entry, fewer errors",
                "difficulty": "Medium",
                "time_to_implement": "6-10 weeks",
                "technologies": ["Claude API", "OCR", "Document Database", "Workflow Engine"],
                "industries": ["Finance", "Legal", "Healthcare", "Insurance", "Government"],
                "quick_wins": True
            },
            {
                "id": "ops_workflow_automation",
                "name": "Process Workflow Automation",
                "description": "Automate repetitive business processes with AI decision-making",
                "business_value": "50-70% time savings on routine tasks",
                "difficulty": "High",
                "time_to_implement": "8-16 weeks",
                "technologies": ["Claude API", "BPM Tools", "Integration Middleware"],
                "industries": ["All"],
                "quick_wins": False
            },
            {
                "id": "ops_inventory_optimization",
                "name": "AI Inventory Forecasting",
                "description": "Predict demand and optimize inventory levels",
                "business_value": "20-30% reduction in inventory costs",
                "difficulty": "High",
                "time_to_implement": "10-16 weeks",
                "technologies": ["Claude API", "Time Series Analysis", "Data Pipeline"],
                "industries": ["Retail", "Manufacturing", "E-commerce"],
                "quick_wins": False
            }
        ]
    },
    "sales_marketing": {
        "name": "Sales & Marketing",
        "use_cases": [
            {
                "id": "sm_content_generation",
                "name": "AI Content Generation",
                "description": "Generate marketing copy, blog posts, social media content",
                "business_value": "10x content output, consistent brand voice",
                "difficulty": "Low",
                "time_to_implement": "2-4 weeks",
                "technologies": ["Claude API", "CMS Integration", "Brand Guidelines"],
                "industries": ["All"],
                "quick_wins": True
            },
            {
                "id": "sm_lead_scoring",
                "name": "Intelligent Lead Scoring",
                "description": "AI-powered lead qualification and prioritization",
                "business_value": "30% increase in conversion rates",
                "difficulty": "Medium",
                "time_to_implement": "4-8 weeks",
                "technologies": ["Claude API", "CRM Integration", "Analytics"],
                "industries": ["B2B SaaS", "Enterprise Sales", "Real Estate"],
                "quick_wins": True
            },
            {
                "id": "sm_personalization",
                "name": "Personalized Marketing Campaigns",
                "description": "Generate personalized email and ad content for each customer",
                "business_value": "2-3x improvement in engagement rates",
                "difficulty": "Medium",
                "time_to_implement": "6-10 weeks",
                "technologies": ["Claude API", "Customer Data Platform", "Marketing Automation"],
                "industries": ["E-commerce", "Retail", "SaaS"],
                "quick_wins": False
            }
        ]
    },
    "hr_talent": {
        "name": "HR & Talent Management",
        "use_cases": [
            {
                "id": "hr_resume_screening",
                "name": "AI Resume Screening",
                "description": "Automatically screen and rank job candidates",
                "business_value": "80% time savings in initial screening",
                "difficulty": "Low",
                "time_to_implement": "2-4 weeks",
                "technologies": ["Claude API", "ATS Integration", "Scoring System"],
                "industries": ["All"],
                "quick_wins": True
            },
            {
                "id": "hr_onboarding",
                "name": "Intelligent Onboarding Assistant",
                "description": "AI-powered onboarding chatbot and guide",
                "business_value": "50% faster onboarding, better employee experience",
                "difficulty": "Medium",
                "time_to_implement": "4-6 weeks",
                "technologies": ["Claude API", "HR Systems", "Knowledge Base"],
                "industries": ["All"],
                "quick_wins": True
            },
            {
                "id": "hr_learning",
                "name": "Personalized Learning Paths",
                "description": "AI-generated training recommendations and content",
                "business_value": "Improved skill development, retention",
                "difficulty": "Medium",
                "time_to_implement": "8-12 weeks",
                "technologies": ["Claude API", "LMS Integration", "Skills Database"],
                "industries": ["All"],
                "quick_wins": False
            }
        ]
    },
    "finance": {
        "name": "Finance & Accounting",
        "use_cases": [
            {
                "id": "fin_invoice_processing",
                "name": "Automated Invoice Processing",
                "description": "Extract and process invoice data automatically",
                "business_value": "90% reduction in manual data entry",
                "difficulty": "Medium",
                "time_to_implement": "4-8 weeks",
                "technologies": ["Claude API", "OCR", "ERP Integration"],
                "industries": ["All"],
                "quick_wins": True
            },
            {
                "id": "fin_financial_analysis",
                "name": "AI Financial Report Analysis",
                "description": "Analyze financial statements and generate insights",
                "business_value": "Faster financial close, better insights",
                "difficulty": "High",
                "time_to_implement": "8-12 weeks",
                "technologies": ["Claude API", "Financial Data Sources", "Analytics"],
                "industries": ["Finance", "Enterprise"],
                "quick_wins": False
            },
            {
                "id": "fin_fraud_detection",
                "name": "Fraud Detection System",
                "description": "Identify anomalies and potential fraud in transactions",
                "business_value": "Reduce fraud losses by 40-60%",
                "difficulty": "High",
                "time_to_implement": "12-20 weeks",
                "technologies": ["Claude API", "Anomaly Detection", "Real-time Processing"],
                "industries": ["Banking", "Finance", "E-commerce"],
                "quick_wins": False
            }
        ]
    },
    "product_development": {
        "name": "Product Development & Engineering",
        "use_cases": [
            {
                "id": "pd_code_review",
                "name": "AI Code Review Assistant",
                "description": "Automated code review and suggestions",
                "business_value": "30% faster code reviews, improved code quality",
                "difficulty": "Low",
                "time_to_implement": "2-4 weeks",
                "technologies": ["Claude API", "Git Integration", "IDE Plugins"],
                "industries": ["Software", "Technology"],
                "quick_wins": True
            },
            {
                "id": "pd_documentation",
                "name": "Auto-Documentation Generator",
                "description": "Generate and maintain technical documentation",
                "business_value": "Always up-to-date docs, 80% time savings",
                "difficulty": "Low",
                "time_to_implement": "2-3 weeks",
                "technologies": ["Claude API", "Code Parsing", "Markdown/Docs Platform"],
                "industries": ["Software", "Technology"],
                "quick_wins": True
            },
            {
                "id": "pd_bug_triage",
                "name": "Intelligent Bug Triage",
                "description": "Automatically categorize and prioritize bug reports",
                "business_value": "50% faster bug resolution",
                "difficulty": "Medium",
                "time_to_implement": "4-6 weeks",
                "technologies": ["Claude API", "Issue Tracker Integration", "Classification"],
                "industries": ["Software", "Technology"],
                "quick_wins": True
            }
        ]
    },
    "data_analytics": {
        "name": "Data & Analytics",
        "use_cases": [
            {
                "id": "da_natural_language_query",
                "name": "Natural Language Data Queries",
                "description": "Query databases using natural language",
                "business_value": "Democratize data access, faster insights",
                "difficulty": "Medium",
                "time_to_implement": "6-10 weeks",
                "technologies": ["Claude API", "SQL Generation", "Database Connectors"],
                "industries": ["All"],
                "quick_wins": False
            },
            {
                "id": "da_report_generation",
                "name": "Automated Report Generation",
                "description": "Generate executive summaries and reports from data",
                "business_value": "90% time savings on reporting",
                "difficulty": "Medium",
                "time_to_implement": "4-8 weeks",
                "technologies": ["Claude API", "BI Tools", "Report Templates"],
                "industries": ["All"],
                "quick_wins": True
            },
            {
                "id": "da_data_cleaning",
                "name": "AI Data Cleaning & Enrichment",
                "description": "Automatically clean and enrich datasets",
                "business_value": "Better data quality, 70% time savings",
                "difficulty": "Medium",
                "time_to_implement": "4-6 weeks",
                "technologies": ["Claude API", "Data Pipeline", "Validation Rules"],
                "industries": ["All"],
                "quick_wins": True
            }
        ]
    }
}

def get_all_use_cases():
    """Return a flat list of all use cases"""
    all_cases = []
    for category_key, category_data in USE_CASE_CATEGORIES.items():
        for use_case in category_data["use_cases"]:
            use_case["category"] = category_key
            use_case["category_name"] = category_data["name"]
            all_cases.append(use_case)
    return all_cases

def get_quick_wins():
    """Return only quick win use cases"""
    return [uc for uc in get_all_use_cases() if uc.get("quick_wins", False)]

def get_by_industry(industry):
    """Filter use cases by industry"""
    all_cases = get_all_use_cases()
    return [uc for uc in all_cases if industry in uc["industries"] or "All" in uc["industries"]]
