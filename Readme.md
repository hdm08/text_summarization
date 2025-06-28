# Text Summarization Application:
This project is a text summarization application that uses a pre-trained model from the Hugging Face Model Hub to generate summaries of input text. It consists of a FastAPI backend, a React frontend, and an NGINX server to handle multiple parallel incoming requests. The application is containerized using Docker and orchestrated with Docker Compose.

# Why This Model?:
Performance: BART (Bidirectional and Auto-Regressive Transformer) is a state-of-the-art model fine-tuned on the CNN/DailyMail dataset, enabling it to generate concise, coherent, and contextually accurate summaries.

Pre-trained and Ready-to-Use: Available directly from the Hugging Face Model Hub, it is pre-trained and optimized for summarization, minimizing setup complexity and ensuring quick deployment.

Flexibility: The model supports variable-length inputs and outputs, allowing users to customize summary length (via word count) through the API.

Robustness: It effectively processes diverse text inputs, making it ideal for general-purpose summarization across news, blogs, and articles.

Motivation: In today's fast-paced world, people lack the time to read lengthy articles, blogs, or documents. This model enables smart, efficient work by providing brief, contextual summaries, facilitating quick understanding and concise documentation.

# Prerequisites:

Docker and Docker Compose installed

Python 3.10+ (for running the notebook locally)

Node.js 18+ (for local frontend development, optional)

facebook/bart-large-cnn model which can be intalled using code in notebook/demo_notebook.ipynb
since the model size is 1.6GB, it is not uploaded to Github

# Setup Instructions:
Build and Run with Docker Compose: docker-compose up --build

Backend runs on http://localhost:8000 (proxied through NGINX on port 80).

Frontend runs on http://localhost:3000.

# Access the Application:

Open http://localhost:3000 in a browser to use the React frontend.

Send API requests to http://localhost/summarize for direct backend access.

# Usage:

Frontend:

Enter text in the textarea.

Specify a desired word count for the summary (default: 130).

Click the "Summarize" button or press Enter to generate a summary.

View the summary or any error messages below the input area.

Click "Clear" to reset the form.

# API:

Endpoint: POST /summarize

# Demo Notebook: 
The demo_notebook.ipynb file contains example Python code using the requests library to send POST requests to the /summarize endpoint and print the responses. It includes:

A sample long text input.
A POST request with a specified word count.
Output parsing to display the generated summary.

# Project Files

Backend: A FastAPI application (main.py) that loads the facebook/bart-large-cnn model and exposes a /summarize endpoint to process text summarization requests.

backend/app/main.py: FastAPI application with the summarization endpoint.

backend/Dockerfile: Docker configuration for the FastAPI backend.

backend/requirements.txt: Python dependencies.

NGINX: A reverse proxy to handle multiple parallel requests and route them to the FastAPI backend.

backend/nginx.conf: NGINX configuration for handling parallel requests.

backend/Dockerfile.nginx: Docker configuration for NGINX.

Frontend: A React application (App.js) that provides a user interface for submitting text and displaying summaries.

frontend/src/App.js: React application for the user interface.

frontend/Dockerfile: Docker configuration for the React frontend.

Docker Compose: Containerizes the backend, frontend, and NGINX for easy deployment and scalability.

docker-compose.yml: Orchestrates the backend, NGINX, and frontend containers.

Notebook: A Jupyter notebook (demo_notebook.ipynb) to demonstrate sending POST requests to the /summarize endpoint and printing responses.

demo_notebook.ipynb: Jupyter notebook for testing the API.


# Scaling and Performance
NGINX: Configured with worker_processes auto and worker_connections 1024 to handle multiple parallel requests efficiently.

Gunicorn: Runs the FastAPI backend with 4 workers (-w 4) using Uvicorn workers for asynchronous request handling.

Model Inference: The facebook/bart-large-cnn model is loaded once at startup to minimize latency. Asynchronous processing in FastAPI ensures non-blocking request handling.
