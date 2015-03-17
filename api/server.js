var Hapi 	= require("hapi");
var server 	= new Hapi.Server();
var Joi = require("joi");
var Bell = require("bell");
var Cookie = require("hapi-auth-cookie");

/* $lab:coverage:off$ */
server.connection({
	host: 'localhost',
	port: process.env.PORT || 8080
});
/* $lab:coverage:on$ */

server.route({
	method: 'GET',
	path: '/',
	config: {
		handler: function(request, reply) {
			reply("Welcome to the homepage");
		}
	}
});

server.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {
        	reply('Blog Post here, id: ' + request.params.id);
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