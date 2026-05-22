# AI Media Production System

Autonomous multi-agent pipeline for generating vertical cinematic videos from a brief, theme, or script.

## Stack
- Frontend: Next.js 15 + TypeScript + Tailwind
- Backend: FastAPI + SQLModel + CrewAI + Celery + Redis
- Media: Midjourney (ImagineAPI-style abstraction), Kling, ElevenLabs, ffmpeg
- Storage: AWS S3 abstraction

## Repository Layout
- `backend/` API, agents, orchestration, worker, services, tests
- `frontend/` dashboard app with job submission, logs, and assets
- `docker-compose.yml` local orchestration

## Local Setup
1. Copy env files:
   - `backend/.env.example` -> `backend/.env`
   - `frontend/.env.local.example` -> `frontend/.env.local`
   - Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` to `http://localhost:8888` / `ws://localhost:8888` (port 8000 is blocked on many Windows machines).
2. Start infrastructure and workers (Poetry is optional; Docker is enough):
   ```bash
   docker compose up postgres redis backend worker -d --build
   ```
3. Run the frontend locally (separate terminal):
   ```bash
   cd frontend && npm install && npm run dev
   ```
4. Verify:
   - Backend docs: `http://localhost:8888/docs`
   - Frontend app: `http://localhost:3000`

## Pipeline Flow
1. Create job via `POST /api/jobs/` or frontend form.
2. Celery runs orchestration:
   - script generation
   - prompt generation and up to 3 reviewer rounds
   - Midjourney images
   - Kling clips
   - ElevenLabs voiceover
   - ffmpeg assembly + color grade
3. Assets and logs are persisted and streamed to WebSocket clients.

## Testing
From `backend/`:

```bash
poetry run pytest tests/ -v
```

## Deployment Notes
- Backend and worker can share the same Docker image with different start commands on Railway/Render.
- Frontend deploys to Vercel with standard Next.js build.
- Configure all env vars in hosting dashboards before running production jobs.
