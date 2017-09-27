/*

node commands to process

my-tweets
	node liri.js my-tweets
	This will show your last 20 tweets and when they were created at in your terminal/bash window.
spotify-this-song
	node liri.js spotify-this-song '<song name here>'
	This will show the following information about the song in your terminal/bash window
	Artist(s)
	The song's name'
	A preview link of the song from Spotify
	The album that the song is from
	If no song is provided then your program will default to "The Sign" by Ace of Base.
	You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.
movie-this
	node liri.js movie-this '<movie name here>'




This will output the following information to your terminal/bash window:

   * Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.
	If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.''
	If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/'
	It's on Netflix!'
	You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use 40e9cece.'

do-what-it-says
	node liri.js do-what-it-says
	Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
	It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
	Feel free to change the text in that document to test out the feature for other commands.

	BONUS
	In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
	Make sure you append each command you run to the log.txt file. 
	Do not overwrite your file each time you run a command.

*/

//Grab data from keys.js
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');

var tclient = new twitter(keys.twitterKeys);
//var sclient = spotify(keys.spotify);
var fs = require('fs');

var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id:"c55a56f104d04c8d99fd3c795c126517",
  secret: "bd7ca29d4b24449fbfaf8c77c0943886"
});

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var query= "";
//attach multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
   query=query+ "+" + nodeArgv[i];
  } else{
   query=query+ nodeArgv[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    		showTweets();
 			break;
  case "spotify-this-song":
		    if(query){
		      spotifySong(query);
		    } else{
		      spotifySong("The Sign by Ace of Base");
		    }
		   break;
  case "movie-this":
		    if(query){
		      omdbData(query)
		    } else{
		      omdbData("Mr. Nobody")
		    }
		   break;
  case "do-what-it-says":
		    doThing();
		 	break;
  default:
    console.log("Please enter one of the following  command:  ");
    console.log("{my-tweets; spotify-this-song; movie-thi;, do-what-it-says}");
  break;
}

function showTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name: 'Mcfarlanev'};
  tclient.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@vblmcfarlane: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
        //adds text to log.txt file
        fs.appendFile('log.txt', "@vblmcfarlane: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        fs.appendFile('log.txt', "-----------------------");
      }
    }else{
      console.log('Error occurred');
    }
  });
}

function spotifySong(song){
spotify
		  .search({ type: 'track', query: song })
		  .then(function(data) {
			   console.log("Data objects = " + data);
			    for(var i = 0; i < data.tracks.items.length; i++){
			        var songData = data.tracks.items[i];
			        //artist
			        console.log(" Artist: " + songData.artists[0].name);
			        //song name
			        console.log(" Song: " + songData.name);
			        //spotify preview link
			        console.log(" Preview URL: " + songData.preview_url);
			        //album name
			        console.log(" Album: " + songData.album.name);
			        console.log("-----------------------");
			        
			        //adds text to log.txt
			        fs.appendFile('log.txt', songData.artists[0].name, (err) => {
  					if (err) throw err;});
			        fs.appendFile('log.txt', songData.name, (err) => {
  					if (err) throw err;});
			        fs.appendFile('log.txt', songData.preview_url, (err) => {
  					if (err) throw err;});
			        fs.appendFile('log.txt', songData.album.name, (err) => {
  					if (err) throw err;});
			        fs.appendFile('log.txt', "-----------------------", (err) => {
  					if (err) throw err;});
			      }
		  })
		  .catch(function(error) {
		   console.log("error = " + error);
		  });
  	//=========================================================================
    // if(!error){
    //   for(var i = 0; i < data.tracks.items.length; i++){
    //     var songData = data.tracks.items[i];
    //     //artist
    //     console.log("Artist: " + songData.artists[0].name);
    //     //song name
    //     console.log("Song: " + songData.name);
    //     //spotify preview link
    //     console.log("Preview URL: " + songData.preview_url);
    //     //album name
    //     console.log("Album: " + songData.album.name);
    //     console.log("-----------------------");
        
    //     //adds text to log.txt
    //     fs.appendFile('log.txt', songData.artists[0].name);
    //     fs.appendFile('log.txt', songData.name);
    //     fs.appendFile('log.txt', songData.preview_url);
    //     fs.appendFile('log.txt', songData.album.name);
    //     fs.appendFile('log.txt', "-----------------------");
    //   }
    // } else{
    //   console.log('Error occurred.');
    // }
  // });
}

function omdbData(movie){
 // var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true';
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

  request(queryUrl, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

      //adds text to log.txt
      fs.appendFile('log.txt', "Title: " + body.Title);
      fs.appendFile('log.txt', "Release Year: " + body.Year);
      fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
      fs.appendFile('log.txt', "Country: " + body.Country);
      fs.appendFile('log.txt', "Language: " + body.Language);
      fs.appendFile('log.txt', "Plot: " + body.Plot);
      fs.appendFile('log.txt', "Actors: " + body.Actors);
      fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
      fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL);

    } else{
      console.log('movie not found')
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

      //adds text to log.txt
      fs.appendFile('log.txt', "-----------------------");
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('log.txt', "It's on Netflix!");
    }
  });

}

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}

		


 