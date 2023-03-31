# Project 3 - Team 6 - Air Travellin' USA



Scenario: Best airlines to be a member of if we live in NYC (regardless of price) to take advantage of the most frequent flights & most numerous locations

**HTML landing page with button links**
![image](https://user-images.githubusercontent.com/115741217/221711264-0afddc54-4439-40dc-9898-f47da06d4ad6.png)

**Pre-Work (Cleaning, postgres, sqlAlchemy, Flask)**
- **A. Cleaning**    
    - Raw .csvs (***airlines, airports, flight_data, international_report_departures, routes***) are imported into jupyter and cleaned via Pandas' drop, rename, sum, functions.            
    - Cleaned .csvs saved ino ***data*** folder
        - A new ***flights_airports.csv*** was also created by joining the cleaned versions of ***dom_flights, int_flights and airports** (see Map Visuals section A and B for more)
        - **Note** data_csv_cleaning notebook for cleaning can be found in ***cleaning*** folder

- **B. SQL/SQLAlchemy**
    - ***airtravel_db_table_schemata.sql** created using postGres establishing tables for each respective .csv with column name, type and length.
        - Cleaned csvs are imported into airtravel_db in sequential order and are now hosted on a server.
        - airtravel_erd.sql created illustrating table relations.
        - Jupyter Notebook with sqlAlchemy imports is used to explore the newly created database.

- **C. Flask**
    - **Setup**
        - ***app.py** created in VS Code by way of sqlalchemy and flask imports.
        - engine created to reference ***airtravel_db*** on postgres server
        - Tables within database are reflected and references saved.
        - Session connecting to server initialized.
        - a columns_to_dict function was created to convert tables into usable format.
        - Jupyter Notebook with sqlAlchemy imports is used to explore the newly created database.
    - **Routes**
        - established routes for all main pages to be hosted on user interface side (index, charts, maps, delays and its subpages ontime, late, cancelled)
        - created airports route to host airport table data in jsonified format for use within javascript.
            - same process was applied to subsequent airlines, flights_airports, jfk_data tables
                - a new nyc_airports table and route is created filtering for solely NYC airports
    - **Initialize**
        - Session is closed and the app is initialized with .run. API is now up and running. Ready for use.
        
        
**1. Map visual**
![image](https://user-images.githubusercontent.com/115741217/221711315-f49d57e7-d4a6-40f7-af9e-59b9d3454f08.png)

A. **Map of air routes by airline (airlines as optional overlay layers) with curve line routes from the 3 NY airports using Leaflet.Curve plug-in**

First, with the cleaned data, the international and domestic flight data was combined, and unnecessary columns were dropped. Then the flight data and the airport data needed to be combined to attach the airport coordinates and airport names to each flight's departing and destination airport. This was done in using python pandas. 

The data was then read in JS and a loop was created to look at each flight's beginning and ending coordatinates. Using the curve plugin, a midpoint was needed to draw the curve, so some calculations are done for each departure/destination pair to determine a midpoint. Based on the departing airport, a colour was assigned to each of the 3 NYC airports, and then the curve was plotted. A popup with the details was then added to each curve.
   
B. **Markers for each airport indicating the busiest airports/destinations by colour/size.**
   - **Source Data:**
      - Using the ***Airports_Flights*** table (domestic + International flights & airports) stored on the postgres server and hosted as an API via Flask. 

   - **Marker Creation Process:**
      - By calling a fetchFlights function on the ***Airports_Flights*** table and running it through an ***async function main()*** with a time delay to allow the data to catchup to the call, we were able to parse and store the jasonified data in a const variable.
      - The ***data*** const was then looped through to isolate destination airport latitudes and longitudes originating from the NYC airports.
      - At the same time, metadata was also retrieved and stored in an overarching ***popupText*** variable
      - Using the retrieved location data, we were able to push ***L.circleMarkers*** to a ***flightTraffic*** container variable and the .***.bindPopup*** method was appied with the popupText data in the process.
      - A second fetch function (***nycAirportfetch***) of a filtered version of ***Airports_Flights*** called ***nyc_airports*** was also run and the data captured as the ***airports*** variable. A loop was run on ***airports*** to capture its location and popup data in the same way as above and pushed to the same ***flightTraffic*** container.
      
   - **Leaflet Layers:**
      - To begin the base layers and corresponding baseMaps object were declared and the map object created.
      - The ***flightTraffic*** layer container was added to the layer groups and ultimately the overlayMaps object.
      - baseMaps and overlayMaps were passed to laer control.
      - Finally, the asynced main function was called and initiated.
        
        
  
**2. Dashboard: Drop-down filter for airports**

**A. Bar graph of volume of flights for destinations**
- **For globe:** -The files are hosted from Amazon CloudFront, which distributes them to edge locations all over the world for fast access and reliability. 
- https://code.highcharts.com/
- https://ktaware.github.io/project3-Air-Travellin-USA/

![image](https://user-images.githubusercontent.com/115741217/221711366-b436ec75-5a69-4edc-bfbb-ce786df35e4e.png)



**B. Pie chart of on-time/late/cancelled flights by airline (web scraped https://jfkairport.net/statistics/)**

![image](https://user-images.githubusercontent.com/115741217/221711380-2a82c962-49b9-425c-85cb-7285a37d2e91.png)


  
PRESENTATION LINK: https://docs.google.com/presentation/d/1MG3JPl2o1v6_9uyvitNAErBOgpETSVxQZbuoRyTFhaA/edit?usp=sharing
