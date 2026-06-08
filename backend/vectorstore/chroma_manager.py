from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import os

_embeddings = None

def get_embeddings():
    raise Exception("CALLEd")
    global _embeddings

    if _embeddings is None:
        print("LOADING EMBEDDINGS")

        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

    return _embeddings

PERSIST_DIRECTORY = "./chroma_db"
COLLECTION_NAME = "stock_market"


_vectorstore = None

def get_vectorstore():
    global _vectorstore

    if _vectorstore is None:
        _vectorstore = Chroma(
            persist_directory=PERSIST_DIRECTORY,
            collection_name=COLLECTION_NAME,
            embedding_function=get_embeddings(),
        )

    return _vectorstore


def ingest_pdf(pdf_path):
    """
    Load PDF and add its chunks to ChromaDB.
    """

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    pdf_loader = PyPDFLoader(pdf_path)

    pages = pdf_loader.load()

    filename = os.path.basename(pdf_path)

    for page in pages:
        page.metadata["source"] = filename

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )

    pages_split = text_splitter.split_documents(pages)

    vectorstore = get_vectorstore()

    vectorstore.add_documents(pages_split)

    print(f"Added {len(pages_split)} chunks from {filename}")

    return True


def get_retriever():
    """
    Returns retriever connected to current Chroma collection.
    """

    vectorstore = get_vectorstore()

    return vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 8,
            "fetch_k": 30
        }
    )


if __name__ == "__main__":
    retriever = get_retriever()

    docs = retriever.invoke("stock market")

    print(f"Retrieved {len(docs)} docs")

    for doc in docs:
        print("\n---")
        print(doc.page_content[:300])