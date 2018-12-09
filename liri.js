require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
const fs = require('fs');

var Spotify = new Spotify(keys.spotify);
const BANDS_URL = "https://rest.bandsintown.com/artists/";

var choice = process.argv[2];

function search(userChoice=choice, searchParam=undefined) {
  let choice;
  switch (userChoice) {
    case "concert-this":
      if (process.argv.length > 3 || searchParam != undefined) {
        if (searchParam === undefined) {
          choice = process.argv[3];
          for (let i = 4; i < process.argv.length; i++) {
            choice += ` ${process.argv[i]}`
          }
        } else {
          choice = searchParam;
        }
        axios.get(`${BANDS_URL}${choice}/events?app_id=${keys.bands.id}`)
        .then(function (response) {
          // if band not in api
          if (response.data.errorMessage !== undefined) {
            console.log(response.data.errorMessage);
          } else {
            for (let i = 0; i < response.data.length; i++) {
              let date = moment(response.data[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY")              
              console.log(`${response.data[i].venue.name} - ${response.data[i].venue.city}, ${response.data[i].venue.country} - ${date}\n`)
            }
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
      if (process.argv.length > 3 || searchParam != undefined) {
        if (searchParam === undefined) {
          choice = process.argv[3];
          for (let i = 4; i < process.argv.length; i++) {
            choice += ` ${process.argv[i]}`
          }
        } else {
          choice = searchParam;
        }
        console.log(`56 ${choice}`);
        Spotify.search({ type: 'track', query: choice }, function(err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          for (let i = 0; i < data.tracks['items'].length; i++) {
            if (data.tracks['items'][i].name === choice) {
              let printThis = data.tracks['items'][i];
              console.log(`\nSong: ${printThis.artists[0].name}\nArtist: ${printThis.name}\nAlbum: ${printThis.album.name}\n${printThis.external_urls.spotify}\n`);
            }
          }
        });
      } else {
        choice = "The Sign";
        Spotify.search({ type: 'track', query: choice }, function(err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          for (let i = 0; i < data.tracks['items'].length; i++) {
            if (data.tracks['items'][i].name === 'The Sign') {
              let printThis = data.tracks['items'][i];
              console.log(`\nSong: ${printThis.artists[0].name}\nArtist: ${printThis.name}\nAlbum: ${printThis.album.name}\n${printThis.external_urls.spotify}\n`);
            }
          }
        });
      }
      break;
    case "movie-this":
      if (process.argv.length > 3 || searchParam != undefined) {
        if (searchParam === undefined) {        
          choice = process.argv[3];
          for (let i = 4; i < process.argv.length; i++) {
            choice += ` ${process.argv[i]}`
          }
        } else {
          choice = searchParam
        }
          
        axios.get(`https://www.omdbapi.com/?t=${choice}&apikey=${keys.movies.id}`)
          .then(function (response) {
            console.log(`\nTitle: ${response.data['Title']}`);
            console.log(`Released: ${response.data['Year']}`);
            console.log(`IMDB Rating: ${response.data['imdbRating']}`);
            console.log(`Rotton Tamatoes Rating: ${response.data['Ratings'][1]['Value']}`);
            console.log(`Language: ${response.data['Language']}`);
            console.log(`Plot: ${response.data['Plot']}`);
            console.log(`Actors: ${response.data['Actors']}\n`);
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        axios.get(`https://www.omdbapi.com/?t=Mr.+Nobody&apikey=${keys.movies.id}`)
          .then(function (response) {
            console.log(`\nTitle: ${response.data['Title']}`);
            console.log(`Released: ${response.data['Year']}`);
            console.log(`IMDB Rating: ${response.data['imdbRating']}`);
            console.log(`Rotton Tamatoes Rating: ${response.data['Ratings'][1]['Value']}`);
            console.log(`Language: ${response.data['Language']}`);
            console.log(`Plot: ${response.data['Plot']}`);
            console.log(`Actors: ${response.data['Actors']}\n`);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      break;
    case "do-what-it-says":
      console.log('do something else');
      
      fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
        var dataArr = data.split(",");
        switch(dataArr[0]){
          case('concert-this'):
            search('concert-this', dataArr[1]);
            break;
          case('spotify-this-song'):
            search('spotify-this-song', dataArr[1]);
            break;
          case('movie-this'):
            search('movie-this', dataArr[1]);
            break;
          default:
            console.log
            ('Something wrong with file. Please use proper csv.spotify-this-song,"I Want it That Way"');
        }
      });

      break;
    default:
      console.log('please input an option');
      break;
  }
}
search(choice);