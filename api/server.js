var Hapi 	= require("hapi");
var server 	= new Hapi.Server();
var Joi = require("joi");
var Bell = require("bell");
var Cookie = require("hapi-auth-cookie");
var jade = require("jade");
var Path = require("path");

/* $lab:coverage:off$ */
server.connection({
	host: 'localhost',
	port: process.env.PORT || 8080
});
/* $lab:coverage:on$ */

//Pathing for our jade templates
server.views({
        engines: {
        	jade: require('jade')
        },
        path: Path.join(__dirname, '../views')
    });

//Routes
server.route({
	method: 'GET',
	path: '/',
	handler: function(request, reply) {
		reply.view('homepage', {name: "curious creature"});	
	}
});

server.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {
        	reply('Blog Post here ' + request.params.id);
        }
});

server.route({
    method: 'GET',
    path: '/edit',
    handler: function (request, reply) {
        reply('CMS page');
    }
});

server.route({
    method: 'GET',
    path: '/edit/{id}',
    handler: function (request, reply) {
        reply('CMS page with post: ' + request.params.id + ' loaded for editing');
    }
});

server.route({
    method: 'POST',
    config: { payload: {output: 'data', parse: true} },
    path: '/',
    handler: function (request, reply) {
        // code here to handle new post
        reply('New Post Added');
    }
});

// PUT has a payload too..
server.route({
    method: 'PUT',
    config: { payload: {output: 'data', parse: true} },
    path: '/{id}',
    handler: function (request, reply) {
        // code here to handle post update
        reply('Post ' + request.params.id + ' updated');
    }
});

server.route({
    method: 'DELETE',
    path: '/{id}',
    handler: function (request, reply) {
        // code here to delete post
        reply('Post ' + request.params.id + ' deleted');
    }
});


module.exports = server;