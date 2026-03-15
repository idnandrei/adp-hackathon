from app.schemas.analysis import AnalysisResult


def run_analysis(text: str, outputs: list[str]) -> AnalysisResult:
    # Minimal dummy results for now (replace later)
    results: dict = {}

    if "summary" in outputs:
        results["summary"] = "Dummy summary."

    if "checklist" in outputs:
        results["checklist"] = [
            {"text": "Dummy action item 1"},
            {"text": "Dummy action item 2"},
        ]

    if "deadlines" in outputs:
        results["deadlines"] = [
            {"date": "2026-04-10", "label": "Dummy deadline"},
        ]

    if "reply_draft" in outputs:
        results["reply_draft"] = (
            "Dear Sir/Madam,\n\nDummy reply draft.\n\nKind regards,\n[YOUR NAME]"
        )

    return AnalysisResult(results=results)
