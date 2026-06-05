from fastapi import APIRouter
import os

router=APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

UPLOAD_FOLDER="uploads"

@router.get("/")
async def get_documents():
    documents=[]

    if os.path.exists(UPLOAD_FOLDER):
        for file in os.listdir(UPLOAD_FOLDER):
            if file.endswith(".pdf"):
                documents.append(
                    {
                        "name":file,
                        "size":os.path.getsize(
                            os.path.join(
                                UPLOAD_FOLDER,
                                file
                            )
                        )
                    }
                )
    return documents