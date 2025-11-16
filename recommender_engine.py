"""
Core AI Use Case Recommender Engine
Uses Claude API to analyze business descriptions and recommend relevant AI use cases
"""

import os
import json
from typing import List, Dict, Any
from anthropic import Anthropic
from dotenv import load_dotenv
from use_cases_knowledge import get_all_use_cases, USE_CASE_CATEGORIES

load_dotenv()

class UseCaseRecommender:
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError(
                "ANTHROPIC_API_KEY not found. Please set it in your .env file.\n"
                "Get your API key at: https://console.anthropic.com/"
            )
        self.client = Anthropic(api_key=api_key)
        self.all_use_cases = get_all_use_cases()

    def analyze_business_context(self, description: str) -> Dict[str, Any]:
        """
        Analyze the business description to extract key information
        """
        analysis_prompt = f"""Analyze this business description and extract the following information in JSON format:

Business Description: {description}

Please provide a JSON response with:
{{
    "industry": "the primary industry (e.g., Retail, Finance, Healthcare, SaaS, Manufacturing, etc.)",
    "business_functions": ["list of business functions mentioned (e.g., customer service, sales, operations, HR, finance)"],
    "pain_points": ["specific problems or challenges mentioned"],
    "goals": ["business goals or desired outcomes"],
    "current_maturity": "AI maturity level: none/beginner/intermediate/advanced",
    "urgency": "low/medium/high",
    "keywords": ["relevant keywords for matching use cases"]
}}

Only respond with valid JSON, no other text."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": analysis_prompt}
            ]
        )

        response_text = message.content[0].text
        # Parse JSON response
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback parsing if response isn't pure JSON
            return self._extract_json_from_text(response_text)

    def _extract_json_from_text(self, text: str) -> Dict[str, Any]:
        """Extract JSON from text that might have additional formatting"""
        start = text.find('{')
        end = text.rfind('}') + 1
        if start != -1 and end != 0:
            try:
                return json.loads(text[start:end])
            except:
                pass
        # Return default structure if parsing fails
        return {
            "industry": "General",
            "business_functions": [],
            "pain_points": [],
            "goals": [],
            "current_maturity": "beginner",
            "urgency": "medium",
            "keywords": []
        }

    def rank_use_cases(self, business_context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Rank use cases based on business context using Claude
        """
        # Create a concise summary of each use case for Claude
        use_cases_summary = []
        for idx, uc in enumerate(self.all_use_cases):
            use_cases_summary.append({
                "index": idx,
                "id": uc["id"],
                "name": uc["name"],
                "description": uc["description"],
                "category": uc["category_name"],
                "business_value": uc["business_value"],
                "difficulty": uc["difficulty"],
                "time_to_implement": uc["time_to_implement"],
                "quick_wins": uc["quick_wins"]
            })

        ranking_prompt = f"""You are an AI consultant helping businesses identify the best AI use cases.

Business Context:
{json.dumps(business_context, indent=2)}

Available Use Cases:
{json.dumps(use_cases_summary, indent=2)}

Please analyze which use cases are most relevant for this business and rank the top 5-7 use cases.

Consider:
1. Alignment with their industry and business functions
2. Relevance to their pain points and goals
3. Their AI maturity level (simpler cases for beginners)
4. Quick wins vs long-term projects based on urgency
5. Expected business value and ROI

Provide a JSON response with ranked use cases:
{{
    "recommendations": [
        {{
            "index": <use_case_index>,
            "relevance_score": <0-100>,
            "reasoning": "why this use case is relevant",
            "priority": "high/medium/low"
        }}
    ]
}}

Only respond with valid JSON, no other text."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=3000,
            messages=[
                {"role": "user", "content": ranking_prompt}
            ]
        )

        response_text = message.content[0].text
        try:
            ranking_data = json.loads(response_text)
        except:
            ranking_data = self._extract_json_from_text(response_text)

        # Combine ranking with full use case details
        ranked_use_cases = []
        for rec in ranking_data.get("recommendations", []):
            idx = rec.get("index")
            if idx is not None and 0 <= idx < len(self.all_use_cases):
                use_case = self.all_use_cases[idx].copy()
                use_case["relevance_score"] = rec.get("relevance_score", 50)
                use_case["reasoning"] = rec.get("reasoning", "")
                use_case["priority"] = rec.get("priority", "medium")
                ranked_use_cases.append(use_case)

        return ranked_use_cases

    def generate_implementation_plan(
        self,
        use_case: Dict[str, Any],
        business_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate a detailed implementation plan for a specific use case
        """
        plan_prompt = f"""Create a detailed implementation plan for this AI use case:

Use Case: {use_case['name']}
Description: {use_case['description']}
Technologies: {', '.join(use_case['technologies'])}

Business Context:
Industry: {business_context.get('industry')}
AI Maturity: {business_context.get('current_maturity')}
Goals: {', '.join(business_context.get('goals', []))}

Create a comprehensive implementation plan in JSON format:
{{
    "executive_summary": "brief overview of the implementation",
    "prerequisites": ["required resources, skills, or systems"],
    "phases": [
        {{
            "phase_number": 1,
            "name": "phase name",
            "duration": "estimated time",
            "tasks": ["specific tasks"],
            "deliverables": ["what will be delivered"],
            "resources_needed": ["people, tools, or services needed"]
        }}
    ],
    "technology_stack": {{
        "core_ai": "Claude API or other AI service",
        "infrastructure": ["hosting, databases, etc."],
        "integrations": ["systems to integrate with"],
        "development_tools": ["frameworks, libraries"]
    }},
    "estimated_costs": {{
        "development": "cost range",
        "infrastructure": "monthly operational costs",
        "ai_api": "estimated API costs",
        "total_initial": "total initial investment"
    }},
    "success_metrics": ["KPIs to measure success"],
    "risks_and_mitigation": [
        {{
            "risk": "potential risk",
            "mitigation": "how to address it"
        }}
    ],
    "quick_start_steps": ["first 3-5 steps to get started immediately"]
}}

Only respond with valid JSON, no other text."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            messages=[
                {"role": "user", "content": plan_prompt}
            ]
        )

        response_text = message.content[0].text
        try:
            return json.loads(response_text)
        except:
            return self._extract_json_from_text(response_text)

    def get_recommendations(self, business_description: str) -> Dict[str, Any]:
        """
        Main method to get AI use case recommendations
        """
        # Step 1: Analyze business context
        business_context = self.analyze_business_context(business_description)

        # Step 2: Rank use cases
        ranked_use_cases = self.rank_use_cases(business_context)

        return {
            "business_context": business_context,
            "recommendations": ranked_use_cases
        }
