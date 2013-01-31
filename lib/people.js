var People= function People(request) {
    this._request= request;
};

People.prototype.findByUsername= function(username, callback){
      this._request.executeRequest("flickr.people.findByUsername",
                                         {"username": username}, false, null, callback);
};

People.prototype.getPhotos= function(user_id, callback){
      this._request.executeRequest("flickr.people.getPhotos",
                                         {"user_id": user_id}, false, null, callback);
};

exports.People= People;
