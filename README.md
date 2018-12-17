# liri-node-bot

## Table of Contents

- [About](#about)
- [Features](#features)

## About

Liri-node-bot is a command line tool built to give the latest information about concerts, songs, and movies. Through userinput data will be queried through various apis such as Spotify, OMDB, and bandsInTown. 


## Contributing Members

* [Kaleb Kougl](https://github.com/Kaleb-kougl) 

## Features

* Four different queries can take place based on the user input. Songs from spotify, movies from omdb and concerts from bandsintown. 


## Built With
* [BandsInTown API](https://www.bandsintown.com/)
* [Spotify API](https://developer.spotify.com/documentation/web-api/)
* [OMDB API](http://www.omdbapi.com/)
* [Axios](https://www.npmjs.com/package/axios)
* [Moment](https://www.npmjs.com/package/moment)
* [node-spotify-api](https://www.npmjs.com/package/node-spotify-api)
* [dotenv](https://www.npmjs.com/package/dotenv)
* JavaScript/Node

## Installation

1. Clone the repository to your computer. 
1. npm install -> This will get all of the required node packages.
1. From the terminal go inside the directory of the cloned repo.
1. Create a .env file inside of the cloned repo. Inside of .env put 
```
SPOTIFY_ID=<Your key goes here>
SPOTIFY_SECRET=<Your key goes here>  
BANDS_API_KEY=<Your key goes here>
OMDB_API_KEY=<Your key goes here>
```
<img width="1280" alt="keys" src="https://user-images.githubusercontent.com/33531057/49703149-138ef600-fbc7-11e8-8534-f0a8354ec30f.png">

1. From inside the directory of the cloned repo, run the liri.js with node with the argument of the type of search you would like to perform followed by the string to look up.
 ```
 node liri.js <look up type> <band/movie/song>
 ```
  
Look up type can be one of the following: 
```
spotify-this-song 
movie-this 
concert-this
```
  E.g. 
  ```
  node liri.js spotify-this-song thank u, next
  ```
  <img width="1280" alt="concert-this" src="https://user-images.githubusercontent.com/33531057/49703160-36210f00-fbc7-11e8-80d1-51187fb7a7e2.png">
<img width="1280" alt="movie-this" src="https://user-images.githubusercontent.com/33531057/49703161-38836900-fbc7-11e8-85aa-ac39d3bf7e4f.png">
<img width="1280" alt="screen shot 2018-12-09 at 3 31 17 pm" src="https://user-images.githubusercontent.com/33531057/49703188-91530180-fbc7-11e8-8de2-45523a09aaca.png">


## Issues Related To Project



## How To Contribute

Feel free to submit your own issues and PRs for more questions!
