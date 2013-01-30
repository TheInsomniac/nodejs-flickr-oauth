var path = require("path");
var querystring = require("querystring");
var pathLibFlickrApi = "./";

var URL_REQUEST_TOKEN = "http://www.flickr.com/services/oauth/request_token";
var URL_ACCESS_TOKEN = "http://www.flickr.com/services/oauth/access_token";
var URL_AUTHORISE = "http://www.flickr.com/services/oauth/authorize";

var OAuth = require("oauth").OAuth,
	Auth = require("./auth").Auth,
	Request = require("./request").Request;

var FlickrAPI= function FlickrAPI(api_key, shared_secret, auth_token) {
    this._configure(api_key, shared_secret, auth_token);
};

FlickrAPI.prototype._configure= function(api_key, shared_secret, auth_token) { 
    this.api_key= api_key;
	this.oa = new OAuth(	
		URL_REQUEST_TOKEN,
  		URL_ACCESS_TOKEN,
  		api_key,
  		shared_secret,
  		"1.0",
  		null,
  		"HMAC-SHA1"
		);
		
	//NOTE - THE FLICKR API USES THE "GET" HTTP METHOD INSTEAD OF THE MORE COMMON "POST"
	this.oa.setClientOptions({
		requestTokenHttpMethod : "GET",
		accessTokenHttpMethod : "GET"
	});
	
	this._request = new Request(this.oa);
	
	this.auth = new Auth(this._request);
};

//exports.OAuth.prototype.get= function(url, oauth_token, oauth_token_secret, callback) {

FlickrAPI.prototype.getOAuthRequestToken = function(cbUrl, permission, cb){
	var self = this;
	if(typeof cbUrl == "function"){
		cb = cbUrl;
		cbUrl = null;
		permission = null;
	}else if(typeof permission == "function"){
		cb = permission;
		permission = null;
	}
	
	var queryRequest = querystring.stringify({
		oauth_callback : cbUrl
	});
	
	var url = URL_REQUEST_TOKEN + (queryRequest.length ? "?" : "") + queryRequest;
	
	self.oa.get(url, null, null, function(err, data, response){
		var result = data ? querystring.parse(data) : {};
		
		var queryAuth = querystring.stringify({
			oauth_token : result.oauth_token || undefined,
			perms : permission || undefined
		});
		
		result.oauth_authorise_url = URL_AUTHORISE + (queryAuth.length ? "?" : "" ) + queryAuth;
		
		cb(err, result.oauth_token, result.oauth_token_secret, result.oauth_authorise_url, result)
	});
}

FlickrAPI.prototype.getOAuthAccessToken = function(oauth_token,oauth_token_secret,oauth_verifier, cb){
	var self = this;

	var queryAccess = querystring.stringify({
		oauth_token : oauth_token,
		oauth_verifier : oauth_verifier
	});
	
	var url = URL_ACCESS_TOKEN + (queryAccess.length ? "?" : "") + queryAccess;
	
	self.oa.get(url, oauth_token, oauth_token_secret, function(err, data, response){
		var result = data ? querystring.parse(data) : {};
		
		cb(err, result.oauth_token, result.oauth_token_secret, result)
	});
}
    
exports.FlickrAPI = FlickrAPI;
