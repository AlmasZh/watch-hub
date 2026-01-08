FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements/ .
RUN pip install --no-cache-dir -r requirements/dev.txt

CMD [ "python", "src/main.py" ]