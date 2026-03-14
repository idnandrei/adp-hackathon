from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.ocr_service import ocr_upload

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/ocr-test")
async def ocr_test(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    file_bytes = await file.read()

    text = ocr_upload(
        file_bytes,
        content_type=file.content_type,
        filename=file.filename,
        ocr_lang="eng",
        max_pages=5,
    )

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "text": text,
    }


@router.get("/ping")
def ping():
    return {"ok": True, "service": "documents"}
