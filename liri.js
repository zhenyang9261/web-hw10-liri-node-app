require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');

/*
 * Function: to get concert info from BandInTown API
 */
function concertThis(artist) {

    // If artist name is not entered, default to "Celion Dion"
    var artistQuery = artist.length === 0? 'celion dion' : artist.join("+");
    var query = "https://rest.bandsintown.com/artists/" + artistQuery + "/events?app_id=codingbootcamp"
    
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
 * Function: to get song info from Spotify API
 */
function spotifyThisSong(song) {

    var spotifySearch = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret
    });
    
    // If song is not entered, default to "The Sign"
    var query = song.length === 0? "The Sign" : song.join(" ");

    spotifySearch
      .search({ type: 'track', query: query })
      .then(function(response) {
          
        //console.log("-------------------------------");
        //console.log(response);
         
        for(var j=0; j<response.tracks.items.length; j++) {

          console.log("-------------------------------");
          console.log("Song Name: " + query);
          console.log("Artist(s): " + response.tracks.items[j].artists[0].name);
          console.log("Album: " + response.tracks.items[j].album.name);
          console.log("Preview Link: " + response.tracks.items[j].preview_url);
        }
        
      })
      .catch(function(err) {
        console.log(err);
      });
}

/*
 * Function: to get movie info from OMDB API
 */
function movieThis(movie) {

  // If no movie name is entered, default to "Mr. Nobody"
  var movieQuery = movie.length === 0? 'Mr. Nobody' : movie.join('+');
  var query = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";
  
  axios
    .get(query)
    .then(function(response) {

      //console.log(response.data);

      console.log("-------------------------------");            
      console.log("Movie Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomato Rating: " + response.data.Ratings[1].Value);
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Actors: " + response.data.Actors);
      console.log("Plot: " + response.data.Plot);
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

// Get the rest of user input
var param = arg.slice(3)

switch (arg[2].toLowerCase()) {
    
    case "concert-this":
       
        concertThis(param);
        break;

    case "spotify-this-song":

        spotifyThisSong(param);
        break;

    case "movie-this":
   
      movieThis(param);
      break;

    default:
      // User entered an invalid option
      instruction();
      break;
}