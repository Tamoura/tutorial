"""
Test scenarios for the AI Use Case Recommender
Run basic tests to verify functionality
"""

from use_cases_knowledge import (
    get_all_use_cases,
    get_quick_wins,
    get_by_industry,
    USE_CASE_CATEGORIES
)


def test_knowledge_base():
    """Test the knowledge base is properly structured"""
    print("Testing Knowledge Base...")

    # Test we have all categories
    assert len(USE_CASE_CATEGORIES) == 7, "Should have 7 categories"
    print(f"✓ Found {len(USE_CASE_CATEGORIES)} categories")

    # Test all use cases
    all_cases = get_all_use_cases()
    print(f"✓ Total use cases: {len(all_cases)}")

    # Test each use case has required fields
    required_fields = [
        'id', 'name', 'description', 'business_value',
        'difficulty', 'time_to_implement', 'technologies', 'industries'
    ]

    for uc in all_cases:
        for field in required_fields:
            assert field in uc, f"Use case {uc.get('id')} missing field: {field}"

    print(f"✓ All use cases have required fields")

    # Test quick wins
    quick_wins = get_quick_wins()
    print(f"✓ Quick wins: {len(quick_wins)}")

    # Test industry filtering
    retail_cases = get_by_industry("Retail")
    print(f"✓ Retail use cases: {len(retail_cases)}")

    print("\n✅ Knowledge base tests passed!\n")


def test_use_case_structure():
    """Display sample use cases"""
    print("Sample Use Cases:")
    print("-" * 80)

    all_cases = get_all_use_cases()

    # Show one from each category
    shown_categories = set()
    for uc in all_cases:
        category = uc['category']
        if category not in shown_categories:
            print(f"\n{uc['category_name']}")
            print(f"  └─ {uc['name']}")
            print(f"     Description: {uc['description']}")
            print(f"     Business Value: {uc['business_value']}")
            print(f"     Difficulty: {uc['difficulty']} | Time: {uc['time_to_implement']}")
            print(f"     Technologies: {', '.join(uc['technologies'][:3])}")
            shown_categories.add(category)

    print("\n" + "=" * 80)


def display_statistics():
    """Display statistics about the knowledge base"""
    print("\n📊 Knowledge Base Statistics")
    print("=" * 80)

    all_cases = get_all_use_cases()

    # By difficulty
    difficulty_counts = {}
    for uc in all_cases:
        diff = uc['difficulty']
        difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1

    print("\nBy Difficulty:")
    for diff, count in sorted(difficulty_counts.items()):
        print(f"  {diff}: {count} use cases")

    # By category
    print("\nBy Category:")
    for cat_key, cat_data in USE_CASE_CATEGORIES.items():
        count = len(cat_data['use_cases'])
        print(f"  {cat_data['name']}: {count} use cases")

    # Quick wins
    quick_wins = get_quick_wins()
    print(f"\nQuick Wins: {len(quick_wins)} use cases")

    # Most common technologies
    tech_counts = {}
    for uc in all_cases:
        for tech in uc['technologies']:
            tech_counts[tech] = tech_counts.get(tech, 0) + 1

    print("\nTop Technologies:")
    sorted_techs = sorted(tech_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    for tech, count in sorted_techs:
        print(f"  {tech}: {count} use cases")

    print("=" * 80)


def show_example_queries():
    """Show example business descriptions for testing"""
    print("\n📝 Example Business Descriptions for Testing")
    print("=" * 80)

    examples = [
        {
            "title": "E-commerce Customer Service",
            "description": "I run an online electronics store with 2000 daily visitors and 500+ customer inquiries via email and chat. My support team of 3 people is overwhelmed, and response times have grown to 24+ hours. We need to scale support without hiring more staff."
        },
        {
            "title": "Legal Document Processing",
            "description": "Our law firm handles 200+ contracts monthly. Paralegals spend 60% of their time manually extracting key terms, dates, and clauses from lengthy documents. This is error-prone and delays client service."
        },
        {
            "title": "SaaS Content Marketing",
            "description": "I lead marketing at a B2B SaaS startup. We need to publish 3 blog posts and 20 social media updates weekly, but our content team is just 2 people. We're struggling to maintain consistent output and quality."
        },
        {
            "title": "HR Resume Screening",
            "description": "Our tech company receives 300+ applications per week for various engineering positions. HR and hiring managers spend 15+ hours weekly on initial resume screening, which delays the hiring process significantly."
        },
        {
            "title": "Finance Invoice Processing",
            "description": "We're a mid-sized accounting firm processing 600+ client invoices monthly. Manual data entry from PDF and paper invoices takes 40+ hours per month and we frequently have data entry errors that require corrections."
        }
    ]

    for i, ex in enumerate(examples, 1):
        print(f"\n{i}. {ex['title']}")
        print(f"   \"{ex['description']}\"")

    print("\n" + "=" * 80)


if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("AI Use Case Recommender - Test Suite")
    print("=" * 80)

    # Run tests
    test_knowledge_base()
    test_use_case_structure()
    display_statistics()
    show_example_queries()

    print("\n✅ All tests completed successfully!")
    print("\nNext steps:")
    print("  1. Set up your .env file with ANTHROPIC_API_KEY")
    print("  2. Run: python ai_recommender.py examples")
    print("  3. Run: python ai_recommender.py recommend --interactive")
    print()
