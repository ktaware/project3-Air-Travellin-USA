// Data source
const url = 'http://127.0.0.1:5000/api/v1.0/flights_airports'

// A function to determine the marker size based on the population
function markerSize(traffic) {
    return Math.sqrt(traffic) * .5;
    // return Math.sqrt(traffic) * 500;
}

// Define a trafficColor function to color code markers based on density of air traffic
function trafficColor(traffic) {
    if (traffic < 500) return "#00ff00";
    else if (traffic < 1000) return "#ccff00";
    else if (traffic < 2500) return "#ffff00";
    else if (traffic < 5000) return "#ffdd00";
    else if (traffic < 10000) return "#ffaa00";
    else return "#ff0000";
    }

// Define a nycFlights function to provide # of outbound flights from NYC airports
function nycFlights(id) {
    if (id == "JFK") return "1962894";
    else if (id == "EWR") return "1614823";
    else if (id == "LGA") return "1224668";  
}   

// Declare airports variable to capture fetched data
var airports = [];

// Define function to fetch only NYC airport data
function nycAirportfetch() {    
    d3.json('http://127.0.0.1:5000/api/v1.0/nyc_airports').then(function(_airports) {
    airports = _airports;
    });
}

nycAirportfetch();

// Define fetchFlights function retrieve data from API
const fetchFlights = ()=>{
    return fetch('/api/v1.0/flights_airports');
}

// Define main function with async to pass fetched data through
async function main(){
    try {
        // Declare const res and data variables with await method to force code to wait for API response and data
        const res = await fetchFlights();
        const data = await res.json();
        // handle the data from here on out, this will now work ONLY after the data arrival
        // Declare variables to hold each airports' routes and flight traffic retrieved via loop functon
        var ewrRoutes = []
        var jfkRoutes = []
        var lgaRoutes = []
        var flightTraffic = []
        // Initiate loop to retrieve air traffic and create circleMarkers for all destination airports
        for (var i = 0; i < data.length; i++) {            
            var des_latitude = data[i].des_latitude;
            var des_longitude = data[i].des_longitude;
            var traffic = data[i].total;
            var popupText = `<strong> ${data[i].des_name} / ${data[i].des_airport_id}</strong><hr>
            <strong>Total Flights Inbound from NYC: </strong>${traffic}<br>
            <strong>Location:</strong> ${data[i].des_city}, ${data[i].des_country}<br>
            <strong>Coordinates: </strong>${des_latitude}, ${des_longitude}<br>
            <strong>Altitude: </strong>${data[i].des_altitude}m<br>`;            
            flightTraffic.push((
                L.circleMarker([des_latitude, des_longitude], {
                stroke: true,        
                weight: 1,
                color: "#ffffff",
                opacity: .9,        
                fillColor: trafficColor(traffic),
                fillOpacity: 0.08,
                radius: markerSize(traffic)
                }).bindPopup(popupText))
            );             
        }

        // Initiate loop to retrieve air traffic and create circleMarkers for all NYC airports
        for (var i = 0; i < airports.length; i++) {              
            var latitude = airports[i].latitude;
            var longitude = airports[i].longitude;        
            var outbound = nycFlights(airports[i].airport_id)
            console.log(outbound)
            var popupText = `<strong> ${airports[i].airport_name} / ${airports[i].airport_id}</strong><hr>
            <strong>Total Flights Outbound: </strong>${outbound}<br>
            <strong>Location:</strong> ${airports[i].city}, ${airports[i].country}<br>
            <strong>Coordinates: </strong>${latitude}, ${longitude}<br>
            <strong>Altitude: </strong>${airports[i].altitude}m<br>`;            
            flightTraffic.push((
                L.circleMarker([latitude, longitude], {
                stroke: true,        
                weight: 1,
                color: "#000000",
                opacity: .9,        
                fillColor: "#00fff0",                
                fillOpacity: 0.5,
                radius: 5                
                }).bindPopup(popupText))
            );
        }

        // Initiate loop to retrieve all flight routes departing from NYC airports
        for (var i=0; i < data.length; i++) {            
            var lat1 = data[i].dep_latitude;
            var lng1 = data[i].dep_longitude;
            var lat2 = data[i].des_latitude;
            var lng2 = data[i].des_longitude;
            var latlng1 = [lat1,lng1];
            var latlng2 = [lat2,lng2];
        
            var depAirport = data[i].dep_airport_id;
        
            var endcity = data[i].des_city;
            var endcountry = data[i].des_country;
            var endairport = data[i].des_airport_id;
            var fromairport = data[i].dep_airport_id;
            var airportname = data[i].dep_name;
            var airline = data[i].airline_name;
            var aid = data[i].airline_id;
        
            var latlngs = [];
        
            var offsetX = latlng2[1] - latlng1[1],
                offsetY = latlng2[0] - latlng1[0];
            
            var r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
                theta = Math.atan2(offsetY, offsetX);
        
            var thetaOffset = (3.14/10);
        
            var r2 = (r/2)/(Math.cos(thetaOffset)),
                theta2 = theta + thetaOffset;
            
            var midpointX = (r2 * Math.cos(theta2)) + (1*latlng1[1]),
                midpointY = (r2 * Math.cos(theta2)) +(1*latlng1[0]);
        
            var midpointLatLng =  [midpointY, midpointX];
            
            latlngs.push(latlng1, midpointLatLng, latlng2);
            
            var airportcolour = "#884EA0";
            if (depAirport === "EWR") airportcolour = "#148F77";
                else if (depAirport === "LGA")
                airportcolour = "#E67E22"
                else airportcolour = "#884EA0";
        
            var pathOptions = {
                color: airportcolour, 
                weight: 1};
            
            if (data[i].dep_airport_id === "EWR") {
                ewrRoutes.push(                    
                    L.curve(
                        ['M', latlng1,
                        'Q', midpointLatLng,
                        latlng2],
                        pathOptions
                    )            
                    .bindPopup(`<h2>Destination: ${endcity}, ${endcountry} ${endairport}</h2> <hr> <h3>From: ${airportname} ${fromairport}</h3> <hr> <h4>Airline: ${aid} - ${airline}</h4>`))
                } else if (data[i].dep_airport_id === "JFK") {                    
                    jfkRoutes.push(
                        L.curve(
                            ['M', latlng1,
                            'Q', midpointLatLng,
                            latlng2],
                            pathOptions
                        )            
                        .bindPopup(`<h2>Destination: ${endcity}, ${endcountry} ${endairport}</h2> <hr> <h3>From: ${airportname} ${fromairport}</h3> <hr> <h4>Airline: ${aid} - ${airline}</h4>`))
                    } else {
                        lgaRoutes.push(
                            L.curve(
                                ['M', latlng1,
                                'Q', midpointLatLng,
                                latlng2],
                                pathOptions
                            )            
                            .bindPopup(`<h2>Destination: ${endcity}, ${endcountry} ${endairport}</h2> <hr> <h3>From: ${airportname} ${fromairport}</h3> <hr> <h4>Airline: ${aid} - ${airline}</h4>`))
                    }            
            }
        
        
//////////////////////////////////------------------Pass Data to Leaflet--------------------//////////////////////////////////

        // Define the base layers.
        var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
        var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });

        // Create four separate layer groups: one each for the ewr, jfk and lgaRoutes markers and another for the flightTraffic markers.
        var ewrLayer = L.layerGroup(ewrRoutes);
        var jfkLayer = L.layerGroup(jfkRoutes);
        var lgaLayer = L.layerGroup(lgaRoutes);
        var trafficLayer = L.layerGroup(flightTraffic);

        // Create a baseMaps object.
        var baseMaps = {
            Street: street,
            Topography: topo
        };
        
        // Create an overlay object.
        var overlayMaps = {
            "Newark Routes": ewrLayer,
            "JFK Routes": jfkLayer,
            "LaGuardia Routes": lgaLayer,
            "Air Traffic": trafficLayer
        };

        // Create a map object, and set the default layers.
        var myMap = L.map("map", {
            center: [40.7128, -74.0060],
            zoom: 10,
            layers: [street, jfkLayer, trafficLayer]
        });

        // Pass our map layers into our layer control.
        // Add the layer control to the map.
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);        
    } catch (err) {
        console.log(err);
    }
}

main();