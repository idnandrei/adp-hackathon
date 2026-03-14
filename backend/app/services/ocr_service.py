from __future__ import annotations

import io

import fitz  # PyMuPDF
import pytesseract
from PIL import Image


def ocr_upload(
    file_bytes: bytes,
    *,
    content_type: str | None,
    filename: str | None,
    ocr_lang: str = "eng",
    max_pages: int = 5,
) -> str:
    ct = (content_type or "").lower()
    name = (filename or "").lower()

    is_pdf = ("pdf" in ct) or name.endswith(".pdf")
    if is_pdf:
        return ocr_pdf(file_bytes, ocr_lang=ocr_lang, max_pages=max_pages)

    return ocr_image(file_bytes, ocr_lang=ocr_lang)


def ocr_pdf(pdf_bytes: bytes, *, ocr_lang: str = "eng", max_pages: int = 5) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    out: list[str] = []

    pages = min(doc.page_count, max_pages)
    for i in range(pages):
        page = doc.load_page(i)

        mat = fitz.Matrix(2.0, 2.0)
        pix = page.get_pixmap(matrix=mat)

        png_bytes = pix.tobytes("png")

        # ✅ Convert bytes -> PIL Image -> OCR
        img = Image.open(io.BytesIO(png_bytes))
        out.append(pytesseract.image_to_string(img, lang=ocr_lang).strip())

    return "\n\n".join([t for t in out if t]).strip()


def ocr_image(image_bytes: bytes, *, ocr_lang: str = "eng") -> str:
    img = Image.open(io.BytesIO(image_bytes))
    return pytesseract.image_to_string(img, lang=ocr_lang).strip()
