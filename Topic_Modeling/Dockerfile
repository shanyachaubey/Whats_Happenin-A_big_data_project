# Use the official Python image as a base
FROM python:3.10

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install -r requirements.txt

# Define an argument for the namespace
ARG NAMESPACE=default

# Set the NAMESPACE environment variable using the ARG value
ENV NAMESPACE=${NAMESPACE}

# Copy the content of the local src directory to the working directory
COPY . .

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
