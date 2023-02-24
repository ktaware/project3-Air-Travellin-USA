// Data source
const url = 'http://127.0.0.1:5000/api/v1.0/flights_airports'

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

var airTraffic = []

d3.json(url).then(function(data) {
    console.log(data)
    for (var i = 0; i < data.length; i++) {
        var des_latitude = data[i].des_latitude;
        var des_longitude = data[i].des_longitude;
        var traffic = data[i].total;
        var popupText = `<strong> ${data[i].des_name} / ${data[i].des_airport_id}</strong><hr>
        <strong>Total NYC Flights Inbound: </strong>${traffic}<br>
        <strong>Location:</strong> ${data[i].des_city}, ${data[i].des_country}<br>
        <strong>Coordinates: </strong>${des_latitude}, ${des_longitude}<br>
        <strong>Altitude: </strong>${data[i].des_altitude}<br>`;            
        // console.log(latitude);
        // console.log(longitude);
        if (location) {
            airTraffic.push(
                L.circleMarker([des_latitude, des_longitude], {
                    stroke: true,        
                    weight: 2,
                    color: "#ffffff",
                    opacity: .9,        
                    fillColor: trafficColor(traffic),
                    fillOpacity: 0.1,
                    radius: markerSize(traffic)
                }) 
            );
        }
    }
});

createMap(earthquakes)
    
    
// var myMap = L.map('map', {// .fitWorld();
//       center: [40.7128, -74.0060],
//       zoom: 11
//     });
    

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(myMap);


//-------------------------------------------------//


// Define createMap function to establish base layers, overlays and legend
function createMap(earthquakes) {
    // Create the base/tile layers that will be the background of our map
    var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    // Create a baseMaps object to hold our base layers
    var baseMaps = {
        "Street": streetMap    
    };

    // Create an overlays object to hold our overlay layers
    var overlayMaps = {
        // "Flight Routes": routes,
        "Air Traffic Density": airTraffic
    };

    var myMap = L.map('map', {// .fitWorld();
        center: [40.7128, -74.0060],
        zoom: 11,
        layers: [streetMap, airTraffic]
    });
    
    // Create a control for our layers, and pass it our baseMaps and overlayMaps objects
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
    // Declare and set up the legend
    var legend = L.control({
        position: "bottomright" 
    });
    
    // Provide legend information and labels
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var depths = [-10, 10, 20, 50, 70, 90];
        var colors = ["#00ff00", "#ccff00", "#ffff00", "#ffdd00", "#ffaa00", "#ff0000"];
        var labels = [];  
        // Reference css to format legend
        for (var i = 0; i < depths.length; i++) {
            labels.push(
                "<i style ='background: " + colors[i] + "'></i> " + 
                depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+")
            )
        }       
        // Use .join to add pushed label information to legend and add to the created div for the legend 
        div.innerHTML = labels.join('');
        return div;
    }
    
    // Add the legend to the map
    legend.addTo(myMap); 
};   


    // d3.json(url).then(function(text) {
    // for (var i = 0; i < text.length; i++) {
    //     var des_latitude = text[i].des_latitude;
    //     var des_longitude = text[i].des_longitude;
    //     var traffic = text[i].total;
    //     var popupText = `<strong> ${text[i].des_name} / ${text[i].des_airport_id}</strong><hr>
    //     <strong>Total NYC Flights Inbound: </strong>${traffic}<br>
    //     <strong>Location:</strong> ${text[i].des_city}, ${text[i].des_country}<br>
    //     <strong>Coordinates: </strong>${des_latitude}, ${des_longitude}<br>
    //     <strong>Altitude: </strong>${text[i].des_altitude}<br>`;            
    //     // console.log(latitude);
    //     // console.log(longitude);
    //     if (location) {
    //     L.circleMarker([des_latitude, des_longitude], {
    //         stroke: true,        
    //         weight: 2,
    //         color: "#ffffff",
    //         opacity: .9,        
    //         fillColor: trafficColor(traffic),
    //         fillOpacity: 0.1,
    //         radius: markerSize(traffic)
    //     }).addTo(myMap).bindPopup(popupText);          
    //     }
    // }      
    // });
    
// // fetch nyc to international airports
// fetch('/api/v1.0/nycint_airports').then(function (response) {
// // console.log(response)
// return response.json();        
// }).then(function (text) {
// console.log(text); // Print the text as JSON 
// // console.log(JSON.stringify(text)) // Prints the above as plain text in console
// for (var i = 0; i < text.length; i++) {
//     var latitude = text[i].latitude;
//     var longitude = text[i].longitude;
//     var popupText = `<strong> ${text[i].airport_name}</strong><hr>
//     <strong>Location:</strong> ${text[i].city}, ${text[i].country}<br>
//     <strong>Coordinates: </strong>${latitude}, ${longitude}<br>    
//     <strong>Altitude: </strong>${text[i].altitude}<br>`;
//     // console.log(latitude);
//     // console.log(longitude);
//     if (location) {
//     L.circleMarker([latitude, longitude], {
//         stroke: true,        
//         weight: 1,
//         color: "#000000",
//         opacity: .4,        
//         fillColor: "#0000ff",
//         fillOpacity: 0.4,
//         radius: (4)
//     }).addTo(myMap).bindPopup(popupText);          
//     }
// }      
// });


// // fetch nyc to domestic airports
// fetch('/api/v1.0/nycdom_airports').then(function (response) {
// // console.log(response)
// return response.json();        
// }).then(function (text) {
// console.log(text); // Print the text as JSON
// // console.log(JSON.stringify(text)) // Prints the above as plain text in console
// for (var i = 0; i < text.length; i++) {
//     var latitude = text[i].latitude;
//     var longitude = text[i].longitude;
//     var popupText = `<strong> ${text[i].airport_name}</strong><hr>
//     <strong>Location:</strong> ${text[i].city}, ${text[i].country}<br>
//     <strong>Coordinates: </strong>${latitude}, ${longitude}<br>    
//     <strong>Altitude: </strong>${text[i].altitude}<br>`;
//     // console.log(latitude);
//     // console.log(longitude);
//     if (location) {
//     L.circleMarker([latitude, longitude], {
//         stroke: true,        
//         weight: 1,
//         color: "#00cc00",
//         opacity: .4,        
//         fillColor: "#00ff00",
//         fillOpacity: 0.4,
//         radius: (4)
//     }).addTo(myMap).bindPopup(popupText);          
//     }
// }      
// });

// // fetch traffic density route
// fetch('/api/v1.0/traffic_density').then(function (response) {
// // console.log(response)
// return response.json();      
// }).then(function (text) {
// console.log(text); // Print the text as JSON
// // console.log(JSON.stringify(text)) // Prints the above as plain text in console
// // for (var i = 0; i < text.length; i++) {
// //     var aeroport = i;
// //     var flights = text[i];
// //     console.log(aeroport);
// //     console.log(flights)
// // };
// //     var longitude = text[i].longitude;
// //     var popupText = `<strong> ${text[i].airport_name}</strong><hr>
// //     <strong>Location:</strong> ${text[i].city}, ${text[i].country}<br>
// //     <strong>Coordinates: </strong>${latitude}, ${longitude}<br>    
// //     <strong>Altitude: </strong>${text[i].altitude}<br>`;
//     // console.log(flights);
// //     // console.log(longitude);
// //     if (location) {
// //     L.circleMarker([latitude, longitude], {
// //         stroke: true,        
// //         weight: 1,
// //         color: "#00cc00",
// //         opacity: .4,        
// //         fillColor: "#00ff00",
// //         fillOpacity: 0.4,
// //         radius: (4)
// //     }).addTo(myMap).bindPopup(popupText);          
// //     }
// // }      
// });



// // Heat Map test
// fetch('/api/v1.0/nycdom_airports').then(function (response) {
//     // console.log(response)
//     return response.json();        
//     }).then(function (text) {
//     // console.log(text);  
//     var heatArray = [];  
//     for (var i = 0; i < text.length; i++) {
//         var latitude = text[i].latitude;
//         var longitude = text[i].longitude;
  
//         if (location) {
//             heatArray.push([latitude, longitude]);
//         }
//     }
  
//     var heat = L.heatLayer(heatArray, {
//       radius: 20,
//       blur: 5
//     }).addTo(myMap);
// });