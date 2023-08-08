import numpy as np
from pymongo import MongoClient
from flask import Flask, jsonify, render_template, send_from_directory


#################################################
# Database Setup
#################################################
mongo = MongoClient(port=27017)

# Save reference to the table

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
    return(
        send_from_directory('static/data', path)
    )

if __name__ == '__main__':
    app.run(debug=True)