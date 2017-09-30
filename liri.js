// DU Boot Camp Liri assignment week 10
// Vondy McFarlane

var request = require('request');
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
//arrign variables to argument's array elements
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

runCommand();
//=====================================function run Command==========================================
function runCommand() { 
	//switch case
	switch(command){
	  case "my-tweets":
	    		myTweets();
	 			break;
	  case "spotify-this-song":
			    if(query){
			      spotifySong(query);
			    } else{
			      query = "The Sign by Ace of Base";
			      spotifySong(query);
			    }
			   break;
	  case "movie-this":
			    if(query){
			      omdbData(query)
			    } else{
			      query = "Mr. Nobody";
			      omdbData(query)
			    }
			   break;
	  case "do-what-it-says":
			    echoQuery();
			 	break;
	  default:
	    console.log("Please enter one of the following  command:  ");
	    console.log("{my-tweets; spotify-this-song; movie-this; do-what-it-says}");
	  break;
	}
}//end of function runCommand
//=====================================function myTweets==========================================
function myTweets(){
// Get twitterKeys from keys.js
var keys = require("./keys")
var tClient = new Twitter(keys.twitterKeys);

		var tweetsLength = 0;
		var params = {screen_name: 'vblmcfarlane'};
		tClient
			.get('statuses/user_timeline', params, function(error, tweets, response) {
 				console.log("Tweets = " + JSON.stringify(tweets, null, 2));
				 if (!error) {
					 tweetsLength = tweets.length;
					 if (tweetsLength > 20){
						tweetsLength = 20;
						}		
				      if(!error && response.statusCode == 200){
					      for(var i = 0; i<tweetsLength; i++){
					        var date = tweets[i].created_at;
					        console.log("@vblmcfarlane: " + tweets[i].text + " Created At: " + date.substring(0, 19));
					        console.log("-----------------------");
					        
					        //adds text to log.txt file
					        fs.appendFile('log.txt', "@vblmcfarlane: " + tweets[i].text + " Created At: " + date.substring(0, 19), 
					        													(err) => {if (err) throw err;});
					        fs.appendFile('log.txt', "-----------------------", (err) => {if (err) throw err;});
					      } // end for loop
				   	 }else{
				      		console.log('Error occurred - tweet not found');
				    	  }
				} else {
				    	console.log("Error = " + JSON.stringify(error), null, 2);
				  	   throw error;callbacks
				       }
			
			
			});//end .get
} // end function myTweets
//=====================================spotifySong=================================================
function spotifySong(song){
	var skeys = require("./keys")
	var spotify = new Spotify(skeys.spotifyKeys);	
//	console.log("sClient =  " + JSON.stringify( spotify, null, 2));
spotify
		  .search({ type: 'track', query: song })
		  .then(function(data) {
			   console.log("Data objects = " + JSON.stringify(data, null, 2));
			    for(var i = 0; i < data.tracks.items.length; i++){
			        var songData = data.tracks.items[i];
			        console.log("-------------------------------------------------------------------------------");
			        //artist
			        console.log(" Artist: " + songData.artists[0].name);
			        //song name
			        console.log(" Song: " + songData.name);
			        //spotify preview link
			        console.log(" Preview URL: " + songData.preview_url);
			        //album name
			        console.log(" Album: " + songData.album.name);
			       console.log(" ");
			        
			        //adds text to log.txt, included err to handle fs callbacks
			        fs.appendFile('log.txt', "------------------------------------------------------------------", 														(err) => {if (err) throw err;});
			        fs.appendFile('log.txt', songData.artists[0].name, 	(err) => {if (err) throw err;});
			        fs.appendFile('log.txt', songData.name, 			(err) => {if (err) throw err;});
			        fs.appendFile('log.txt', songData.preview_url, 		(err) => {if (err) throw err;});
			        fs.appendFile('log.txt', songData.album.name, 		(err) => {if (err) throw err;});
			        fs.appendFile('log.txt', " ", 						(err) => {if (err) throw err;});
			      }
		  }) //end of .then
		  .catch(function(error) {
		   console.log("error = " + JSON.spotify(error, null, 2));
		  }); //end of .catch
} //end of function spotifySong
//====================================function omdData==============================================
function omdbData(movie){
 
  var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&tomatoes=true&apikey=40e9cece";
  request(queryUrl, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);
      console.log("-------------------------------------------------------------------------------");
      console.log(" ");

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("-------------------------------------------------------------------------------");
      console.log(" ");
     //write text to log.txt, include err condition to handle (fs) call back depreciation
      fs.appendFile('log.txt', "------------------------------------------------------------------", 																						  (err) => {if (err) throw err;});
      fs.appendFile('log.txt', "Title: " + body.Title, 							(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "Release Year: " + body.Year, 					(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating, 				(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating, 	(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL, 		(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "Country: " + body.Country, 						(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "Language: " + body.Language, 					(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "Plot: " + body.Plot, 							(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "Actors: " + body.Actors, 						(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "------------------------------------------------------------------", 																						  (err) => {if (err) throw err;});
    } else{
      console.log('movie query : ' + query + 'not found')
    }
    if(movie === "Mr. Nobody") {
      // console.log("-------------------------------------------------------------------------------")
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("");
      console.log("It's on Netflix!");
      console.log("-------------------------------------------------------------------------------")
      //adds text to log.txt
      fs.appendFile('log.txt', "------------------------------------------------------------------", 																						  (err) => {if (err) throw err;});
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/", 
      														(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "It's on Netflix!", 			(err) => {if (err) throw err;});
      fs.appendFile('log.txt', "------------------------------------------------------------------", 																						  (err) => {if (err) throw err;});
    }
  });
} //end of function omdbData
//=====================================echoQuery==========================================
function echoQuery(){
  fs.readFile('random.txt', "utf8", function(error, data){

  	if (error) {
            console.log(error);
    } else {
        var dataArr = data.split(',');
            if (dataArr[0] === 'spotify-this-song') {
                spotifySong(dataArr[1]);
            } else if (dataArr[0] === 'movie-this') {
                omdbData(dataArr[1]);
            } else if (dataArr(0)=== 'my-tweets') {
            	myTweets();
            }

    } //end of id(error)

    // var txt = data.split(',');
    // spotifySong(txt[1]);

   });  
}
