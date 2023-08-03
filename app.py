import numpy as np



from pymongo import MongoClient
from flask import Flask, jsonify, render_template


#################################################
# Database Setup
#################################################
mongo = MongoClient(port=27017)

# Save reference to the table
# db = mongo['']
# collection = 
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

if __name__ == '__main__':
    app.run(debug=True)