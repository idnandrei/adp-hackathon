from sqlalchemy.orm import Session

from app.repos.analysis_repo import create_analysis


def run_analysis(db: Session, text: str, outputs: list[str]) -> dict:
    # Dummy placeholders for now (later replaced by LLM output)
    results = {k: {} for k in outputs}

    row = create_analysis(db, requested_outputs=outputs, results=results)

    return {
        "id": row.id,
        "requested_outputs": row.requested_outputs,
        "results": row.results,
    }
