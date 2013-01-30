var util = require('util');
var querystring = require('querystring');

var FlickrAPI= require('./../index').FlickrAPI;
var API_KEY="40edfea51a1c7b5efef05dae3ba3aee4";
var API_SECRET= "5fa3cd3cf48f8678";

var flickr = new FlickrAPI(API_KEY, API_SECRET);

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

function getAccessToken(){
	//USING THE oauth_token from 'getOauthRequestToken' and the oauth_verifier for the callback_url we authenticate to obtain the access_codes
	var oauth_token = "72157632653135276-d1a5a0985d236682";
	var oauth_token_secret = "17dd2476e672334a";
	var oauth_verifier = "6873f69b1cf2ae0d";

	flickr.getOAuthAccessToken(oauth_token,oauth_token_secret,oauth_verifier,function(error, oauth_token, oauth_token_secret, results){
	  if(error) util.puts('error :' + util.inspect(error))
	  else { 
	    console.log(oauth_token, oauth_token_secret);
		console.log(util.inspect(results));
		//we can now store this for later - ater the user has authenticated using the oauth_authorise_url
	  }
	});
}

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

flickr.oa.get("http://www.flickr.com/services/rest?"+querystring.stringify(filter), auth_user.oauth_token, auth_user.oauth_token_secret, function(err, data, response){
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


