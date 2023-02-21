# Import Dependencies
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify


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
Flight_Routes = Base.classes.flight_routes



# Create session (link) from Python to the DB 
session = Session(engine)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# # Create Global variables defining most recent date, date 12 months prior, and most active station
# define function to convert ORM data into dicts using column headers as keys
def columns_to_dict(self):
    dict_ = {}
    for key in self.__mapper__.c.keys():
        dict_[key] = getattr(self, key)
    return dict_

#     # Calculate the date one year from the last date in data set.
# prev_year = dt.datetime.strptime(mosrec_date[0], "%Y-%m-%d") - dt.timedelta(days=365)

#     # Query to find the most active station
# most_active = session.query(Measurement.station, func.count(Measurement.tobs)).\
#     group_by(Measurement.station).\
#     order_by(func.count(Measurement.tobs).desc()).first()


#################################################
# Flask Routes
#################################################
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"<h1>Welcome to Fly High Memberships!</h1>"
        f"<h2>Where we'll take you to the best airline to take you anywhere!</h2><br><br>"
        f"<b>Available Routes:</b><br><br>"
        f"/api/v1.0/airlines<br>"
        f"<i>(Information about each Airline, including: Airline Name, ID, Country of Origin, Active Status)</i><br><br>"

        f"/api/v1.0/airports<br>"
        f"<i>(A list of all the airports around the globe)</i><br><br>"

        f"/api/v1.0/dom_flights<br>"
        f"<i>(A list of domestic flights out of NYC)</i><br><br>"

        f"/api/v1.0/int_flights<br>"
        f"<i>(A list of international flight routes out of NYC)</i><br><br>"
        
        f"/api/v1.0/flight_routes<br>"
        f"<i>(A list of all air traffic routes around the globe)</i><br><br>"
    )


# Setup airlines Route
@app.route("/api/v1.0/airlines")
def airlines():  
    """Return a JSON representation of a dictionary for airlines"""
    airlines_dict = [columns_to_dict(row) for row in session.query(Airlines).all()]
    return jsonify(airlines_dict)
    
    # test = []
    # Query airline_id and airline_name    
    # airlines_info = session.query(Airlines.airline_id, Airlines.airline_name, Airlines.origin_country, Airlines.active).all()
    # airlines_info = session.query(Airlines.airline_id).all()
    # for u in session.query(Airlines).all():
    #     test.a = u.__dict__
    # airlines_info = session.query(Airlines.airline_id, Airlines.airline_name).all()
    # Convert queried list of tuples into dictionary with date as key and prcp as value
    # airlines_dict = dict((x, y) for x, y in airlines_info)    
    # airlines_dict = dict(("id", x) for x in airlines_info)    
    # airlines_list = list(np.ravel(airlines_info))

    # return jsonify(airlines_list)
    # return jsonify(test)


# Setup airports Route
@app.route("/api/v1.0/airports")
def airports():  
    """Return a JSON representation of a dictionary for airports"""
    airports_dict = [columns_to_dict(row) for row in session.query(Airports).all()]
    return jsonify(airports_dict)


# Setup dom_flights Route
@app.route("/api/v1.0/dom_flights")
def flights():  
    """Return a JSON representation of a dictionary for flights"""
    dom_flights_dict = [columns_to_dict(row) for row in session.query(Dom_Flights).all()]
    return jsonify(dom_flights_dict)


# Setup int_flights Route
@app.route("/api/v1.0/int_flights")
def int_flights():  
    """Return a JSON representation of a dictionary for flights"""
    int_flights_dict = [columns_to_dict(row) for row in session.query(Int_Flights).all()]
    return jsonify(int_flights_dict)


# Setup flight_routes Route
@app.route("/api/v1.0/flight_routes")
def flight_routes():  
    """Return a JSON representation of a dictionary for routes"""
    flight_routes_dict = [columns_to_dict(row) for row in session.query(Flight_Routes).all()]
    return jsonify(flight_routes_dict)    

# Step 5  (Setup traffic density Route)
@app.route("/api/v1.0/traffic_density")
def traffic_density():  
    """Return a JSON representation of a dictionary for airports"""    
    density = session.query(Dom_Flights.des_airport, func.sum(Dom_Flights.total)).group_by(Dom_Flights.des_airport).all()
    # alldom_flights = [columns_to_dict(row) for row in session.query(Dom_Flights.des_airport, func.sum(Dom_Flights.total)).group_by(Dom_Flights.des_airport).all()]
    # density = [columns_to_dict(row) for row in session.query(Dom_Flights.des_airport, func.sum(Dom_Flights.total)).group_by(Dom_Flights.des_airport).all()]    
    return jsonify(density)


session.close()


if __name__ == '__main__':
    app.run(debug=True)