import numpy as np
from pymongo import MongoClient
from flask import Flask, jsonify, render_template, send_from_directory
from pymongo.server_api import ServerApi
from bson.json_util import dumps
import json
#################################################
# Database Setup
#################################################
url = 'mongodb+srv://sportsproject:nfldata2023@cluster0.kq90kop.mongodb.net/?retryWrites=true&w=majority'

client = MongoClient(url, server_api=ServerApi('1'))
# Save reference to the table

collection = client['sportsproject']['all_nfl_seasons']
#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    return (
        render_template('index.html')
    )

@app.route('/salaries')
def salaries():
    return (
        render_template('andrewchart.html')
    )

@app.route('/team_spending_and_success')
def spending_success(): 
    return (
        render_template('binhchart.html')
    )

@app.route('/spending_analysis')
def analysis(): 
    return (
        render_template('analysis.html')
    )

@app.route('/newest_millionaires')
def future(): 
    return (
        render_template('future.html')
    )

@app.route("/static/data/<path:path>")
def data(path):
    temp = collection.find({}, {'_id':False})
    return json.loads(dumps(temp))

if __name__ == '__main__':
    app.run(debug=True)