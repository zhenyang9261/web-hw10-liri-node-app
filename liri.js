require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require("fs");

var divider = "\n------------------------------------------\n";

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

        var responseData = response.data;

        // Concert info not found, stop executing
        if (responseData.length === 0) {
          console.log("Concert information not found. Please try another artist.");
          return;
        }

        // Compose the header information
        var header = (artist.length === 0? 'celion dion' : artist.join(" ")) + " concert information";
        var concerts = divider + header  + divider;

        // Parse information from the response
        for(var i=0; i<response.data.length; i++) {

          var concert = [
            "Venue Name: " + responseData[i].venue.name,
            "Location: " + responseData[i].venue.city + ", " + response.data[i].venue.country,
            "Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"),
            divider
            ].join("\n");
          
          concerts = concerts + concert;
        }

        // Output to file
        writeInfo(concerts);

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
          
          var trackData = response.tracks.items;

          // Song information not found, stop executing
          if (trackData.length === 0) {
            console.log("Song information not found. Please try another song.");
            return;
          }

          // Compose the header information
          var header = query + " song information";
          var tracks = divider + header  + divider;
         
          for(var i=0; i<response.tracks.items.length; i++) {

            var track = [
              "Song Name: " + query,
              "Artist(s): " + trackData[i].artists.map(artist => artist.name),
              "Album: " + trackData[i].album.name,
              "Preview Link: " + trackData[i].preview_url,
              divider
            ].join("\n");

            tracks = tracks + track;
          }

          // Write to log file and to console
          writeInfo(tracks);
        
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

      var movieData = response.data;

      // Movie info not found, stop executing
      // When movie not found, api will still return an object in the format of: { Response: 'False', Error: 'Movie not found!' }
      if (movieData.Response === "False") {
        console.log("Movie information not found. Please try another movie.");
        return;
      }

      // Compose the header information
      var header = (movie.length === 0? 'Mr. Nobody' : movie.join(" ")) + " movie information";
      var theMovie = divider + header  + divider;

      var rtRating = "Rating not found";
      // Find Rotten Tomatos rating
      if (movieData.Ratings) {
        movieData.Ratings.forEach(function(rating) {
          if (rating.Source.trim().toLowerCase() === "rotten tomatoes") {
            rtRating = rating.Value;
          }
        });
      }
      // for (var i=0; i<movieData.Ratings.length; i++) {
      //   if (movieData.Ratings[i].Source.trim().toLowerCase() === "rotten tomatoes") {
      //     rtRating = movieData.Ratings[i].Value;
      //     break;
      //   }
      // }

      var movieDetails = [
        "Movie Title: " + movieData.Title,
        "Release Year: " + movieData.Year,
        "IMDB Rating: " + movieData.imdbRating,
        "Rotten Tomato Rating: " + rtRating,
        "Country: " + movieData.Country,
        "Language: " + movieData.Language,
        "Actors: " + movieData.Actors,
        "Plot: " + movieData.Plot,
        divider
      ].join("\n");

      theMovie = theMovie + movieDetails;

      // Write to file and console
      writeInfo(theMovie);  
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
 * Function: to read a line of text from random.txt and execute the api call based on this text
 */
function doWhatItSays() {

  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
  
    // Split the string by comma. First element is the option, second element is the param
    var dataArr = data.split(",");

    // The second input param of runApp should be an array. Need to peel off the beginning and ending quatation marks first,
    // then split by space ' '.
    var param = dataArr[1].substring(1, dataArr[1].length-1);
    param = param.split(" ")
    runApp(dataArr[0], param);
  
  });
}

/*
 * Function: to append the input string to log.txt file
 */
function writeInfo(text) {
  fs.appendFile("log.txt", text, function(err) {
    // If an error was experienced we will log it.
    if (err) {
      console.log(err);
    }
    // If no error, also output the string to console
    else {
      console.log(text);
    }
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

/*
 * Function: to call different functions based on input
 */
function runApp(option, param) {

  switch (option) {
    
    case "concert-this":
       
      concertThis(param);
      break;

    case "spotify-this-song":

      spotifyThisSong(param);
      break;

    case "movie-this":
   
      movieThis(param);
      break;
    
    case "do-what-it-says":

      doWhatItSays();
      break;

    default:
      // User entered an invalid option
      instruction();
      break;
  }
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

// Run app based on user input
runApp(arg[2], param);