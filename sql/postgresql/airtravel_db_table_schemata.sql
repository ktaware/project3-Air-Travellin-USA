DROP TABLE IF EXISTS airlines CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS airports CASCADE;
DROP TABLE IF EXISTS flights CASCADE;

-- Create new tables to import data
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

-- SELECT * FROM airports

CREATE TABLE airlines (
	airline_name VARCHAR(70),
	airline_id VARCHAR(10),
	origin_country VARCHAR(70),
	active VARCHAR(5),
	PRIMARY KEY (airline_id)	
	);
	
-- SELECT * FROM airlines
	
CREATE TABLE flights (
	year INTEGER,
	month INTEGER,
	day INTEGER,	
	sched_dep_time INTEGER,	
	sched_arr_time INTEGER,
	carrier	VARCHAR(10),
	flight INTEGER,
	tailnum VARCHAR(10),
	origin VARCHAR(10),
	dest VARCHAR(10),
	air_time FLOAT,
	distance INTEGER,
	hour INTEGER,
	minute INTEGER,	
	FOREIGN KEY (carrier) REFERENCES airlines(airline_id),	
	FOREIGN KEY (origin) REFERENCES airports(airport_id),
	FOREIGN KEY (dest) REFERENCES airports(airport_id)
	);
	
-- SELECT * FROM flights

-- CREATE TABLE routes (
-- 	airline_id VARCHAR(10),	
-- 	dep_airport_id VARCHAR(10),
-- 	des_airport_id VARCHAR(10),
-- 	stops INTEGER,	
-- 	FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),
-- 	FOREIGN KEY (dep_airport_id) REFERENCES airports(airport_id),
-- 	FOREIGN KEY (des_airport_id) REFERENCES airports(airport_id)
-- 	);

-- SELECT * FROM routes