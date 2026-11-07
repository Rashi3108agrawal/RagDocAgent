# RagDocAgent

RagDocAgent is a self-hostable workspace for asking questions across PDF, DOCX,
and spreadsheet files. It combines document previews, retrieval, and cited
answers in a compact developer-oriented interface.

## Overview

Add a document collection, choose a model, and search or ask questions in English. Answers include source references that open the relevant
document preview. The application can run with local embeddings and its demo
model configuration, or connect to a supported language-model provider.

## Features

- Upload and index PDF, DOCX, XLSX, and XLS files.
- Ask questions in a retrieval chat or multi-step agent mode.
- Search document passages directly without calling a language model.
- Retrieve with hybrid lexical and vector search.
- Inspect citations in PDF, Word, and spreadsheet previews.
- Keep conversation history, filter by category.
- Stream generated responses and optionally use browser speech input.

## Architecture

The React client communicates with the FastAPI service through the existing
`/api` routes. The service parses and chunks uploads, creates embeddings, and
stores document metadata and conversations in SQLite. ChromaDB stores vectors;
hybrid retrieval combines vector results with BM25 rankings using reciprocal
rank fusion. Chat and agent responses stream to the client, where citations
link back to indexed sources.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **API:** Python, FastAPI
- **Persistence:** SQLite and ChromaDB
- **Retrieval:** local or OpenAI embeddings, BM25, reciprocal rank fusion
- **Models:** OpenAI, Anthropic, Z.ai, Ollama, and offline mock mode
- **Deployment:** Docker and Docker Compose

## Installation

Requirements: Python 3.12+, Node.js 22+, and npm. Docker is optional.

```powershell
git clone <your-repository-url> RagDocAgent
cd RagDocAgent
python -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
cd frontend
npm ci
```

On macOS or Linux, activate the environment with
`source backend/.venv/bin/activate` from the repository root.

## Configuration

Copy `backend/.env.example` to `backend/.env`. Provider keys are optional;
without them, local embeddings and the offline mock model remain available.
Common settings include:

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI chat or embedding access |
| `ANTHROPIC_API_KEY` | Anthropic model access |
| `ZAI_API_KEY` | Z.ai model access |
| `OLLAMA_BASE_URL` | Ollama server address |
| `EMBEDDING_PROVIDER` | `local` (default) or `openai` |
| `SEARCH_HYBRID` | Enable BM25 and vector fusion |
| `SEARCH_RERANK` | Enable optional cross-encoder reranking |

For analytics, set `VITE_YANDEX_METRIKA_ID` or
`VITE_GA4_MEASUREMENT_ID` in the frontend build environment. These public
measurement identifiers are embedded in the client bundle; never put secrets
in `VITE_*` variables.

## Running Locally

Start the API from the repository root:

```powershell
cd backend
uvicorn app.main:app --reload --port 8000
```

In another terminal, start the frontend:

```powershell
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).
The API is available at `http://localhost:8000`; interactive API documentation
is at `/docs`.

## Docker Deployment

Run the separate development services with persistent local data:

```powershell
docker compose up --build
```

The frontend is served on port 5173 and the API on port 8000. To build the
combined image, which serves the API and frontend from one container:

```powershell
docker build -t ragdocagent .
docker run --rm -p 7860:7860 -v ragdocagent-data:/app/data ragdocagent
```

The combined image honors the hosting platform's `PORT` environment variable.
The deployment blueprint in `render.yaml` can be used as a starting point for
a Render deployment. Configure provider keys in the host's secret settings.

## Security

Provider credentials belong in environment variables or a deployment
platform's secret store, not in source control or the browser bundle. Uploaded
files and conversation data are stored on the server. The API does not provide
user authentication; restrict network access or add an upstream access-control
layer before exposing an instance to untrusted users. Back up the mounted
`/app/data` volume for persistent deployments.

## Roadmap

- Add deployment guidance for reverse proxies and access-control layers.
- Improve operational visibility for indexing and model-provider failures.
- Expand automated coverage for document formats and retrieval quality.

## Contributing

Keep changes focused and preserve the existing API, storage, and retrieval
contracts. Before opening a change, run the relevant checks:

```powershell
cd backend
pytest
cd ..\frontend
npm run lint
npm run build
```

Include a concise description of the behavior affected and the checks run.
