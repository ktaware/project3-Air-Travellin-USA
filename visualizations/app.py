#################################################
#  Import Dependencies
#################################################
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy.sql.expression import or_
from flask import Flask, jsonify, request, render_template
app = Flask(__name__)


#################################################
# Database Setup
#################################################
engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5432/airtravel_db")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
Airlines = Base.classes.airlines
Airports = Base.classes.airports
Dom_Flights = Base.classes.dom_flights
Int_Flights = Base.classes.int_flights
Flights_Airports = Base.classes.flights_airports

# Create session (link) from Python to the DB 
session = Session(engine)


#################################################
# Global Functions
#################################################
# define function to convert ORM data into dicts using column headers as keys
def columns_to_dict(self):
    dict_ = {}
    for key in self.__mapper__.c.keys():
        dict_[key] = getattr(self, key)
    return dict_


#################################################
# Routes
#################################################
# Step 1 (Setup basic Python to Flask)
@app.route('/')
def home_page():    
    return render_template('index.html')

# Step 2  (Setup airports Route)
@app.route("/api/v1.0/airports")
def airports():  
    """Return a JSON representation of a dictionary for airports"""
    airports_dict = [columns_to_dict(row) for row in session.query(Airports).all()]
    return jsonify(airports_dict)

# Step 3  (Setup airports Route)
@app.route("/api/v1.0/airlines")
def airlines():  
    """Return a JSON representation of a dictionary for airlines"""
    airlines_dict = [columns_to_dict(row) for row in session.query(Airlines).all()]
    return jsonify(airlines_dict)

# Step 5  (Setup NYC flight paths (Flights_Airports) Route)
@app.route("/api/v1.0/flights_airports")
def flights_airports():  
    """Return a JSON representation of a dictionary for airports"""    
    flights_paths = [columns_to_dict(row) for row in session.query(Flights_Airports).order_by((Flights_Airports.total).desc()).all()]
    return jsonify(flights_paths)
    

# Close session
session.close()

#################################################
# Run app
#################################################
app.run(debug=True)