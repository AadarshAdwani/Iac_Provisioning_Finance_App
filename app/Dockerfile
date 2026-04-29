FROM python:3.11-slim

WORKDIR /code

COPY app/ app/
COPY app/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/code

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]