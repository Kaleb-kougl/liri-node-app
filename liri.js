require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
const fs = require('fs');

var Spotify = new Spotify(keys.spotify);
const BANDS_URL = "https://rest.bandsintown.com/artists/";

var choice = process.argv[2];

// returns all user command line args beyond the file path
function grabCommandLineArgs(argsArr) {
  choice = argsArr[3];
  for (let i = 4; i < argsArr.length; i++) {
    choice += ` ${argsArr[i]}`
  }
  return choice;
}

// returns the data from an API call
async function axiosCall(url) {
  const response = await axios.get(url);
  const data = await response.data;
  return data;
}

// prints data to the terminal 
function printData(type, data) {
  switch(type) {
    case "concert":
      if (data === null) {
        console.log("Please type a band as well, like the command below.\nnode liri.js concert-this <bandName>");
      } else if (data === 'none'){
        console.log('Band not found!')
      } else {
        console.log(`${data.venue} - ${data.city}, ${data.country} - ${data.date}\n`);
      }
      break;
    case "song":
      console.log(`\nSong: ${data.artists[0].name}\nArtist: ${data.name}\nAlbum: ${data.album.name}\n${data.external_urls.spotify}\n`);
      break;
    case "movie":
      if (data === null){
        console.log('Movie not found!');
      }
      else {
        console.log(`\nTitle: ${data.title}\nReleased: ${data.year}\nIMDB Rating: ${data.imdb}\nRotton Tamatoes Rating: ${data.rTom}`);
        console.log(`Language: ${data.lang}\nPlot: ${data.plot}\nActors: ${data.actors}\n`);
      }
      break;
    default:
      console.log('Something went wrong with printData()');
      break;
  }
}

async function spotifyCall(choice, defaultVal='The Sign') {
  Spotify.search({ type: 'track', query: choice }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    for (let i = 0; i < data.tracks['items'].length; i++) {
      if (data.tracks['items'][i].name === choice) {
        let printThis = data.tracks['items'][i];
        printData("song", printThis);
      }
    }
  });
}

async function search(userChoice=choice, searchParam=undefined) {
  let choice;
  switch (userChoice) {
    case "concert-this":
      if (process.argv.length > 3 || searchParam != undefined) {
        if (searchParam === undefined) {
          choice = grabCommandLineArgs(process.argv);
        } else {
          choice = searchParam;
        }
        let data = await axiosCall(`${BANDS_URL}${choice}/events?app_id=${keys.bands.id}`);
        // if band not in api
        if (data.errorMessage !== undefined) {
          console.log(data.errorMessage);
        } else {
          if (data == "{warn=Not found}\n"){
            printData("concert", 'none');
            return;
          }
          for (let i = 0; i < data.length; i++) {
            let date = moment(data[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY")
            printData("concert",
              {
                'venue': data[i].venue.name,
                'city': data[i].venue.city,
                'country': data[i].venue.country,
                'date': date
              }
            );
          }
        }
      } else {
        printData("concert", null);
      }
      break;
    case "spotify-this-song":
      if (process.argv.length > 3 || searchParam != undefined) {
        if (searchParam === undefined) {
          choice = grabCommandLineArgs(process.argv);
        } else {
          choice = searchParam;
        }
        spotifyCall(choice);
      } else {
        spotifyCall("The Sign");
      }
      break;
    case "movie-this":
      if (process.argv.length > 3 || searchParam != undefined) {
        if (searchParam === undefined) {
          choice = grabCommandLineArgs(process.argv);
        } else {
          choice = searchParam
        }
        let data = await axiosCall(`https://www.omdbapi.com/?t=${choice}&apikey=${keys.movies.id}`);
        if (data['Response'] === 'False') {
          printData('movie', null);
        } else {
          printData('movie',
            {
              'title' : data['Title'],
              'year' : data['Year'],
              'imdb' : data['imdbRating'],
              'rTom' : data['Ratings'][1]['Value'],
              'lang' : data['Language'],
              'plot' : data['Plot'],
              'actors' : data['Actors']
            }
          );
        }
      } else {
        axios.get(`https://www.omdbapi.com/?t=Mr.+Nobody&apikey=${keys.movies.id}`)
          .then(function (response) {
            printData('movie',
            {
              'title' : response.data['Title'],
              'year' : response.data['Year'],
              'imdb' : response.data['imdbRating'],
              'rTom' : response.data['Ratings'][1]['Value'],
              'lang' : response.data['Language'],
              'plot' : response.data['Plot'],
              'actors' : response.data['Actors']
            });
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
