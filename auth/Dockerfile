FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/src

COPY requirements/prod.txt .
RUN pip install --no-cache-dir -r requirements/prod.txt

CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080" ]