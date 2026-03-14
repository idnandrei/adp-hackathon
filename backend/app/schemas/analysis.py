from fastapi import Form
from pydantic import BaseModel, model_validator


class RequestedOutputs(BaseModel):
    summary: bool = False
    deadlines: bool = False
    checklist: bool = False
    reply_draft: bool = False

    @model_validator(mode="after")
    def at_least_one_selected(self):
        if not (self.summary or self.deadlines or self.checklist or self.reply_draft):
            raise ValueError("Select at least one output type.")
        return self

    def as_list(self) -> list[str]:
        outputs: list[str] = []
        if self.summary:
            outputs.append("summary")
        if self.deadlines:
            outputs.append("deadlines")
        if self.checklist:
            outputs.append("checklist")
        if self.reply_draft:
            outputs.append("reply_draft")
        return outputs

    @classmethod
    def as_form(
        cls,
        summary: bool = Form(False),
        deadlines: bool = Form(False),
        checklist: bool = Form(False),
        reply_draft: bool = Form(False),
    ) -> "RequestedOutputs":
        return cls(
            summary=summary,
            deadlines=deadlines,
            checklist=checklist,
            reply_draft=reply_draft,
        )


class AnalysisCreateRequest(BaseModel):
    text: str
    outputs: RequestedOutputs


class AnalysisCreateResponse(BaseModel):
    id: int
    requested_outputs: list[str]
    results: dict
