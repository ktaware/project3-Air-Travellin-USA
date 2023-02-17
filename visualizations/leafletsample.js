// Declare globals to hold the API endpoints to be queried and scraped for data
const plateUrl = "Leaflet-Part-2/static/js/plates.geojson";
// Declare plateUrl = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json";
const quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform an API call on the plateUrl to scrape the GeoJSON data for the tectonic plate information
d3.json(plateUrl).then((plateData) => {
  console.log(plateData)
  // Use L.geoJSON to create a map layer with the retrieved plateData
  plates = L.geoJSON(plateData, {
    // Style each "feature" of the retrieved tectonic plates
    style: function(feature) {
      return {
        color: "red",
        fillColor: "black",
        fillOpacity: 0,
        weight: 2
      };
    },
    // Use onEachFeature to apply changes to each individual feature
    onEachFeature: function(feature,layer){
      // Set the mouse events to change the map styling.
      layer.on({
        // When a user's mouse cursor touches a map feature, the mouseover event calls this function, which makes that feature's opacity change to 40% so that it stands out.
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.4
          });
        },
        // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to its default of 0%.
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0
          });
        }
      });
      // Use .bindPopup function to display each plate's name on click
      layer.bindPopup(`<strong>${feature.properties.PlateName} Plate</strong>`);
    }
  });
    
  // Perform a second API call call, this time on the quakeUrl to retrieve earthquake results
  d3.json(quakeUrl).then((earthquakeData) => {
    console.log(earthquakeData)
    // Once we get a response, send the earthquakeData.features object to the createFeatures function
    createFeatures(earthquakeData.features);
  });

  // Define a depthColor function to color code markers based on depth of earthquake
  function depthColor(depth) {
    if (depth < 10) return "#00ff00";
    else if (depth < 20) return "#ccff00";
    else if (depth < 50) return "#ffff00";
    else if (depth < 70) return "#ffdd00";
    else if (depth < 90) return "#ffaa00";
    else return "#ff0000";
  }

  // Define a createFeatures function that we want to run once for each feature in the features array
  function createFeatures(earthquakeData) {
    console.log(earthquakeData)
    // Use .bindPopup function to give each feature a popup that describes the place, magnitude, time of the earthquake and a url to further information
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
      <strong>Magnitude:</strong> ${feature.properties.mag}<br>
      <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km<br>
      <strong>Date: </strong>${new Date(feature.properties.time)}<br>    
      <a href="${feature.properties.url}">Further Info</a>`);       
    }  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
          // Define appearance of markers, referencing depthColor function to assign colors
          stroke: true,        
          weight: 1,
          color: '#000000',
          opacity: .4,        
          fillColor: depthColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.4,
          radius: (feature.properties.mag * 4)          
        });
      },
      // Run the onEachFeature function once for each piece of data in the array
      onEachFeature: onEachFeature
    });      
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
});

// Define createMap function to establish base layers, overlays and legend
function createMap(earthquakes) {
  // Create the base/tile layers that will be the background of our map
  var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var esriMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
    maxZoom: 13
  });
  // Create a baseMaps object to hold our base layers
  var baseMaps = {
    "Street": streetMap,
    "Topographic": topoMap,
    "ESRI": esriMap
  };
  // Create an overlays object to hold our overlay layers
  var overlayMaps = {
    "Tectconic Plates": plates,
    "Earthquakes": earthquakes
  };
  // Define a map object with our default layers.
  var myMap = L.map("map", {
    center: [35.0522, -118.2437],
    zoom: 5,
    layers: [streetMap, plates, earthquakes]
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