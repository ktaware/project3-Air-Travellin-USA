# 1. import Flask

from flask import Flask, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func , desc
import numpy as np
import pandas as pd
import datetime as dt

# 2. Create an app, being sure to pass __name__
app = Flask(__name__)

#3. Define what to do when a user hits the index route
#/Start at the homepage.List all the available routes.
@app.route("/")
def home():
    print("Server received request for 'Home' page...")
    result =  "<html> Welcome to my 'Home' page! <br>\
        <a href='http://127.0.0.1:5000/'>Home</a> <br>\
        <a href='http://127.0.0.1:5000/api/v1.0/precipitation'>Returns a JSON list of percipitation data for the dates between 8/23/16 and 8/23/17</a><br>\
        <a href='http://127.0.0.1:5000/api/v1.0/stations'>Returns a JSON list of the weather stations</a><br>\
        <a href='http://127.0.0.1:5000/api/v1.0/tobs'>Returns a JSON list of the Temperature Observations (tobs) for each station for the dates between 8/23/16 and 8/23/17</a><br>\
        <a href='http://127.0.0.1:5000/api/v1.0/2017-08-23'>Returns a JSON list of the minimum temperature, the average temperature, and the max temperature for the dates between the given start date and 8/23/17</a><br>\
        <a href='http://127.0.0.1:5000/api/v1.0/2016-08-23/2017-08-23'>Returns a JSON list of the minimum temperature, the average temperature, and the max temperature for the dates between the given start date 8/23/16and end date8/23/17</a>\
        </html>"
    return result

# 4. /api/v1.0/precipitation Convert the query results from your precipitation analysis (i.e. retrieve only the last 12 months of data) to a dictionary using date as the key and prcp as the value.
#Return the JSON representation of your dictionary.

@app.route("/api/v1.0/precipitation")
def precipitation():
    print("Server received request for 'Precipitaion' page...")
    # create engine to hawaii.sqlite
    engine = create_engine("sqlite:///Resources/hawaii.sqlite",echo=False)
    conn = engine.connect()
    # reflect an existing database into a new model
    Base = automap_base()
    Base.prepare(autoload_with=engine)
    # Save references to each table
    Measurement = Base.classes.measurement
    Station = Base.classes.station
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Perform a query to retrieve the date and precipitation scores
    # Find the most recent date in the data set.
    latest_date=session.query(Measurement.date).order_by(Measurement.date.desc()).first()[0]
    latest_date
    # Calculate the date one year from the last date in data set.
    year_ago = dt.datetime.strptime(latest_date, '%Y-%m-%d') - dt.timedelta(days=365)
    query=session.query(Measurement.date,func.avg(Measurement.prcp)).\
        filter(Measurement.date >= year_ago).\
        group_by(Measurement.date).all()
    session.close()
    return jsonify(dict(query))
    
#5 /api/v1.0/stations Return a JSON list of stations from the dataset.
@app.route("/api/v1.0/stations")
def stations():
    print("Server received request for 'stations' page...")
    # create engine to hawaii.sqlite
    engine = create_engine("sqlite:///Resources/hawaii.sqlite",echo=False)
    conn = engine.connect()
    # reflect an existing database into a new model
    Base = automap_base()
    Base.prepare(autoload_with=engine)
    # Save references to each table
    Measurement = Base.classes.measurement
    Station = Base.classes.station
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Query all passengers
    results = session.query(Station.station).all()
    #session.close()
    # Convert list of tuples into normal list
    all_station = list(np.ravel(results))
    session.close()
    return jsonify(all_station)

#6/api/v1.0/tobs Query the dates and temperature observations of the most-active station for the previous year of data.
#Return a JSON list of temperature observations for the previous year.
@app.route("/api/v1.0/tobs")
def tobs():
    print("Server received request for 'tobs' page...")
    print("Server received request for 'stations' page...")
    # create engine to hawaii.sqlite
    engine = create_engine("sqlite:///Resources/hawaii.sqlite",echo=False)
    conn = engine.connect()
    # reflect an existing database into a new model
    Base = automap_base()
    Base.prepare(autoload_with=engine)
    # Save references to each table
    Measurement = Base.classes.measurement
    Station = Base.classes.station
    
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Design a query to find the most active stations (i.e. what stations have the most rows?)
    # List the stations and the counts in descending order.
    active_station=session.query(Measurement.station, func.count(Measurement.station)).\
                    group_by(Measurement.station).\
                    order_by(func.count(Measurement.station).desc()).all()
    most_active = active_station[0][0]

    # Using the most active station id
    # Find the most recent date in the data set.
    latest_date=session.query(Measurement.date).order_by(Measurement.date.desc()).first()[0]
    latest_date

    year_ago = dt.datetime.strptime(latest_date, '%Y-%m-%d') - dt.timedelta(days=365)

    res = session.query( Measurement.date, Measurement.station,Measurement.tobs).\
        filter(Measurement.station == most_active).\
        filter(Measurement.date >= year_ago).all()
     # Convert list of tuples into normal list
    all_res = list(np.ravel(res))
    session.close()
    return jsonify(all_res)

#7api/v1.0/<start>  
#Return a JSON list of the minimum temperature, the average temperature, and the maximum temperature for a specified start or start-end range.
#For a specified start, calculate TMIN, TAVG, and TMAX for all the dates greater than or equal to the start date.


@app.route("/api/v1.0/<date>")
def start_summary(date):
    print("Server received request for page...")
    # create engine to hawaii.sqlite
    engine = create_engine("sqlite:///Resources/hawaii.sqlite",echo=False)
    conn = engine.connect()
    # reflect an existing database into a new model
    Base = automap_base()
    Base.prepare(autoload_with=engine)
    # Save references to each table
    Measurement = Base.classes.measurement
    Station = Base.classes.station
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    start_date=session.query(func.max(Measurement.tobs), func.min(Measurement.tobs), func.avg(Measurement.tobs)).\
        filter(Measurement.date >= date).all()
    all_start = list(np.ravel(start_date))
    session.close()
    return jsonify(all_start)

#8 /api/v1.0/<start>/<end>
#For a specified start date and end date, calculate TMIN, TAVG, and TMAX for the dates from the start date to the end date, inclusive.    
@app.route("/api/v1.0/<start>/<end>")
def startDateEndDate(start,end):
    print("Server received request for 'stations' page...")
    # create engine to hawaii.sqlite
    engine = create_engine("sqlite:///Resources/hawaii.sqlite",echo=False)
    conn = engine.connect()
    # reflect an existing database into a new model
    Base = automap_base()
    Base.prepare(autoload_with=engine)
    # Save references to each table
    Measurement = Base.classes.measurement
    Station = Base.classes.station
    
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    multi_day_temp_results = session.query(func.min(Measurement.tobs), 
                            func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
                            filter(Measurement.date >= start).filter(Measurement.date <= end).all()
    multi_day_temp = list(np.ravel(multi_day_temp_results ))
    #return jsonify(all_start)
    session.close()
    return jsonify(multi_day_temp)

if __name__ == "__main__":
    app.run(debug=True)


