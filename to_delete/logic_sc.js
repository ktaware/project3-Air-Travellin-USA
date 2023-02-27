// Creating the map object
var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 5
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Data sources
var url = 'https://raw.githubusercontent.com/ktaware/project3/main/visualizations/flask-java-python-test/static/js/flights_airports.js'

//Straight Lines
// d3.json(url).then(function(data) {
//     console.log(data);

//     for (var i=0;i < data.length; i++) {
//         var lat1 = data[i].dep_latitude;
//         var lng1 = data[i].dep_longitude;
//         var lat2 = data[i].des_latitude;
//         var lng2 = data[i].des_longitude;
//         var line = [
//             [lat1,lng1],
//             [lat2,lng2]
//         ]
//         var depAirport = data[i].dep_airport_id;

//         var airportcolour = "#884EA0";
//         if (depAirport === "EWR") airportcolour = "#F39C12";
//             else if (depAirport === "LGA")
//             airportcolour = "#CB4335"
//             else airportcolour = "#884EA0";

//         L.polyline(line, {
//             color: airportcolour,
//             weight: 1
//             }
//         )
//         // .bindPopup(`<h1>${data.dep_name} to ${data.des_name}</h1> <hr> <h2> ${data.dep_city}, ${data.dep_country} to ${data.des_city}, ${data.des_country} </h2> <hr> <h3>${data.airline_id} </h3>`)
//             .addTo(myMap)

//         }

//     for (var i=0; i < data.length; i++) {
//         var endlat = data[i].des_latitude;
//         var endlng = data[i].des_longitude;
//         var endpoint = [endlat,endlng];

//         var endcity = data[i].des_city;
//         var endcountry = data[i].des_country;
//         var fromairport = data[i].dep_airport_id;
//         var airportname = data[i].dep_name;
//         var airline = data[i].airline_id;

//         L.circleMarker(endpoint, {
//             color: "grey",
//             weight:0.5,
//             radius:2
//         })
//             .bindPopup(`<h1>Destination: ${endcity}, ${endcountry}</h1> <hr> <h2>From ${airportname} ${fromairport}</h2> <hr> <h3>Airline: ${airline}</h3>`)
//             .addTo(myMap)
//     }
// })

// //Curved Lines
d3.json(url).then(function(data) {
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
        
        L.curve(
            ['M', latlng1,
            'Q', midpointLatLng,
            latlng2],
            pathOptions
        )
            .bindPopup(`<h1>Destination: ${endcity}, ${endcountry} ${endairport}</h1> <hr> <h2>From: ${airportname} ${fromairport}</h2> <hr> <h3>Airline: ${airline}</h3>`)
            .addTo(myMap); 
    }

    // for (var i=0; i < data.length; i++) {
    //     var endlat = data[i].des_latitude;
    //     var endlng = data[i].des_longitude;
    //     var endpoint = [endlat,endlng];

    //     var endcity = data[i].des_city;
    //     var endcountry = data[i].des_country;
    //     var fromairport = data[i].dep_airport_id;
    //     var airportname = data[i].dep_name;
    //     var airline = data[i].airline_id;

    //     L.circleMarker(endpoint, {
    //         color: "grey",
    //         weight:0.75,
    //         radius:2
    //     })
    //         .bindPopup(`<h1>Destination: ${endcity}, ${endcountry}</h1> <hr> <h2>From ${airportname} ${fromairport}</h2> <hr> <h3>Airline: ${airline}</h3>`)
    //         .addTo(myMap)  
    // }  
})

