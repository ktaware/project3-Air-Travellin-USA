// Data source
const url = 'http://127.0.0.1:5000/api/v1.0/flights_airports'
// var url = 'https://raw.githubusercontent.com/ktaware/project3/main/visualizations/flask-java-python-test/static/js/flights_airports.js'
// var url = '../js/flights_airports.js'

var data2 = [
    {
      "airline_id": "AC", 
      "airport_id": "YYZ", 
      "dep_airport_id": "EWR", 
      "dep_city": "Newark", 
      "dep_country": "United States", 
      "dep_latitude": "40.69250107", 
      "dep_longitude": "-74.16870117", 
      "dep_name": "Newark Liberty International Airport", 
      "des_airport_id": "YYZ", 
      "des_altitude": 569, 
      "des_city": "Toronto", 
      "des_country": "Canada", 
      "des_latitude": "43.67720032", 
      "des_longitude": "-79.63059998", 
      "des_name": "Lester B. Pearson International Airport", 
      "total": 34610
    },
    {
    "airline_id": "AC", 
    "airport_id": "EWR", 
    "dep_airport_id": "YYZ", 
    "dep_city": "Toronto", 
    "dep_country": "Canada", 
    "dep_latitude": "43.67720032", 
    "dep_longitude": "-79.63059998", 
    "dep_name": "Lester B. Pearson International Airport", 
    "des_airport_id": "EWR", 
    "des_altitude": 569, 
    "des_city": "Newark", 
    "des_country": "United States", 
    "des_latitude": "40.69250107", 
    "des_longitude": "-74.16870117", 
    "des_name": "Newark Liberty International Airport", 
    "total": 34610
      }
]

// A function to determine the marker size based on the population
function markerSize(traffic) {
    return Math.sqrt(traffic) * .25;
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



// An array that will store the created cityMarkers
var testcities = []
var testroutes = []

// // fetch all nyc flight paths
// fetch('/api/v1.0/flights_airports').then(function (response) {        
//     return response.json();        
// }).then(function (text) {
//     console.log(text)    

d3.json(url).then(function(data) {
    for (var i = 0; i < data.length; i++) {        
        var des_latitude = data[i].des_latitude;
        var des_longitude = data[i].des_longitude;
        var traffic = data[i].total;
        var popupText = `<strong> ${data[i].des_name} / ${data[i].des_airport_id}</strong><hr>
        <strong>Total NYC Flights Inbound: </strong>${traffic}<br>
        <strong>Location:</strong> ${data[i].des_city}, ${data[i].des_country}<br>
        <strong>Coordinates: </strong>${des_latitude}, ${des_longitude}<br>
        <strong>Altitude: </strong>${data[i].des_altitude}<br>`;            
        if (location) {
            testcities.push(
                L.circle([data[i].des_latitude, data[i].des_longitude], {
                stroke: true,        
                weight: 2,
                color: "#ffffff",
                opacity: .9,        
                fillColor: trafficColor(traffic),
                fillOpacity: 0.5,
                radius: 10000
            }).bindPopup(popupText));              
            // }).addTo(myMap).bindPopup(popupText));          
        }        
    }
    
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
        var airline = data[i].airline_id;

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
        
        testroutes.push(
            L.curve(
                ['M', latlng1,
                'Q', midpointLatLng,
                latlng2],
                pathOptions
            )            
        .bindPopup(`<h1>Destination: ${endcity}, ${endcountry} ${endairport}</h1> <hr> <h2>From: ${airportname} ${fromairport}</h2> <hr> <h3>Airline: ${airline}</h3>`))
        // .addTo(myMap);
    }

});

console.log(testcities)

//-------------------------------------------------//


// Create two separate layer groups: one for the city markers and another for the state markers.
var routesLayer = L.layerGroup(testroutes);
var trafficLayer = L.layerGroup(testcities);

// Define the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create two separate layer groups: one for the city markers and another for the state markers.
var routesLayer = L.layerGroup(testroutes);
var trafficLayer = L.layerGroup(testcities);

// Create a baseMaps object.
var baseMaps = {
    Street: street,
    Topography: topo
};
  
// Create an overlay object.
var overlayMaps = {
    "Flight Routes": routesLayer,
    "Air Traffic": trafficLayer
};

// Create a map object, and set the default layers.
var myMap = L.map("map", {
    center: [40.7128, -74.0060],
    zoom: 9,
    layers: [street, routesLayer, trafficLayer]
});

// Pass our map layers into our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);