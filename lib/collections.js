var Collections= function Collections(request) {
    this._request= request;
};

Collections.prototype.getTree= function(user_id, callback) {
    this._request.executeRequest("flickr.collections.getTree", {"user_id": user_id}, false, null, callback);
};

exports.Collections= Collections;