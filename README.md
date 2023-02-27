# project3-team6

Air Travellin' USA

Scenario: Best airlines to be a member of if we live in NYC (regardless of price) to take advantage of the most frequent flights & most numerous locations

HTML landing page with button links to: 

1. Map visual
 
A. [SAM] Map of air routes by airline (airlines as optional overlay layers) with curve line routes from the 3 NY airports using Leaflet.Curve plug-in:
First, with the cleaned data, the international and domestic flight data was combined, and unnecessary columns were dropped. Then the flight data and the airport data needed to be combined to attach the airport coordinates and airport names to each flight's departing and destination airport. This was done in using python pandas. 

The data was then read in JS and a loop was created to look at each flight's beginning and ending coordatinates. Using the curve plugin, a midpoint was needed to draw the curve, so some calculations are done for each departure/destination pair to determine a midpoint. Based on the departing airport, a colour was assigned to each of the 3 NYC airports, and then the curve was plotted. A popup with the details was then added to each curve.
   
B [TERRY] Markers for each airport indicating the busiest airports/destinations by colour/size.
  
2. Dashboard: Drop-down filter for airports

A. [KOMAL] bar graph of volume of flights for destinations

B. [NIMRA] pie chart of on-time/late/cancelled flights by airline (web scraped https://jfkairport.net/statistics/)


  
PRESENTATION LINK: https://docs.google.com/presentation/d/1MG3JPl2o1v6_9uyvitNAErBOgpETSVxQZbuoRyTFhaA/edit?usp=sharing
