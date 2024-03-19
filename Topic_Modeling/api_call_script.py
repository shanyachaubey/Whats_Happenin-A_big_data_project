import sys
import requests
import subprocess
import time

def make_api_call(oid):
    url = 'http://127.0.0.1:8000/articles'
    headers = {'accept': 'application/json'}
    params = {'oid': oid}

    response = requests.put(url, headers=headers, params=params)
    if response.status_code == 200:
        print("API call successful!")
        print("Response:", response.json())
    else:
        print("Error:", response.status_code, response.text)

def main():
    # Check if oid is provided as a command-line argument
    if len(sys.argv) != 2:
        print("Usage: python api_call_script.py <oid>")
        sys.exit(1)

    oid = sys.argv[1]

    # Start FastAPI app in a separate process
    process = subprocess.Popen(["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"])
    
    # Wait for the app to start (you can adjust the time as needed)
    time.sleep(5)
    
    # Make the API call
    make_api_call(oid)
    
    # Shutdown the FastAPI app
    process.terminate()

if __name__ == "__main__":
    main()
