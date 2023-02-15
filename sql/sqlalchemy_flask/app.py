# Import Dependencies
import numpy as np
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///../Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create session (link) from Python to the DB 
session = Session(engine)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# Create Global variables defining most recent date, date 12 months prior, and most active station
    # Determine most recent date in the data set
mosrec_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()

    # Calculate the date one year from the last date in data set.
prev_year = dt.datetime.strptime(mosrec_date[0], "%Y-%m-%d") - dt.timedelta(days=365)

    # Query to find the most active station
most_active = session.query(Measurement.station, func.count(Measurement.tobs)).\
    group_by(Measurement.station).\
    order_by(func.count(Measurement.tobs).desc()).first()


#################################################
# Flask Routes
#################################################
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"<h2>Welcome to Surf's Up Weather Alchemy!</h2>"
        f"<b>Available Routes:</b><br>"
        f"/api/v1.0/precipitation<br>"
        f"<i>(Date and precipitation amounts from the most recent 12 months of available data)</i><br><br>"

        f"/api/v1.0/stations<br>"
        f"<i>(A list of our observation stations)</i><br><br>"

        f"/api/v1.0/tobs<br>"
        f"<i>(Temperature observations from the most recent 12 months of available data at our most active station)</i><br><br>"

        f"/api/v1.0/<start><br>"
        f"<i>(Find the minimum, average and max temperature since a given start day)</i><br><br>"

        f"/api/v1.0/<start>/<end><br>"
        f"<i>(Find the minimum, average and max temperature for a given range of days - start to end)</i><br><br>"
    )


# Setup precipitation Route
@app.route("/api/v1.0/precipitation")
def precipitation():  
    """Return a JSON representation of a dictionary for precipitation within the most recent 12 months"""
    # Query date and precipitation values for the most recent year of data only    
    prevyear_prcp = session.query(Measurement.date, Measurement.prcp).\
    filter(Measurement.date >= prev_year).\
    order_by(Measurement.date).all()

    # Convert queried list of tuples into dictionary with date as key and prcp as value
    prevyear_precipitation = dict((x, y) for x, y in prevyear_prcp)    

    return jsonify(prevyear_precipitation)


# Setup stations Route
@app.route("/api/v1.0/stations")
def stations():
    """Return a JSON list of all stations"""
    # Query all stations
    station_data = session.query(Station.name).all()

    # Convert queried list of tuples into normal list
    all_stations = list(np.ravel(station_data))

    return jsonify(all_stations)


# Setup tobs Route
@app.route("/api/v1.0/tobs")
def tobs():
    """Return tobs data for only the past year of the most active station"""  
    # Query only the most active station's tobs for the most recent year of data
    tobs_data = session.query(Measurement.date, Measurement.tobs).\
    filter(Measurement.station == most_active[0]).\
    filter(Measurement.date >= prev_year).all()

    # Convert queried list of tuples into dictionary with date as key and tobs as value
    most_active_station = dict((x, y) for x, y in tobs_data)    
    # most_active_station = list(np.ravel(results))

    return jsonify(most_active_station)


# Setup <start> Route
@app.route("/api/v1.0/<start>")
def start_temps(start):
    """Return a JSON list of the tmin, tavg, and tmax temperatures for the range 
    beginning from the date variable supplied by the user.""" 
    # Query list for tmin, tavg & tmax temps    
    defsel = [func.min(Measurement.tobs),
        func.avg(Measurement.tobs),
        func.max(Measurement.tobs)]
    
    # Query data by unpacking query list and using user provided start date 
    start_range = session.query(*defsel).\
        filter(Measurement.date >= start).all()
    
    # Convert queried list of tuples into normal list
    start_results = list(np.ravel(start_range))

    return jsonify(start_results)       


# Setup <start>/<end> Route
@app.route("/api/v1.0/<start>/<end>")
def start_end_temps(start, end):
    """Return a JSON list of the tmin, tavg, and tmax temperatures for the range 
    beginning from the start date to the end date variables supplied by the user.""" 
    # Create Query list for tmin, tavg & tmax temps    
    defsel = [func.min(Measurement.tobs),
        func.avg(Measurement.tobs),
        func.max(Measurement.tobs)]
    
    # Query data by unpacking query list and using user provided start and end dates
    start_end_range = session.query(*defsel).\
        filter(Measurement.date >= start).\
        filter(Measurement.date <= end).all()

    # Convert queried list of tuples into normal list
    start_end_results = list(np.ravel(start_end_range))

    return jsonify(start_end_results)  

session.close()

if __name__ == '__main__':
    app.run(debug=True)