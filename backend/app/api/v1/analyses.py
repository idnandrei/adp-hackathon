from typing import Annotated

from app.db.session import get_db
from app.schemas.analysis import AnalysisResult, RequestedOutputs
from app.services.analysis_service import run_analysis
from app.services.ocr_service import ocr_upload
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

router = APIRouter(prefix="/analyses", tags=["analyses"])

SessionDep = Annotated[Session, Depends(get_db)]


@router.post("", response_model=AnalysisResult)
async def analyze(
    db: SessionDep,
    email_text: str | None = Form(default=None),
    letter_text: str | None = Form(default=None),
    letter_file: UploadFile | None = File(default=None),
    outputs: RequestedOutputs = Depends(RequestedOutputs.as_form),
):
    has_letter_text = bool(letter_text and letter_text.strip())
    has_letter_file = letter_file is not None

    if has_letter_text == has_letter_file:
        raise HTTPException(
            status_code=400, detail="Provide exactly one of letter_text or letter_file."
        )

    requested_outputs = outputs.as_list()

    if has_letter_text:
        final_letter_text = (letter_text or "").strip()
    else:
        assert letter_file is not None
        file_bytes = await letter_file.read()
        final_letter_text = ocr_upload(
            file_bytes,
            content_type=letter_file.content_type,
            filename=letter_file.filename,
            ocr_lang="eng",
            max_pages=5,
        )
        if not final_letter_text.strip():
            raise HTTPException(status_code=400, detail="OCR produced empty text.")

    ctx = (email_text or "").strip()
    final_text = f"{ctx}\n\n{final_letter_text}" if ctx else final_letter_text

    return run_analysis(text=final_text, outputs=requested_outputs)
