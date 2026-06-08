print("1")

from fastapi import FastAPI

print("2")

from routers.upload import router as upload_router

print("3")

from routers.chat import router as chat_router

print("4")

from routers.documents import router as documents_router

print("5")

from routers.sessions import router as sessions_router

print("6")
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="ResearchAI API"
)

@app.get("/")
def root():
    return {"message": "ResearchAI API Running"}

app.include_router(
    upload_router,
    prefix="/upload",
    tags=["Upload"]
)

app.include_router(
    chat_router,
    prefix="/chat",
    tags=["Chat"]
)

app.include_router(
    documents_router
)

app.include_router(
    sessions_router,
    prefix="/sessions",
    tags=["Sessions"]    
)

import os

os.makedirs("uploads", exist_ok=True)

print("CWD:", os.getcwd())
print("Uploads exists:", os.path.exists("uploads"))

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)