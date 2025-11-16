# Quick Start Guide

Get AI use case recommendations in 3 minutes!

## Step 1: Setup (2 minutes)

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Get Your API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key

### Configure
```bash
cp .env.example .env
```

Edit `.env` and add your key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

## Step 2: Run Your First Query (1 minute)

### Option A: Interactive Mode (Recommended)
```bash
python ai_recommender.py recommend --interactive
```

Then describe your business when prompted. For example:
> "I run an online retail store. We get hundreds of customer questions daily about products and shipping. Our small team can't keep up with email volume."

### Option B: Direct Query
```bash
python ai_recommender.py recommend "I manage HR at a mid-sized company. We receive 150+ job applications weekly and manual resume screening takes forever."
```

## Step 3: Explore Recommendations

The tool will show you:
- ✅ Business analysis summary
- ✅ Top 5-7 ranked AI use cases
- ✅ Quick wins vs. strategic projects
- ✅ Implementation difficulty and timeline

Choose a use case to get a detailed implementation plan!

## Example Use Cases to Try

### E-commerce / Retail
```
"I run an online clothing store with 1000+ daily orders. Customer service inquiries about sizing, shipping, and returns are overwhelming our team of 5 support agents."
```

### Professional Services
```
"I'm a partner at a consulting firm. We spend countless hours writing proposals and reports for clients. Each proposal takes 20-30 hours of partner time."
```

### SaaS / Technology
```
"I lead product at a B2B SaaS company. Our engineers spend too much time on code reviews and documentation instead of building features."
```

### Healthcare
```
"I manage a medical practice with 10 doctors. Patient appointment scheduling, follow-ups, and basic inquiries consume our staff's time."
```

### Finance / Accounting
```
"Our accounting firm processes 500+ client invoices monthly. Manual data entry from PDFs is time-consuming and prone to errors."
```

## Tips for Best Results

### ✅ DO:
- Describe specific pain points
- Mention volume/scale (e.g., "500 emails/day")
- Include your industry
- Mention your goals
- Be specific about processes

### ❌ DON'T:
- Be too vague ("we need AI")
- Skip the problem description
- Just list technology you want to use

## What You'll Get

### 1. Business Analysis
- Industry identification
- Key business functions
- Pain points extracted
- Goals identified
- AI maturity assessment

### 2. Ranked Recommendations
Each recommendation includes:
- **Use Case Name & Description**
- **Relevance Score** (0-100)
- **Priority Level** (High/Medium/Low)
- **Business Value** (ROI potential)
- **Difficulty** (Low/Medium/High)
- **Time to Implement** (weeks)
- **Quick Win** indicator
- **Technologies Required**
- **Why It Fits** (personalized reasoning)

### 3. Implementation Plan (Optional)
- Executive summary
- Quick start steps (do this today!)
- Prerequisites
- Detailed phases with tasks
- Technology stack
- Cost estimates
- Success metrics
- Risks & mitigation

## Command Cheat Sheet

```bash
# Interactive mode
python ai_recommender.py recommend -i

# Direct query
python ai_recommender.py recommend "your description"

# See examples
python ai_recommender.py examples

# Get help
python ai_recommender.py --help

# Version info
python ai_recommender.py version
```

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
- Make sure you created `.env` file
- Check that the key is correct
- No quotes needed around the key in `.env`

### "Module not found"
```bash
pip install -r requirements.txt
```

### API Errors
- Verify your API key is valid
- Check your Anthropic account has credits
- Ensure you have internet connection

## Next Steps

After getting recommendations:

1. **Save the plan**: The tool can save JSON files with full details
2. **Share with team**: Show stakeholders the business case
3. **Start with quick wins**: Look for "Quick Win: ✓ Yes" use cases
4. **Estimate resources**: Review the implementation plan
5. **Prioritize**: Focus on high-priority, low-difficulty cases first

## Need More Help?

- Run `python ai_recommender.py examples` for sample descriptions
- Check `README.md` for detailed documentation
- Review `use_cases_knowledge.py` to see all 50+ use cases
- Modify descriptions to be more specific to your business

---

**Ready to discover your AI opportunities? Let's go! 🚀**
