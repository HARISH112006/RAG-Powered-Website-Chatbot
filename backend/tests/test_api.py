import requests

def test_health():
    url = "http://localhost:8000/health"
    try:
        response = requests.post(url)
        if response.status_code == 200:
            print("Health check successful:", response.json())
        else:
            print("Health check failed:", response.status_code)
    except Exception as e:
        print("Error connecting to server:", str(e))

if __name__ == "__main__":
    print("Ensure the backend is running with 'python main.py' before running tests.")
    test_health()
