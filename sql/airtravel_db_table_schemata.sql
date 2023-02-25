DROP TABLE IF EXISTS airlines CASCADE;
DROP TABLE IF EXISTS airports CASCADE;
DROP TABLE IF EXISTS dom_flights CASCADE;
DROP TABLE IF EXISTS int_flights CASCADE;
DROP TABLE IF EXISTS flight_routes CASCADE;
DROP TABLE IF EXISTS flights_airports CASCADE;


-------------------------------------------
-- Create airport table to import data
CREATE TABLE airports (
	airport_name VARCHAR(70),
	city VARCHAR(70),
	country VARCHAR(70),
	airport_id VARCHAR(10),
	latitude VARCHAR(20),
	longitude VARCHAR(20),
	altitude INTEGER,			
	PRIMARY KEY (airport_id)	
	);

-- SELECT * FROM airports;


-------------------------------------------
-- Create airlines table to import data
CREATE TABLE airlines (
	airline_name VARCHAR(70),
	airline_id VARCHAR(10),
	origin_country VARCHAR(70),
	active VARCHAR(5),
	PRIMARY KEY (airline_id)	
	);
	
-- SELECT * FROM airlines;


-------------------------------------------
-- Create domestic flights table to import data
CREATE TABLE dom_flights (
	id INTEGER,
	date DATE,			
	airline_id VARCHAR(10),	
	dep_airport VARCHAR(10),
	des_airport VARCHAR(10),
	total INTEGER,	
	PRIMARY KEY (id),
	FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),	
	FOREIGN KEY (dep_airport) REFERENCES airports(airport_id),
	FOREIGN KEY (des_airport) REFERENCES airports(airport_id)
	);
	
SELECT * FROM dom_flights;


-------------------------------------------
-- Create international flights table to import data
CREATE TABLE int_flights (
	id INTEGER,
	date DATE,	
	dep_airport VARCHAR(10),
	des_airport VARCHAR(10),	
	airline_id VARCHAR(10),	
	total INTEGER,	
	PRIMARY KEY (id),
	FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),	
	FOREIGN KEY (dep_airport) REFERENCES airports(airport_id),
	FOREIGN KEY (des_airport) REFERENCES airports(airport_id)
	);
	
	SELECT * FROM int_flights;
	

-------------------------------------------
-- Create all global flight routes table not limited to NYC to import data
CREATE TABLE flight_routes (
	index INTEGER,
	airline_id VARCHAR(10),	
	dep_airport_id VARCHAR(10),
	des_airport_id VARCHAR(10),
	stops INTEGER,
	PRIMARY KEY (index)
-- 	FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),
-- 	FOREIGN KEY (dep_airport_id) REFERENCES airports(airport_id),
-- 	FOREIGN KEY (des_airport_id) REFERENCES airports(airport_id)
	);
	
	SELECT * FROM flight_routes;
	
	
-------------------------------------------
-- Create all global flight routes table not limited to NYC to import data
CREATE TABLE flights_airports (
	airline_id VARCHAR(10),	
	dep_airport_id VARCHAR(10),
	des_airport_id VARCHAR(10),
	dep_name VARCHAR(70),
	dep_city VARCHAR(70),
	dep_country VARCHAR(70),	
	dep_latitude VARCHAR(20),
	dep_longitude VARCHAR(20),
	total INTEGER,
	des_name VARCHAR(70),
	des_city VARCHAR(70),
	des_country VARCHAR(70),	
	airport_id VARCHAR(10),
	des_latitude VARCHAR(20),
	des_longitude VARCHAR(20),		
	des_altitude INTEGER,		
	airline_name VARCHAR(70),		
	PRIMARY KEY (airline_id, dep_airport_id, des_airport_id)
	);
	
	SELECT * FROM flights_airports;