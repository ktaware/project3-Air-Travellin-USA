
var airports = [];
var airlines = [];
var flights = [];
var routs = [];
function init() {
// Fetch the JSON data and console log it
d3.json("http://localhost:8000/static/js/airport.json").then(function(_airports) {
  airports = _airports;
  d3.json("http://localhost:8000/static/js/airlines.json").then(function(_airlines) {
      airlines = _airlines;
      d3.json("http://localhost:8000/static/js/flights.json").then(function(_flights) {
      flights = _flights;
      var selector = d3.select("#selDataset");
      airports.forEach((airport) => {
          selector
          .append("option")
          .text(airport.airport_name)
          .property("value", airport.airport_id);
        });

      var firstairport = airports[0];
      buildairport(firstairport);
     });
    });
});
}

// Initialize the dashboard
init();

function optionChanged(airportId) {
  // Fetch new data each time a new sample is selected
  buildairport(airportId); 
  
}

// Destination Panel 
function buildairport(airportId) {

    var frightsFromThisAirport = flights.filter(f => f.origin == airportId);
    
    destcount= {};
    // For loop to go through all movies
    for (let i = 0; i < frightsFromThisAirport.length; i++) {
        let frightdest = frightsFromThisAirport[i];
        console.log(frightdest.dest);
        // Conditional statement to determine array assignment
        destcount[frightdest.dest] = (destcount[frightdest.dest]||0) + 1;
    }

     // Use d3 to select the panel with id of `#sample-metadata`
  var PANEL = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  PANEL.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  Object.entries(destcount).forEach(([key, value]) => {
    PANEL.append("h6").text(`${key}: ${value}`);
  });

    let vals = Object.values(destcount);
    let keys = Object.keys(destcount);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: keys,
      y: vals,
      type: "bar",
      orientation: "v",
      text: "labels"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: {text: "<b> Airline count for each destination </b>"},
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    let piedata = [{
      values: vals,
      labels: keys,
      type: "pie"
    }];
  
    let pielayout = {
      height: 400,
      width: 400
    };
  
    Plotly.newPlot("pie", piedata, pielayout);
}


