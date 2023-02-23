var airports = [];
var airlines = [];
var flights = [];

function init() {
// Fetch the JSON data and console log it
  d3.csv("https://raw.githubusercontent.com/ktaware/project3/main/data/airports_for_webpage.csv").then(function(_airports) {
    airports = _airports;
    d3.csv("https://raw.githubusercontent.com/ktaware/project3/main/data/raw_data/airlines.csv").then(function(_airlines) {
      airlines = _airlines;
      d3.csv("https://raw.githubusercontent.com/ktaware/project3/main/data/06_flights_airports.csv").then(function(_flights) {
      flights = _flights;  
      var selector = d3.select("#selDataset");
      airports.forEach((airport) => {
          selector
          .append("option")
          .text(airport.name)
          .property("value", airport.name);
        });
      var firstairport = airports;
      buildairport(firstairport );
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


function buildairport(airportId) {
    var myFlights = flights.filter(f => f.dep_name == airportId);
    let destcount= {};
    for (let i = 0; i < myFlights.length; i++) {
      let flightDest = myFlights[i];
        // Conditional statement to determine array assignment
        destcount[flightDest.des_name] = (destcount[flightDest.des_name]||0) + 1;
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



    let vals = Object.values(destcount).slice(0, 10).reverse();
    let keys = Object.keys(destcount).slice(0, 10).reverse();

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
     title: {text: "<b> Flights count for each destination </b>"},
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    let piedata = [{
      values: vals,
      labels: keys,
      type: "pie"
    }];
  
    let pielayout = {
      height: 500,
      width: 800
    };
  
    Plotly.newPlot("pie", piedata, pielayout);

}

