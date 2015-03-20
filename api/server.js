var Hapi 	= require('hapi');
var server 	= new Hapi.Server();
var Path = require('path');
var githubcreds = require('../githubcreds.json');
var Joi = require('joi');
var Bell = require('bell');
var AuthCookie = require('hapi-auth-cookie');
var routes = require('./routes.js');

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


//Github auth, use your own github application clientId and clientSecret keys
server.register([Bell, AuthCookie], function (err) {
    if (err) {
        console.error(err);
        return process.exit(1);
    }

    var authCookieOptions = {
        password: 'cookie-encryption-password',
        cookie: 'hapiblog-auth',
        isSecure: false
    };
    server.auth.strategy('hapiblog-cookie', 'cookie', authCookieOptions);
    
    var bellAuthOptions = {
        provider: 'github',
        password: 'github-encryption-password',
        clientId: githubcreds.clientId,
        clientSecret: githubcreds.clientSecret,
        isSecure: false
    };
    server.auth.strategy('github-oauth', 'bell', bellAuthOptions);

    server.auth.default('hapiblog-cookie');

    server.route(routes);
});

module.exports = server;