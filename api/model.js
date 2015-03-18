var Hapi = require("hapi");
var Boom = require("boom");
 
var dbOpts = {
    "url": "mongodb://localhost:27017/test",
    "settings": {
        "db": {
            "native_parser": false
        }
    }
};
 
var server = new Hapi.Server();
 
server.register({
    register: require('hapi-mongodb'),
    options: dbOpts
}, function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
});
 
server.route( {
    "method"  : "GET",
    "path"    : "/{id}",
    "handler" : usersHandler
});
 
function usersHandler(request, reply) {
    var db = request.server.plugins['hapi-mongodb'].db;
    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
 
    db.collection('users').findOne({  "_id" : new ObjectID(request.params.id) }, function(err, result) {
        if (err) return reply(Boom.internal('Internal MongoDB error', err));
        reply(result);
    });
}
 
server.start(function() {
    console.log("Server started at " + server.info.uri);
});


