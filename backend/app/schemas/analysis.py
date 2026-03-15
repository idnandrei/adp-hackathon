from fastapi import Form
from pydantic import BaseModel, model_validator


class RequestedOutputs(BaseModel):
    summary: bool = False
    checklist: bool = False
    deadlines: bool = False
    reply_draft: bool = False

    @classmethod
    def as_form(
        cls,
        summary: bool = Form(False),
        checklist: bool = Form(False),
        deadlines: bool = Form(False),
        reply_draft: bool = Form(False),
    ) -> "RequestedOutputs":
        return cls(
            summary=summary,
            checklist=checklist,
            deadlines=deadlines,
            reply_draft=reply_draft,
        )

    @model_validator(mode="after")
    def at_least_one_selected(self):
        if not (self.summary or self.checklist or self.deadlines or self.reply_draft):
            raise ValueError("Select at least one output type.")
        return self

    def as_list(self) -> list[str]:
        out: list[str] = []
        if self.summary:
            out.append("summary")
        if self.checklist:
            out.append("checklist")
        if self.deadlines:
            out.append("deadlines")
        if self.reply_draft:
            out.append("reply_draft")
        return out


class AnalysisResult(BaseModel):
    # Minimal: only what the UI needs to render based on selected outputs
    results: dict
