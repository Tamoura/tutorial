# AI Use Case Recommender

An intelligent tool that helps business leaders discover relevant AI use cases for their domain, business processes, or tasks. Simply describe your business challenge, and get personalized AI recommendations with detailed implementation plans.

## Features

- **Intelligent Analysis**: Uses Claude AI to understand your business context
- **Personalized Recommendations**: Get 5-7 ranked AI use cases tailored to your needs
- **Implementation Guidance**: Detailed implementation plans with phases, costs, and timelines
- **Industry-Aware**: Covers 50+ use cases across 7 business functions
- **Priority Scoring**: Identifies quick wins vs. long-term strategic initiatives
- **Interactive CLI**: Beautiful command-line interface with rich formatting

## Use Cases Covered

### 7 Business Function Categories:
1. **Customer Service & Support** - Chatbots, email automation, sentiment analysis
2. **Operations & Process Automation** - Document processing, workflow automation
3. **Sales & Marketing** - Content generation, lead scoring, personalization
4. **HR & Talent Management** - Resume screening, onboarding, learning paths
5. **Finance & Accounting** - Invoice processing, financial analysis, fraud detection
6. **Product Development** - Code review, documentation, bug triage
7. **Data & Analytics** - Natural language queries, report generation, data cleaning

### Industries Supported:
Retail, E-commerce, SaaS, Finance, Healthcare, Manufacturing, Legal, Government, and more.

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tutorial
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up your API key:
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Usage

#### Interactive Mode (Recommended for first-time users):
```bash
python ai_recommender.py recommend --interactive
```

#### Direct Mode:
```bash
python ai_recommender.py recommend "I run an e-commerce store with 500+ daily customer emails. Our support team is overwhelmed."
```

#### See Examples:
```bash
python ai_recommender.py examples
```

## How It Works

1. **Describe Your Business**: Provide details about your industry, processes, or challenges
2. **AI Analysis**: Claude AI analyzes your context to extract:
   - Industry and business functions
   - Pain points and goals
   - AI maturity level
   - Urgency and priorities

3. **Get Recommendations**: Receive ranked use cases with:
   - Relevance score and reasoning
   - Business value and ROI potential
   - Difficulty and timeline
   - Required technologies
   - Priority level (High/Medium/Low)

4. **Implementation Plan**: Choose a use case to get:
   - Executive summary
   - Quick start steps
   - Detailed implementation phases
   - Technology stack recommendations
   - Cost estimates
   - Success metrics
   - Risk mitigation strategies

## Example Session

```
$ python ai_recommender.py recommend --interactive

Welcome! This tool helps business leaders discover relevant AI use cases
for their domain, processes, or tasks.

Tell me about your business:
Your description: I manage customer support for a SaaS company.
We receive 300 tickets daily and struggle with response times.

Analyzing your business...

Business Analysis:
Industry: SaaS
Business Functions: customer service, support
AI Maturity: beginner
Urgency: high

Recommended AI Use Cases:

1. AI-Powered Customer Support Chatbot - HIGH PRIORITY
   Category: Customer Service & Support
   Business Value: Reduce support costs by 40-60%, improve response times
   Difficulty: Medium
   Time to Implement: 4-8 weeks
   Quick Win: ✓ Yes
   Why This Fits: Directly addresses high ticket volume and response time issues

2. Automated Email Response System - HIGH PRIORITY
   ...
```

## Command Reference

### Main Commands

- `recommend` - Get AI use case recommendations
- `examples` - Show example business descriptions
- `version` - Show version information

### Options

- `--interactive` / `-i` - Use interactive mode with prompts
- `--help` - Show help for any command

## Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

### Customizing Use Cases

The knowledge base is defined in `use_cases_knowledge.py`. You can:
- Add new use cases
- Modify existing ones
- Create new categories
- Adjust difficulty levels and timelines

## Architecture

```
ai_recommender.py          # CLI interface (Typer + Rich)
├── recommender_engine.py  # Core recommendation logic
├── use_cases_knowledge.py # Use case knowledge base
└── .env                   # API configuration
```

### Key Components

1. **UseCaseRecommender**: Main engine that orchestrates the recommendation process
2. **Business Context Analysis**: Extracts structured information from descriptions
3. **Ranking Algorithm**: Uses Claude to match and rank use cases
4. **Implementation Planner**: Generates detailed implementation roadmaps

## Advanced Usage

### Programmatic Access

You can use the recommender in your own Python code:

```python
from recommender_engine import UseCaseRecommender

recommender = UseCaseRecommender()

# Get recommendations
results = recommender.get_recommendations(
    "Your business description here"
)

# Access recommendations
for rec in results['recommendations']:
    print(f"{rec['name']}: {rec['relevance_score']}")

# Generate implementation plan
plan = recommender.generate_implementation_plan(
    results['recommendations'][0],
    results['business_context']
)
```

### Saving Results

The tool allows you to save implementation plans as JSON files for later reference or sharing with stakeholders.

## Cost Considerations

This tool uses the Claude API, which charges per token. Typical costs per query:

- Business analysis: ~$0.01-0.02
- Recommendations (5-7 use cases): ~$0.02-0.05
- Implementation plan: ~$0.03-0.07

**Total per session: ~$0.06-0.14** (depending on complexity)

For high-volume usage, consider implementing caching or batch processing.

## Roadmap

Future enhancements:
- [ ] Web interface
- [ ] Save and compare multiple scenarios
- [ ] ROI calculator
- [ ] Export to PDF/PowerPoint
- [ ] Integration with project management tools
- [ ] Multi-language support
- [ ] Custom use case templates
- [ ] Team collaboration features

## Contributing

Contributions are welcome! Areas for improvement:
- Additional use cases and industries
- More detailed implementation templates
- Better cost estimation algorithms
- Integration with popular business tools

## License

MIT License - feel free to use and modify for your needs.

## Support

For issues or questions:
- Check the examples: `python ai_recommender.py examples`
- Review the implementation in `recommender_engine.py`
- Ensure your API key is correctly configured

## Credits

Built with:
- [Claude AI](https://anthropic.com) - Intelligent analysis and recommendations
- [Typer](https://typer.tiangolo.com/) - CLI framework
- [Rich](https://rich.readthedocs.io/) - Terminal formatting
- [Anthropic Python SDK](https://github.com/anthropics/anthropic-sdk-python)

---

**Made for business leaders who want to harness AI effectively** 🚀
