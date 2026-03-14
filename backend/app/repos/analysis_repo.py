from sqlalchemy.orm import Session

from app.db.models.analysis import Analysis


def create_analysis(
    db: Session, requested_outputs: list[str], results: dict
) -> Analysis:
    row = Analysis(requested_outputs=requested_outputs, results=results)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def get_analysis(db: Session, analysis_id: int) -> Analysis | None:
    return db.get(Analysis, analysis_id)
