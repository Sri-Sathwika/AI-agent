from fastapi import APIRouter, UploadFile, File
from vectorstore.chroma_manager import ingest_pdf
import os

router = APIRouter()

@router.post("/")
async def upload_pdf(
    file: UploadFile = File(...)
):

    upload_dir = "uploads"

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_dir,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(
            await file.read()
         )
    ingest_pdf(file_path)
    return {
        "message": "PDF uploaded",
        "filename": file.filename
    }