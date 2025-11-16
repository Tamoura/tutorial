#!/usr/bin/env python3
"""
AI Use Case Recommender CLI
A tool for business leaders to discover relevant AI use cases
"""

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.prompt import Prompt, Confirm
from rich.markdown import Markdown
from rich import print as rprint
from rich.progress import Progress, SpinnerColumn, TextColumn
import json
from typing import Optional
from recommender_engine import UseCaseRecommender

app = typer.Typer(
    help="AI Use Case Recommender - Discover AI opportunities for your business"
)
console = Console()


def display_welcome():
    """Display welcome message"""
    welcome_text = """
# AI Use Case Recommender

Welcome! This tool helps business leaders discover relevant AI use cases
for their domain, processes, or tasks.

Simply describe your business, and I'll recommend the best AI use cases
with implementation guidance.
    """
    console.print(Panel(Markdown(welcome_text), border_style="blue"))


def display_business_context(context: dict):
    """Display analyzed business context"""
    console.print("\n[bold cyan]Business Analysis:[/bold cyan]")

    table = Table(show_header=False, box=None)
    table.add_column("Field", style="cyan")
    table.add_column("Value", style="white")

    table.add_row("Industry", context.get("industry", "N/A"))
    table.add_row(
        "Business Functions",
        ", ".join(context.get("business_functions", []))
    )
    table.add_row("AI Maturity", context.get("current_maturity", "N/A"))
    table.add_row("Urgency", context.get("urgency", "N/A"))

    if context.get("pain_points"):
        table.add_row(
            "Pain Points",
            "\n• " + "\n• ".join(context.get("pain_points", []))
        )

    if context.get("goals"):
        table.add_row(
            "Goals",
            "\n• " + "\n• ".join(context.get("goals", []))
        )

    console.print(table)


def display_recommendations(recommendations: list):
    """Display recommended use cases in a table"""
    console.print("\n[bold green]Recommended AI Use Cases:[/bold green]\n")

    for idx, rec in enumerate(recommendations, 1):
        # Priority badge
        priority_color = {
            "high": "red",
            "medium": "yellow",
            "low": "blue"
        }.get(rec.get("priority", "medium"), "white")

        # Create panel for each recommendation
        table = Table(show_header=False, box=None, padding=(0, 1))
        table.add_column("Field", style="cyan", width=20)
        table.add_column("Value", style="white")

        table.add_row("Category", rec.get("category_name", ""))
        table.add_row("Business Value", rec.get("business_value", ""))
        table.add_row("Difficulty", rec.get("difficulty", ""))
        table.add_row("Time to Implement", rec.get("time_to_implement", ""))
        table.add_row("Technologies", ", ".join(rec.get("technologies", [])))

        if rec.get("quick_wins"):
            table.add_row("Quick Win", "✓ Yes")

        if rec.get("reasoning"):
            table.add_row("Why This Fits", rec.get("reasoning", ""))

        title = f"{idx}. {rec['name']} - [{priority_color}]{rec.get('priority', 'medium').upper()} PRIORITY[/{priority_color}]"
        subtitle = rec.get("description", "")

        console.print(Panel(
            table,
            title=title,
            subtitle=subtitle,
            border_style=priority_color
        ))
        console.print()


def display_implementation_plan(plan: dict, use_case_name: str):
    """Display implementation plan"""
    console.print(f"\n[bold green]Implementation Plan: {use_case_name}[/bold green]\n")

    # Executive Summary
    console.print(Panel(
        plan.get("executive_summary", ""),
        title="Executive Summary",
        border_style="blue"
    ))

    # Quick Start Steps
    if plan.get("quick_start_steps"):
        console.print("\n[bold cyan]Quick Start Steps:[/bold cyan]")
        for idx, step in enumerate(plan.get("quick_start_steps", []), 1):
            console.print(f"  {idx}. {step}")

    # Prerequisites
    if plan.get("prerequisites"):
        console.print("\n[bold cyan]Prerequisites:[/bold cyan]")
        for prereq in plan.get("prerequisites", []):
            console.print(f"  • {prereq}")

    # Implementation Phases
    if plan.get("phases"):
        console.print("\n[bold cyan]Implementation Phases:[/bold cyan]\n")
        for phase in plan.get("phases", []):
            phase_table = Table(show_header=False, box=None)
            phase_table.add_column("Field", style="cyan", width=20)
            phase_table.add_column("Value", style="white")

            phase_table.add_row("Duration", phase.get("duration", ""))

            if phase.get("tasks"):
                phase_table.add_row(
                    "Tasks",
                    "\n• " + "\n• ".join(phase.get("tasks", []))
                )

            if phase.get("deliverables"):
                phase_table.add_row(
                    "Deliverables",
                    "\n• " + "\n• ".join(phase.get("deliverables", []))
                )

            console.print(Panel(
                phase_table,
                title=f"Phase {phase.get('phase_number', '')}: {phase.get('name', '')}",
                border_style="green"
            ))

    # Technology Stack
    if plan.get("technology_stack"):
        console.print("\n[bold cyan]Technology Stack:[/bold cyan]")
        tech = plan.get("technology_stack", {})
        for key, value in tech.items():
            if isinstance(value, list):
                console.print(f"  {key.replace('_', ' ').title()}: {', '.join(value)}")
            else:
                console.print(f"  {key.replace('_', ' ').title()}: {value}")

    # Estimated Costs
    if plan.get("estimated_costs"):
        console.print("\n[bold cyan]Estimated Costs:[/bold cyan]")
        costs = plan.get("estimated_costs", {})
        for key, value in costs.items():
            console.print(f"  {key.replace('_', ' ').title()}: {value}")

    # Success Metrics
    if plan.get("success_metrics"):
        console.print("\n[bold cyan]Success Metrics:[/bold cyan]")
        for metric in plan.get("success_metrics", []):
            console.print(f"  • {metric}")

    # Risks and Mitigation
    if plan.get("risks_and_mitigation"):
        console.print("\n[bold cyan]Risks and Mitigation:[/bold cyan]")
        for risk_item in plan.get("risks_and_mitigation", []):
            console.print(f"  Risk: {risk_item.get('risk', '')}")
            console.print(f"  Mitigation: {risk_item.get('mitigation', '')}\n")


@app.command()
def recommend(
    description: Optional[str] = typer.Argument(
        None,
        help="Describe your business, domain, process, or task"
    ),
    interactive: bool = typer.Option(
        False,
        "--interactive",
        "-i",
        help="Use interactive mode"
    )
):
    """
    Get AI use case recommendations for your business
    """
    display_welcome()

    # Get business description
    if not description and not interactive:
        interactive = True

    if interactive or not description:
        console.print("\n[bold]Tell me about your business:[/bold]")
        console.print("You can describe:")
        console.print("  • Your industry and business domain")
        console.print("  • Specific processes or workflows")
        console.print("  • Tasks that take a lot of time")
        console.print("  • Problems you're trying to solve\n")

        description = Prompt.ask("[cyan]Your description[/cyan]")

    # Initialize recommender
    try:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            progress.add_task(description="Analyzing your business...", total=None)

            recommender = UseCaseRecommender()
            results = recommender.get_recommendations(description)

    except ValueError as e:
        console.print(f"\n[red]Error: {e}[/red]")
        console.print("\n[yellow]Please create a .env file with your ANTHROPIC_API_KEY[/yellow]")
        console.print("See .env.example for reference")
        raise typer.Exit(1)
    except Exception as e:
        console.print(f"\n[red]Error: {e}[/red]")
        raise typer.Exit(1)

    # Display results
    business_context = results.get("business_context", {})
    recommendations = results.get("recommendations", [])

    display_business_context(business_context)
    display_recommendations(recommendations)

    # Offer detailed implementation plan
    if recommendations and Confirm.ask(
        "\n[cyan]Would you like a detailed implementation plan for any of these use cases?[/cyan]"
    ):
        choice = Prompt.ask(
            "[cyan]Enter the number of the use case[/cyan]",
            choices=[str(i) for i in range(1, len(recommendations) + 1)]
        )

        selected_use_case = recommendations[int(choice) - 1]

        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            progress.add_task(
                description="Generating implementation plan...",
                total=None
            )

            plan = recommender.generate_implementation_plan(
                selected_use_case,
                business_context
            )

        display_implementation_plan(plan, selected_use_case["name"])

        # Save plan option
        if Confirm.ask("\n[cyan]Save this plan to a file?[/cyan]"):
            filename = Prompt.ask(
                "[cyan]Filename[/cyan]",
                default=f"implementation_plan_{selected_use_case['id']}.json"
            )

            output = {
                "use_case": selected_use_case,
                "business_context": business_context,
                "implementation_plan": plan
            }

            with open(filename, 'w') as f:
                json.dump(output, f, indent=2)

            console.print(f"\n[green]Plan saved to {filename}[/green]")


@app.command()
def examples():
    """
    Show example business descriptions you can use
    """
    console.print(Panel(
        """[bold]Example Business Descriptions:[/bold]

1. Customer Service:
   "I run an e-commerce store selling electronics. We get 500+ customer emails
   daily asking about order status, returns, and product questions. My support
   team is overwhelmed and response times are slow."

2. Operations:
   "We're a legal firm that processes hundreds of contracts monthly. Paralegals
   spend 60% of their time extracting key terms and clauses manually. We need
   to speed this up."

3. Sales & Marketing:
   "I'm head of marketing at a B2B SaaS company. We need to create blog posts,
   social media content, and email campaigns but our content team is small.
   We want to scale content production."

4. HR:
   "Our recruiting team reviews 200+ resumes per week for various positions.
   Initial screening takes too long and we sometimes miss good candidates.
   We need a better filtering process."

5. Finance:
   "We're an accounting firm processing client invoices. Data entry from paper
   and PDF invoices is time-consuming and error-prone. We want to automate
   this workflow."
        """,
        title="Examples",
        border_style="green"
    ))


@app.command()
def version():
    """Show version information"""
    console.print("[cyan]AI Use Case Recommender v1.0.0[/cyan]")
    console.print("Powered by Claude AI")


if __name__ == "__main__":
    app()
