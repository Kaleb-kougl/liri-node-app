require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");

var Spotify = new Spotify(keys.spotify);
const BANDS_URL = "https://rest.bandsintown.com/artists/";

var userChoice = process.argv[2];

switch (userChoice) {
  case "concert-this":
    if (process.argv.length > 3) {
      axios.get(`${BANDS_URL}${process.argv[3]}/events?app_id=${keys.bands.id}`)
      .then(function (response) {
        // console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          let date = moment(response.data[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY")
          console.log(`${response.data[i].venue.name} - ${response.data[i].venue.city}, ${response.data[i].venue.country} - ${date}\n`)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    } else {
      console.log("Please type a band as well, like the command below.\nnode liri.js concert-this <bandName>");
    }
    break;
  case "spotify-this-song":
    if (process.argv.length > 3) {
      let song = process.argv[3];
      for (let i = 4; i < process.argv.length; i++) {
        song += ` ${process.argv[i]}`
      }
      Spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        for (let i = 0; i < data.tracks['items'].length; i++) {
          if (data.tracks['items'][i].name === song) {
            let printThis = data.tracks['items'][i];
            console.log(`\nSong: ${printThis.artists[0].name}\nArtist: ${printThis.name}\nAlbum: ${printThis.album.name}\n${printThis.href}\n`)
          }
        }
      });
    } else {
      let song = "The Sign";
      Spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        for (let i = 0; i < data.tracks['items'].length; i++) {
          if (data.tracks['items'][i].name === 'The Sign') {
            console.log(data.tracks['items'][i].artists[0].name);
            console.log(data.tracks['items'][i].name);
            console.log(data.tracks['items'][i].href);
            console.log(data.tracks['items'][i].album.name);
          }
        }
      });
    }
    break;
  case "movie-this":
    if (process.argv.length > 3) {
      let movie = process.argv[3];
      for (let i = 4; i < process.argv.length; i++) {
        movie += ` ${process.argv[i]}`
      }
      axios.get(`https://www.omdbapi.com/?t=${movie}&apikey=${keys.movies.id}`)
        .then(function (response) {
          console.log(response.data['Title']);
          console.log(response.data['Year']);
          console.log(response.data['imdbRating']);
          console.log(response.data['Ratings'][1]['Value']);
          console.log(response.data['Language']);
          console.log(response.data['Plot']);
          console.log(response.data['Actors']);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios.get(`https://www.omdbapi.com/?t=Mr.+Nobody&apikey=${keys.movies.id}`)
        .then(function (response) {
          console.log(response.data['Title']);
          console.log(response.data['Year']);
          console.log(response.data['imdbRating']);
          console.log(response.data['Ratings'][1]['Value']);
          console.log(response.data['Language']);
          console.log(response.data['Plot']);
          console.log(response.data['Actors']);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    break;
  case "do-what-it-says":
    console.log('do something else');
    break;
  default:
    console.log('please input an option');
    break;
}