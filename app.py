from flask import Flask, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
from urllib.parse import quote_plus

app = Flask(__name__)
CORS(app)

username = quote_plus("binhdole")
password = quote_plus("1Nnov@t1on")

@app.route('/api/nfl_scores', methods=['GET'])
def get_nfl_scores():
    uri = f"mongodb+srv://{username}:{password}@cluster0.dupn17e.mongodb.net/mydatabase"
    client = MongoClient(uri)
    collection = client['mydatabase']['nfl_scores']
    data = list(collection.find({}, {'_id': False}))  # Excluding '_id' from the data
    return jsonify(data)

@app.route('/api/nfl_salaries', methods=['GET'])
def get_nfl_salaries():
    uri = f"mongodb+srv://{username}:{password}@cluster0.dupn17e.mongodb.net/mydatabase"
    client = MongoClient(uri)
    collection = client['mydatabase']['nfl_salaries']
    data = list(collection.find({}, {'_id': False}))  # Excluding '_id' from the data
    return jsonify(data)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/index.html')
def index():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
