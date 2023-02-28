var airports = [];
var airlines = [];
var flights = [];

function init() {
// Fetch the JSON data and console log it
d3.csv("https://raw.githubusercontent.com/ktaware/project3/main/airports_for_webpage.csv").then(function(_airports) {
  airports = _airports;
  
    d3.csv("https://raw.githubusercontent.com/ktaware/project3/main/data/05_flights_airports.csv").then(function(_flights) {
    flights = _flights;   
      var selector = d3.select("#selDataset");
      airports.forEach((airport) => {
          selector
          .append("option")
          .text(airport.name)
          .property("value", airport.name);
        });
      var firstairport = airports[0].airport_id;
      buildairport(firstairport );
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
    let destCount= {};
    let airlineCount= {};
    for (let i = 0; i < myFlights.length; i++) {
      let flightDest = myFlights[i];
        // Conditional statement to determine array assignment
        destCount[flightDest.des_name] = (destCount[flightDest.des_name]||0) + 1;
        airlineCount[flightDest.airline_name] = (airlineCount[flightDest.airline_name]||0) + 1;
    }

     // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value .
  Object.entries(airlineCount).forEach(([key, value]) => {
    PANEL.append("h6").text(`${key}: ${value}`);
  });


    
  let vals = Object.values(airlineCount).slice(0, 10).reverse();
  let keys = Object.keys(airlineCount).slice(0, 10).reverse();

  let vals1 = Object.values(destCount).slice(0, 10).reverse();
  let keys1 = Object.keys(destCount).slice(0, 10).reverse();



    //  Create the trace for the bar chart. 
    var barData = [{
      x: keys,
      y: vals,
      type: "bar",
      orientation: "v",
      text: "labels"
    }];

    //  Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "<b>  Destination Count For Airline </b>"},
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    let piedata = [{
      values: vals1,
      labels: keys1,
      type: "pie"
    }];
  
     //  Create the layout for the pie chart. 
    let pielayout = {
      title:"<b>Airports destination with Airline %</b>",
      height: 500,
      width: 800
    };
  
    // Use Plotly to plot
    Plotly.newPlot("pie", piedata, pielayout);

}

