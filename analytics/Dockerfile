FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 8090
CMD ["gunicorn", "-w", "2", "--user", "root", "-b", "0.0.0.0:8090", "app:app"]
