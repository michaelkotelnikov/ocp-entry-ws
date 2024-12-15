from flask import Flask, jsonify
import random

app = Flask(__name__)

@app.route("/api/data", methods=["GET"])
def get_data():
    numbers = [random.randint(1, 100) for _ in range(5)]
    return jsonify({"message": "Here is your random data!", "data": numbers})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

