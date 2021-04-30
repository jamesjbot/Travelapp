# Travel Weather App

## Noteworthy
Capstone Project, Udacity Front End Developer Nanodegree; Udacity Reviewed and Evaluated

## Overview
This project allows you to plan multiple trips and gives you the weather for your destination within a 16 day window.

## Technologies Used

Javascript, HTML, CSS, Webpack, Service Workers

Third Party API: Geonames, Pixabay, Weatherbit

## How to use
Start the server by using Terminal in the base directory.

Start the server with 'npm run start'.

Direct your web browser to http://localhost:9000/, to access the application.

## Example Usage

In the destination dialog box,
type a place name in the 'Enter Placename here' text area of the form city, state or city, country.

Either enter the date via keyboard or date picker.

Click 'Get Travel Info' to fetch weather and a picture of your destination plus 
some trip stats.

Click 'Remove Trip' to remove the destination.

Click 'Add Another Trip Leg' to get another destination dialog box.

### Extended Features Added

Multiple Destination Trips are possible by clicking add leg button. The appropriate 
weather for location will be pulled in.

Users can remove legs of a trip.

If an image cannot be found the user will be notified in the image's figure_caption.

The user may name a place improperly so the location that we looked up will appear 
in the line that shows how many days away the trip is. IE Phoenix, New Mexico 
yields Phoenix Lake, New Mexico not Phoenix, Arizona.

### Developer tips

If you're going to make changes you can use the dev shortcut 'npm run dev', 
which will both compile and run the server.

## Author
James Jongs jongsj@gmail.com

Released under the MIT License

## Version

1.0.1
