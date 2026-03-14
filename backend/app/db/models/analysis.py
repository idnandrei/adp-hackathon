from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer
from sqlalchemy.dialects.postgresql import JSONB

from app.db.models.base import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    requested_outputs = Column(JSONB, nullable=False, default=list)
    results = Column(JSONB, nullable=False, default=dict)
