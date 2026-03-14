from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.analysis import AnalysisCreateResponse, RequestedOutputs
from app.services.analysis_service import run_analysis
from app.services.ocr_service import ocr_upload

router = APIRouter(prefix="/analyses", tags=["analyses"])


SessionDep = Annotated[Session, Depends(get_db)]


@router.post("", response_model=AnalysisCreateResponse)
async def analyze(
    db: SessionDep,
    email_text: str | None = Form(default=None),
    letter_text: str | None = Form(default=None),
    letter_file: UploadFile | None = File(default=None),
    outputs: RequestedOutputs = Depends(RequestedOutputs.as_form),
):
    # 1) Enforce: exactly one of letter_text or letter_file
    has_letter_text = bool(letter_text and letter_text.strip())
    has_letter_file = letter_file is not None

    if has_letter_text == has_letter_file:
        raise HTTPException(
            status_code=400,
            detail="Provide exactly one of letter_text or letter_file.",
        )

    # 2) Convert checkbox model -> list[str]
    requested_outputs = outputs.as_list()

    # 3) Get the final letter text

    if letter_text is not None and letter_text.strip():
        final_letter_text = letter_text.strip()
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

    # 4) Add optional email context (simple + standard)
    # (This doesn’t change your service signature — we just prepend context.)
    context = (email_text or "").strip()
    if context:
        final_text = f"EMAIL CONTEXT:\n{context}\n\nLETTER:\n{final_letter_text}"
    else:
        final_text = final_letter_text

    # 5) Run analysis (still dummy results inside run_analysis for now)
    return run_analysis(db=db, text=final_text, outputs=requested_outputs)
