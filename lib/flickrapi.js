var path = require("path");
var querystring = require("querystring");

var URL_REQUEST_TOKEN = "http://www.flickr.com/services/oauth/request_token";
var URL_ACCESS_TOKEN = "http://www.flickr.com/services/oauth/access_token";
var URL_AUTHORISE = "http://www.flickr.com/services/oauth/authorize";
var URL_REST_SERVICE = "http://www.flickr.com/services/rest";

var OAuth = require("oauth").OAuth,
    Request= require("./request").Request,
    Blogs= require("./blogs").Blogs,
    People= require("./people").People,
    Photos= require("./photos").Photos,
    Photosets= require("./photosets").Photosets,
    Contacts= require("./contacts").Contacts,
    Feeds= require("./feeds").Feeds,
    Collections= require("./collections").Collections,
    Urls= require("./urls").Urls;

var FlickrAPI= function FlickrAPI(api_key, shared_secret, auth_token, auth_token_secret) {
    this._configure(api_key, shared_secret, auth_token, auth_token_secret);
};

FlickrAPI.prototype._configure= function(api_key, shared_secret, auth_token, auth_token_secret) {
    this.api_key= api_key;
	this.shared_secret= shared_secret;

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
	/*this.oa.setClientOptions({
		requestTokenHttpMethod : "GET",
		accessTokenHttpMethod : "GET"
	});*/

    this._request = new Request(api_key, URL_REST_SERVICE, this.oa);
    this._request.setAuthenticationToken(auth_token, auth_token_secret);

    this.people= new People(this._request);
    this.photos= new Photos(this._request);
    this.photosets= new Photosets(this._request);
    this.blogs= new Blogs(this._request);
    this.contacts= new Contacts(this._request);
    this.collections= new Collections(this._request);
    this.urls= new Urls(this._request);
};

FlickrAPI.prototype.authenticate = function(auth_token,auth_token_secret){
	return new FlickrAPI(this.api_key, this.shared_secret, auth_token,auth_token_secret);
}

FlickrAPI.prototype.setAuthenticationToken= function(auth_token,auth_token_secret) {
   this._request.setAuthenticationToken(auth_token,auth_token_secret);
};

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
