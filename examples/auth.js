var util = require('util');
var querystring = require('querystring');

var FlickrAPI= require('./../index').FlickrAPI;
var API_KEY="40edfea51a1c7b5efef05dae3ba3aee4";
var API_SECRET= "5fa3cd3cf48f8678";

var flickr = new FlickrAPI(API_KEY, API_SECRET);

//getRequestToken();
//getAccessToken("72157632651979773-0f204fb1fbb9605c", "4c0c1953d78de7c0", "dd7690d65e3c6377");
getUserPhotos("72157632653130364-f6fbeca8235f7a44", "29ded7091966b288", "66296360@N05");

function getRequestToken(){
	flickr.getOAuthRequestToken("http://localhost:4010/auth/complete",function(error, oauth_token, oauth_token_secret, oauth_authorise_url, results){
	  if(error) util.puts('error :' + error)
	  else { 
	    console.log(oauth_token, oauth_token_secret);
		console.log(oauth_authorise_url);
		//we can now store this for later - ater the user has authenticated using the oauth_authorise_url
	  }
	});
}

function getAccessToken(oauth_token, oauth_token_secret, oauth_verifier){
	//USING THE oauth_token from 'getOauthRequestToken' and the oauth_verifier for the callback_url we authenticate to obtain the access_codes
	flickr.getOAuthAccessToken(oauth_token,oauth_token_secret,oauth_verifier,function(error, oauth_token, oauth_token_secret, results){
	  if(error) util.puts('error :' + util.inspect(error))
	  else { 
	    console.log(oauth_token, oauth_token_secret);
		console.log(util.inspect(results));
		//we can now store this for later - ater the user has authenticated using the oauth_authorise_url
	  }
	});
}

function getUserPhotos(auth_token,auth_token_secret,userId){
	var auth_user = { fullname: 'James Bailey',
	  oauth_token: '72157632653130364-f6fbeca8235f7a44',
	  oauth_token_secret: '29ded7091966b288',
	  user_nsid: '66296360@N05',
	  username: 'jimibailey' }

	var filter = {
		api_key : API_KEY,
		user_id : auth_user.user_nsid,
		format : "json",
		method : "flickr.people.getPhotos"
	}
	
	flickr.setAuthenticationToken(auth_token, auth_token_secret);
	flickr.people.getPhotos(userId, function(err, data){
		console.log(err);
		console.log(data);
	});
}

function getUserPhotosOld(auth_token,auth_token_secret,userId){
	//http://www.flickr.com/services/rest?api_key=40edfea51a1c7b5efef05dae3ba3aee4&user_id=66296360%40N05&format=json&method=flickr.people.getPhotos
	//http://www.flickr.com/services/rest?user_id=66296360%40N05&format=json&api_key=40edfea51a1c7b5efef05dae3ba3aee4&method=flickr.people.getPhotos
	
	var filter = {
		api_key : API_KEY,
		user_id : userId,
		format : "json",
		method : "flickr.people.getPhotos"
	}
	
	var url = "http://www.flickr.com/services/rest?"+querystring.stringify(filter);
	console.log(url);
	
	flickr.oa.get(url, auth_token, auth_token_secret, function(err, data, response){
		if(err){
			console.log(err);
		}else{
			var indexStart = data.indexOf("{"), indexEnd = data.lastIndexOf("}");
			data = data.substring(indexStart, indexEnd + 1);

			try{
				data = JSON.parse(data);
			}catch(err){
				console.log("Error parsing result - expected JSON format");
			}

			console.log(util.inspect(data.photos.photo));
		}
	});
}



