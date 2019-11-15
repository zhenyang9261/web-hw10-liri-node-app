# liri node app

## About this app
This is a Node app that makes API calls to get information from the following sites:
* Concert information from Band In Town API
* Song information from Spotify API
* Movie information from IMDB API

## How to set up the app and run in your local computer
1. Clone this github repository to your local computer.
2. Enter the app folder, and type "npm install". This will install necessary node packages.
3. You will need Spotify API key to run this app. Go to https://developer.spotify.com/dashboard/login to apply for a free API developer account and find the API user id and secret.
4. In the local folder, create a file .env and put your Spotify API user id and secret in the file in the following format:

    SPOTIFY_ID=your-id

    SPOTIFY_SECRET=your-secret

## How to run this app
There are 4 user input options. Replace the text in italic with the artist/song/movie your want to search.

**node liri.js concert-this _artist_**

If no artist name is entered, the app will run with default name "Celion Dion".

**node liri.js spotify-this-song _song_**

If no song is entered, the app will run with default name "The Sign".

**node liri.js movie-this _movie_**

If no movie is entered, the app will run with default name "Mr. Nobody"

**node liri.js do-what-it-says**

Open the file named random.txt, enter a text line in the format of _optioin,"name"_. For example, _concert-this,"lewis capaldi"_. The app will run the option in this file.

## Demo
Open up the video clip file named **liri-node-app.gif** and watch a short video that demonstrates how this app works.


