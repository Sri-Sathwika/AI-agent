# AI-Agent: ResearchAI API

A full-stack AI research assistant application featuring a RAG (Retrieval-Augmented Generation) agent powered by Google Gemini, document processing, and a modern Next.js frontend.

## Overview

**ResearchAI** is an intelligent document-based Q&A system that allows users to:
- Upload PDF documents
- Ask questions about the uploaded documents
- Receive AI-powered answers with source citations
- Maintain conversation history with session management

The application uses a **Retrieval-Augmented Generation (RAG)** approach to ensure answers are grounded in the actual document content rather than relying solely on the LLM's training data.

## Architecture

### Backend
- **Framework**: FastAPI
- **AI/LLM**: Google Generative AI (Gemini 2.5 Flash)
- **Vector Store**: Chroma (for document embeddings)
- **Agent Framework**: LangGraph
- **PDF Processing**: PyPDF

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **UI Components**: Lucide React Icons
- **Markdown**: React Markdown

## Features

- **Document Upload**: Upload PDF files to the knowledge base
- **Smart Retrieval**: Vector-based document retrieval with Chroma
- **Multi-turn Conversations**: Maintain session history and context
- **Source Attribution**: All answers include document sources and page numbers
- **RAG Agent**: LangGraph-powered agent with tool calling capabilities
- **REST API**: FastAPI backend with CORS support
- **Modern UI**: Responsive Next.js frontend with Tailwind styling

## Tech Stack

### Backend Dependencies (Key)
- `fastapi` - Web framework
- `google-genai` - Google's Generative AI API
- `langchain` - LLM framework and utilities
- `langgraph` - Agentic framework for building RAG workflows
- `chromadb` - Vector database
- `pypdf` - PDF processing
- `uvicorn` - ASGI server

### Frontend Dependencies (Key)
- `next` - React framework
- `react` - UI library
- `react-hot-toast` - Toast notifications
- `react-markdown` - Markdown rendering
- `axios` - HTTP client
- `tailwindcss` - CSS framework

## Project Structure

```
AI-agent/
├── backend/
│   ├── agents/
│   │   └── rag_agent.py          # RAG agent implementation using LangGraph
│   ├── routers/
│   │   ├── chat.py               # Chat endpoint with session history
│   │   ├── upload.py             # PDF upload endpoint
│   │   ├── documents.py          # Document management
│   │   └── sessions.py           # Session management
│   ├── memory/
│   │   └── chat_memory.py        # Session chat history management
│   ├── vectorstore/
│   │   └── chroma_manager.py     # Chroma vector store management
│   ├── main.py                   # FastAPI app initialization
│   └── requirements.txt          # Python dependencies
├── client/
│   ├── src/                      # React components
│   ├── public/                   # Static assets
│   ├── package.json              # Node.js dependencies
│   └── next.config.ts            # Next.js configuration
└── README.md
```

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- Google API Key (for Gemini)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your Google API key
   # GOOGLE_API_KEY=your_api_key_here
   ```

5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

## Usage

### 1. Upload Documents
- Navigate to the frontend (http://localhost:3000)
- Upload PDF documents using the upload feature
- Documents are processed and stored in the vector database

### 2. Ask Questions
- Type your question in the chat interface
- The RAG agent retrieves relevant document chunks
- Gemini generates answers based on the retrieved context
- Answers include source citations with page numbers

### 3. Manage Sessions
- Each conversation session is tracked
- Session history is maintained for context awareness
- Previous messages inform future responses

## 🔌 API Endpoints

### Chat
- **POST** `/chat/` - Send a message and get a response
  ```json
  {
    "session_id": "session-123",
    "message": "What is the main topic?"
  }
  ```

### Upload
- **POST** `/upload/` - Upload a PDF file
  - Form: `file` (multipart/form-data)

### Documents
- **GET** `/documents/` - List uploaded documents
- **DELETE** `/documents/{id}` - Delete a document

### Sessions
- **GET** `/sessions/` - List all sessions
- **GET** `/sessions/{id}` - Get session details

## How the RAG Agent Works

1. **User Query**: User sends a question through the chat interface
2. **LLM Processing**: The query is sent to the RAG agent's LLM component
3. **Tool Calling**: The LLM decides if it needs to search documents
4. **Document Retrieval**: If needed, the retriever tool searches the vector store
5. **Context Enrichment**: Relevant document chunks are retrieved with metadata
6. **Answer Generation**: The LLM generates a comprehensive answer using the context
7. **Response**: The answer with source citations is returned to the user

## Environment Variables

Create a `.env` file in the backend directory:
```
GOOGLE_API_KEY=your_google_api_key
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Key Routers

### `/chat` - Chat Router
Handles multi-turn conversations with session management and RAG agent integration.

### `/upload` - Upload Router
Manages PDF file uploads and ingestion into the vector store.

### `/documents` - Documents Router
Manages document metadata and retrieval.

### `/sessions` - Sessions Router
Manages conversation sessions and history.

## Development

### Backend Development
- API runs on `http://localhost:8000`
- API documentation at `http://localhost:8000/docs` (Swagger UI)
- Hot reload enabled with `--reload` flag

### Frontend Development
- Frontend runs on `http://localhost:3000`
- Hot reload enabled by default
- TypeScript support for type safety

## Deployment

### Backend Deployment
The backend is designed to be deployed on:
- Heroku
- AWS Lambda
- Google Cloud Run
- Any ASGI-compatible hosting

### Frontend Deployment
The frontend is deployed on Vercel (see `.vercel.json` or `next.config.ts`).

## Key Technologies Explained

### LangChain & LangGraph
- **LangChain**: Provides utilities for working with LLMs, including tools, memory, and chains
- **LangGraph**: Builds stateful, multi-actor applications; used here for the agentic RAG workflow

### Chroma
Vector database for semantic search of document embeddings, enabling efficient retrieval of relevant chunks.

### Google Generative AI
Powers the LLM using Google's Gemini 2.5 Flash model for fast, cost-effective inference.

## Example Workflow

```
1. User uploads "research_paper.pdf"
2. PDF is converted to embeddings and stored in Chroma
3. User asks: "What are the main findings?"
4. RAG Agent:
   a. Sends query to Gemini
   b. Gemini calls retriever_tool
   c. Chroma returns top matching chunks
   d. Gemini generates answer using chunks
   e. Returns: "The main findings are... (Source: research_paper.pdf page 5)"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact

For questions or inquiries:
- **Author**: Sri-Sathwika
- **Email**: sathwika0112@gmail.com
- **Repository**: https://github.com/Sri-Sathwika/AI-agent

## Acknowledgments

- [LangChain](https://langchain.com/) - LLM framework
- [LangGraph](https://langchain-js.vercel.app/docs/langgraph) - Agentic framework
- [Google Generative AI](https://ai.google.dev/) - Gemini model
- [Chroma](https://www.trychroma.com/) - Vector database
- [FastAPI](https://fastapi.tiangolo.com/) - Web framework
- [Next.js](https://nextjs.org/) - React framework
