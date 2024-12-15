from flask import Flask, jsonify, Response
from flask_cors import CORS
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
import random

app = Flask(__name__)
CORS(app)

REQUEST_COUNTER = Counter("get_requests_total", "Total number of GET requests")

@app.route("/api/data", methods=["GET"])
def get_data():
    REQUEST_COUNTER.inc()
    
    numbers = [random.randint(1, 100) for _ in range(5)]
    return jsonify({"message": "Here is your random data!", "data": numbers})

@app.route("/metrics", methods=["GET"])
def metrics():
    return Response(generate_latest(), content_type=CONTENT_TYPE_LATEST)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

