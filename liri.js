require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');

function concertThis(artist) {
    var query = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    
    axios
      .get(query)
      .then(function(response) {

        var name, location, date;

        console.log("-----------------------------------------");
        console.log("Venue Name -- Location (City, Country) -- Date");
        console.log("-----------------------------------------");

        // Parse information from the response
        for(var i=0; i<response.data.length; i++) {

            name = response.data[i].venue.name; 
            location = response.data[i].venue.city + ", " + response.data[i].venue.country;
            date = moment(response.data[i].datetime).format("MM/DD/YYYY");
            console.log(name + " -- " + location + " -- " + date);
        }
      })
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
}

/*
 * Function: to show instructions of how to use this app. This function is called when user input is invalid
 */
function instruction() {

    console.log("----------- How to user this app ----------");
    console.log("node liri.js concert-this <artist name>");
    console.log("node liri.js spotify-this-song <song name>");
    console.log("node liri.js movie-this <movie name>");
    console.log("node liri.js do-what-it-says");
}

//------------- Main starts here -------------------------
var arg = process.argv;

// User did not enter any option.
if (arg[2] == null) {
    instruction();
    return;
}

// Get the artist name from argv and compose query parameter
var param = arg.slice(3).join("+")

switch (arg[2].toLowerCase()) {
    
    case "concert-this":
       
        concertThis(param);
        break;

    default:
        // User entered an invalid option
        instruction();
        break;
}