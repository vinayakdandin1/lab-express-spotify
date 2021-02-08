require('dotenv').config();


const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('search.hbs')
})

app.get('/artist-search', (req, res, next) => {

    spotifyApi
        .searchArtists(req.query.artistSearch)
        .then(data => {
            let albumsReceived = data.body.artists.items
            
            //console.log('The received data from the API: ', data.body.artists.items[0]);
            res.render('artist-search-results', {albumsReceived})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here

    spotifyApi.getArtistAlbums(req.params.artistId).then(
        function(data) {
          let albumsArray = data.body.items
        //   console.log('Artist albums', data.body);
            //console.log(albumsArray);
          res.render('albums', {albumsArray})
        },
        function(err) {
          console.error(err);
        }
      );
  });

  app.get('/songs/:albumId', (req, res, next) => {
      spotifyApi.getAlbumTracks(req.params.albumId).then(
          function(songs) {
              let somesongs = songs.body.items
              console.log(somesongs);
             res.render('songs', {somesongs} )
        }
      )
  })


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
