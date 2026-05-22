FROM python:3.12-slim



WORKDIR /app



RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg curl && rm -rf /var/lib/apt/lists/*



COPY requirements-docker.txt /app/requirements-docker.txt

ENV PIP_DEFAULT_TIMEOUT=120
RUN pip install --no-cache-dir --retries 8 --default-timeout=120 -r /app/requirements-docker.txt



COPY app /app/app

COPY tests /app/tests



CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

