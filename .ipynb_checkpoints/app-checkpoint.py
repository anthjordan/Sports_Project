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
def dashboard():
    return (
        render_template('index.html')
    )

@app.route("/static/data/<path:path>")
def data(path):
    return(
        send_from_directory('static/data', path)
    )

if __name__ == '__main__':
    app.run(debug=True)