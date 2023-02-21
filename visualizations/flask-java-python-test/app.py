<<<<<<< HEAD
=======
<<<<<<< HEAD
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
Flights = Base.classes.flights
Routes = Base.classes.routes
All_Flights = Base.classes.all_flights

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


# Step 3  (Setup NYC to international airports Route)
@app.route("/api/v1.0/nyc_airports")
def nyc_airports():  
    # """Return a JSON representation of a dictionary for airports"""
    # nyc_airports = [columns_to_dict(row) for row in session.query(Airports).\
    #                 filter(Airports.airport_id == All_Flights.des_airport).all()]
    # return jsonify(nyc_airports)
    """Return a JSON representation of a dictionary for airports"""
    # nycresults = session.query(Airports).filter(or_(Airports.airport_id == All_Flights.des_airport, Airports.airport_id == All_Flights.dep_airport)).all()
    # nyc_airports = [columns_to_dict(row) for row in nycresults]
    nyc_airports = [columns_to_dict(row) for row in session.query(Airports).\
                    filter(or_(Airports.airport_id == All_Flights.des_airport, 
                               Airports.airport_id == All_Flights.dep_airport)).all()]
    return jsonify(nyc_airports)


# Step 4  (Setup NYC to domestic only airports Route)
@app.route("/api/v1.0/nycdom_airports")
def nycdom_airports():  
    """Return a JSON representation of a dictionary for airports"""    
    nycdom_airports = [columns_to_dict(row) for row in session.query(Airports).\
                    filter(Airports.airport_id == Flights.dest).all()]
    return jsonify(nycdom_airports)


# Close session
session.close()

#################################################
# Run app
#################################################
=======
>>>>>>> 5a3f402a91cc5842270d03164089a92a5f66bd9f
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
<<<<<<< HEAD
Dom_Flights = Base.classes.dom_flights
Int_Flights = Base.classes.int_flights
Flight_Routes = Base.classes.flight_routes
=======
Flights = Base.classes.flights
Routes = Base.classes.routes
All_Flights = Base.classes.all_flights
>>>>>>> 5a3f402a91cc5842270d03164089a92a5f66bd9f

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


# Step 3  (Setup NYC to international airports Route)
<<<<<<< HEAD
@app.route("/api/v1.0/nycint_airports")
def nycint_airports():  
    # """Return a JSON representation of a dictionary for airports"""
    # nyc_airports = [columns_to_dict(row) for row in session.query(Airports).\
    #                 filter(Airports.airport_id == Dom_Flights.des_airport).all()]
    # return jsonify(nyc_airports)
    """Return a JSON representation of a dictionary for airports"""    
    nycint_airports = [columns_to_dict(row) for row in session.query(Airports).\
                    filter(or_(Airports.airport_id == Int_Flights.des_airport, 
                               Airports.airport_id == Int_Flights.dep_airport)).all()]
    return jsonify(nycint_airports)
=======
@app.route("/api/v1.0/nyc_airports")
def nyc_airports():  
    # """Return a JSON representation of a dictionary for airports"""
    # nyc_airports = [columns_to_dict(row) for row in session.query(Airports).\
    #                 filter(Airports.airport_id == All_Flights.des_airport).all()]
    # return jsonify(nyc_airports)
    """Return a JSON representation of a dictionary for airports"""
    # nycresults = session.query(Airports).filter(or_(Airports.airport_id == All_Flights.des_airport, Airports.airport_id == All_Flights.dep_airport)).all()
    # nyc_airports = [columns_to_dict(row) for row in nycresults]
    nyc_airports = [columns_to_dict(row) for row in session.query(Airports).\
                    filter(or_(Airports.airport_id == All_Flights.des_airport, 
                               Airports.airport_id == All_Flights.dep_airport)).all()]
    return jsonify(nyc_airports)
>>>>>>> 5a3f402a91cc5842270d03164089a92a5f66bd9f


# Step 4  (Setup NYC to domestic only airports Route)
@app.route("/api/v1.0/nycdom_airports")
def nycdom_airports():  
    """Return a JSON representation of a dictionary for airports"""    
    nycdom_airports = [columns_to_dict(row) for row in session.query(Airports).\
<<<<<<< HEAD
                    filter(Airports.airport_id == Dom_Flights.des_airport).all()]
    return jsonify(nycdom_airports)


# Step 5  (Setup traffic density Route)
@app.route("/api/v1.0/traffic_density")
def traffic_density():  
    """Return a JSON representation of a dictionary for airports"""    
    density = session.query(Dom_Flights.des_airport, func.sum(Dom_Flights.total)).group_by(Dom_Flights.des_airport).all()
    results = [tuple(row) for row in density]
    # resulters = [tuple(row) for row in results]
    resulters = [dict((x, y) for x, y in results)]
    return jsonify(resulters)
    # alldom_flights = [columns_to_dict(row) for row in session.query(Dom_Flights.des_airport, func.sum(Dom_Flights.total)).group_by(Dom_Flights.des_airport).all()]
    # density = [columns_to_dict(row) for row in session.query(Dom_Flights.des_airport, func.sum(Dom_Flights.total)).group_by(Dom_Flights.des_airport).all()]    
    # return jsonify(density)


=======
                    filter(Airports.airport_id == Flights.dest).all()]
    return jsonify(nycdom_airports)


>>>>>>> 5a3f402a91cc5842270d03164089a92a5f66bd9f
# Close session
session.close()

#################################################
# Run app
#################################################
<<<<<<< HEAD
=======
>>>>>>> c47801dd2537fdc071fcdf3c42af49cba01f08a7
>>>>>>> 5a3f402a91cc5842270d03164089a92a5f66bd9f
app.run(debug=True)