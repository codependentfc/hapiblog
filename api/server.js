var Hapi 	= require("hapi");
var server 	= new Hapi.Server();
var Joi = require("joi");
var Bell = require("bell");
var AuthCookie = require("hapi-auth-cookie");
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



// Login
server.route({
    method: 'GET',
    path: '/login',
    handler: function(request, reply) {
        reply("Login"); 
    }
});


// Account
server.route({
    method: 'GET',
    path: '/account',
    handler: function(request, reply) {
        reply("Account"); 
    }
});

// Logout
server.route({
    method: 'GET',
    path: '/logout',
    handler: function(request, reply) {
        reply.redirect("Logout"); 
    }
});





// Creating the Bell-Github Authentification
server.register([Bell, AuthCookie], function (err) {
 
    if (err) {
        console.error(err);
        return process.exit(1);
    }
 
    var authCookieOptions = {
        password: 'cookie-encryption-password', //Password used for encryption
        cookie: 'sitepoint-auth', // Name of cookie to set
        isSecure: false
    };
 
    server.auth.strategy('site-point-cookie', 'cookie', authCookieOptions);
 
    var bellAuthOptions = {
        provider: 'github',
        password: 'github-encryption-password', //Password used for encryption
        clientId: '33306d3354c1afa5f7bc',//'YourAppId',
        clientSecret: 'dc143094d7b0beb886e59daeb0afc852608968eb',//'YourAppSecret',
        isSecure: false
    };
 
    server.auth.strategy('github-oauth', 'bell', bellAuthOptions);
 
    server.auth.default('site-point-cookie');













module.exports = server;








