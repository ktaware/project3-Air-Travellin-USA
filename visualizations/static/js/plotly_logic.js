// Data sources
const airportsJson = 'http://127.0.0.1:5000/api/v1.0/nyc_airports'
const flightsJson = 'http://127.0.0.1:5000/api/v1.0/flights_airports'

// Declare variables to hold fetched data
var airports = [];
// var airlines = [];
var flights = [];

function init() {
  // fetch all airports
  d3.json(airportsJson).then(function(_airports) {
    airports = _airports;            
    // fetch all flights
    d3.json(flightsJson).then(function(_flights) {
      flights = _flights;              
      // Declare a selector variable to grab a reference to the dropdown select element within the index.html
      var selector = d3.select("#selDataset");
      // Populate the selector with the airport names by chaining together .append, .text. and .property
      airports.forEach((airport) => {
        selector
        .append("option")
        .text(airport.airport_name)
        .property("value", airport.airport_name);
      });
      // Isolate the first airport and use it to build the default plots
      var firstairport = airports[0].airport_id;
      buildairport(firstairport);
      console.log(firstairport)
    });
  });
}

// Initialize the dashboard
init();

// Define function to capture drop down selection change
function optionChanged(airportId) {
  // Fetch new data each time a new sample is selected
  buildairport(airportId); 
}

// Define function to 
function buildairport(airportId) {
  var myFlights = flights.filter(f => f.dep_name == airportId);
  let destCount= {};
  let outbound= 0
  let cityCount= [];
  let countryCount= [];
  let airlineCount= {};
  for (let i = 0; i < myFlights.length; i++) {
    let flightDest = myFlights[i];
    // Conditional statement to determine object assignment
    destCount[flightDest.des_name] = (destCount[flightDest.des_name]||0) + 1;
    cityCount[flightDest.des_city] = (destCount[flightDest.des_city]||0) + 1;
    outbound = outbound + flightDest.total;
    countryCount[flightDest.des_country] = (destCount[flightDest.des_country]||0) + 1;
    airlineCount[flightDest.airline_name] = (airlineCount[flightDest.airline_name]||0) + 1;             
  }     

    // Use d3 to select the panel with id of `#sample-metadata`
  var PANEL = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  PANEL.html("");  

  // Define function to sort assigned objects
  function sort_object(obj) {
    items = Object.keys(obj).map(function(key) {
        return [key, obj[key]];
    });
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    sorted_obj={}
    items.forEach( function(v) {      
        use_key = v[0]
        use_value = v[1]
        sorted_obj[use_key] = use_value
    })      
    return(sorted_obj)
  }
  
  // Call sort_object function on destCount, cityCount and airlineCount
  destSorted = sort_object(destCount);
  citySorted = sort_object(cityCount);
  airlineSorted = sort_object(airlineCount);
  
  // Use .slice to determine top ten cities and airports serviced as well as airlines; declare as local variables
  let cityTop = Object.keys(citySorted).slice(0, 20);        
  let destTot = Object.values(destSorted).slice(0, 10).reverse();
  let destNames = Object.keys(destSorted).slice(0, 10).reverse();
  let airlineTot = Object.values(airlineSorted).slice(0, 10);
  let airlineNames = Object.keys(airlineSorted).slice(0, 10);

  // PANEL.append("h6").text(`${cityCount} Hi`);
  // Use `Object.entries` to add each key and value pair to the panel 
  Object.entries(cityCount).forEach(([key, value]) => {
    PANEL.append("h6").text(`${key}`);
  });

  // Create the trace for the bar chart. 
  var barData = [{
    x: airlineNames,
    y: airlineTot,
    width: 0.7,
    type: "bar",
    orientation: "v",
    text: "Routes Offered"
  }];

  // Create the layout for the bar chart. 
  var barLayout = {
    height: 500,
    width: 500,
    bargap: 0.75,
    xaxis: {
      automargin: true,
      tickangle: -55        
    }      
  };
  // Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", barData, barLayout);

  // Create the trace for the pie chart. 
  let piedata = [{
    values: destTot,
    labels: destNames,
    type: "pie"
  }];

  // Create the layout for the pie chart.   
  let pielayout = {
    height: 500,
    width: 700
  };

  Plotly.newPlot("pie", piedata, pielayout);
}