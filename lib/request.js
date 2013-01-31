var querystring = require("querystring");

var Request = function(api_key, urlRest, oauth){
	this.api_key = api_key;
	this._oauth = oauth;
	this._urlRest = urlRest;
	this.setAuthenticationToken(null, null);
}

Request.prototype.setAuthenticationToken = function(oauth_token, oauth_token_secret){
	this._oauth_token = oauth_token;
	this._oauth_token_secret = oauth_token_secret;
}

Request.prototype.executeRequest= function(method, arguments, sign_it, result_mapper, cb) {
    var argumentString = "";
    var api_sig= undefined;
    if( arguments === undefined )  arguments = {};

    // apply default arguments 
    arguments.format= "json";
    //arguments.nojsoncallback= "1";

    arguments.api_key= this.api_key;
    arguments["method"]= method;

	//deal with the access tokens
	var oauth_token = this._oauth_token || null;
	var oauth_token_secret = this._oauth_token_secret || null;
   
    var argumentString = querystring.stringify(arguments);

	var url = this._urlRest + (argumentString.length ? "?" + argumentString : "");

	console.log(url, oauth_token, oauth_token_secret);
	
	this._oauth.get(url, oauth_token, oauth_token_secret, function(err, data, response){
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
		}
		
		cb(err, data, response);
	});
};

exports.Request = Request;