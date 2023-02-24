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

    
var myMap = L.map('map', {// .fitWorld();
      center: [40.7128, -74.0060],
      zoom: 11
    });
    

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(myMap);


// fetch all nyc flight paths
fetch('/api/v1.0/flights_airports').then(function (response) {
    // console.log(response)
    return response.json();        
    }).then(function (text) {
    console.log(text); // Print the text as JSON 
    // console.log(JSON.stringify(text)) // Prints the above as plain text in console
    for (var i = 0; i < text.length; i++) {
        var des_latitude = text[i].des_latitude;
        var des_longitude = text[i].des_longitude;
        var traffic = text[i].total;
        var popupText = `<strong> ${text[i].des_name} / ${text[i].des_airport_id}</strong><hr>
        <strong>Total NYC Flights Inbound: </strong>${traffic}<br>
        <strong>Location:</strong> ${text[i].des_city}, ${text[i].des_country}<br>
        <strong>Coordinates: </strong>${des_latitude}, ${des_longitude}<br>
        <strong>Altitude: </strong>${text[i].des_altitude}<br>`;            
        // console.log(latitude);
        // console.log(longitude);
        if (location) {
        L.circleMarker([des_latitude, des_longitude], {
            stroke: true,        
            weight: 2,
            color: "#ffffff",
            opacity: .9,        
            fillColor: trafficColor(traffic),
            fillOpacity: 0.1,
            radius: markerSize(traffic)
        }).addTo(myMap).bindPopup(popupText);          
        }
    }      
    });
    
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