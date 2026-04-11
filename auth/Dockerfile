FROM dhi.io/python:3.13-debian13-dev AS build


COPY --from=dhi.io/uv:0-debian12 /usr/local/bin/uv \
/usr/local/bin/uvx /usr/local/bin/

WORKDIR /app

COPY uv.lock pyproject.toml ./
RUN uv sync --frozen --no-dev

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/src \
    PATH=/app/.venv/bin:$PATH

FROM dhi.io/python:3.13-debian13

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/src \
    PATH=/app/.venv/bin:$PATH

COPY --from=build /app/.venv /app/.venv
COPY ./src .

EXPOSE 8080

CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080" ]