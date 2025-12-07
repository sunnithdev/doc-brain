# DocBrain

> “Chat with your documents, powered by cloud AI”

DocBrain is an Electron-based desktop application that enables users to interact with their documents using advanced AI. By leveraging **Local Processing** and Cloud-based Vector/LLM APIs, users can ask questions and get accurate answers derived directly from their uploaded files without complex server-side infrastructure.

## 🚀 Key Features

- **📂 Drag & Drop Upload**: Seamlessly upload multiple files (PDF, Word, Text) via a simple drag-and-drop interface.
- **⚡ Client-Side File Processing**: Files are processed **locally** within the Electron app to extract text, ensuring speed and privacy.
- **☁️ Cloud Vectorization**: Extracted text chunks are sent to the cloud for embedding generation.
- **💬 Streamed Chat Responses**: Get instant feedback with AI answers that stream token-by-token.
- **🔍 Source Attribution**: (Optional) View the specific file and section used to generate an answer.
- **🖥️ Lightweight Desktop App**: Built with Electron for a fast, native experience on Windows, Mac, and Linux.

## 🛠 Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| **Desktop** | Electron + React + Tailwind | UI, Drag & drop file handling |
| **Local Processor** | Node.js + LangChain.js / pdf-parse | Extract text from files & chunking (Client-side) |
| **Backend API** | Vercel AI SDK / Next.js API | API Route for Embeddings & Chat |
| **Vector DB** | Supabase (pgvector) / Pinecone | Store document embeddings |
| **AI Model** | Groq / OpenAI / Gemini | LLM for generating embeddings and answers |

## 🔄 Architecture & Flow

The application uses an "Edge Computing" approach where file parsing happens on the user's machine to reduce server costs and complexity.

1.  **File Upload & Client-Side Processing**:
    *   **Drag & Drop**: User adds files in the Electron App.
    *   **Local Parsing**: Electron (Node.js) reads the file path and extracts raw text using local libraries (e.g., `pdf-parse`, `mammoth`).
    *   **Chunking**: Text is split into chunks locally.
    *   **Ingest**: Only text chunks are sent to the Backend API.
2.  **Cloud Vectorization**:
    *   **Embedding**: API sends chunks to OpenAI/Groq for embedding.
    *   **Storage**: Embeddings are saved to Supabase (pgvector) or Pinecone.
3.  **Chat Interaction**:
    *   **Query**: User types a question.
    *   **Vector Search**: System searches the Vector DB for relevant chunks.
    *   **Streamed Answer**: Top chunks + Query are sent to the LLM, and the response is **streamed** back to the UI in real-time.

## ✅ MVP Roadmap & Success Criteria

- [ ] **File Upload**: User can upload files and see them listed.
- [ ] **Local Parsing**: Files are parsed and chunks created locally in Electron.
- [ ] **Cloud Ingest**: Text chunks are successfully stored as embeddings in Vector DB.
- [ ] **Streaming Chat**: Users see AI answers appear in real-time.
- [ ] **Cross-Platform**: App runs smoothly on macOS and Windows.
- [ ] **UI/UX**: Clean, professional interface with file list and chat panel.

### 🌟 Stretch Goals
- [ ] Batch file metadata display (size, type, date).
- [ ] Answer highlighting in original document text.
- [ ] Loading and progress indicators for processing steps.