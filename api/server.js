var Hapi    = require('hapi');
var server  = new Hapi.Server();
var Path = require('path');
var githubcreds = require('../githubcreds.json');

var Joi = require('joi');
var Bell = require('bell');
var AuthCookie = require('hapi-auth-cookie');

var jade = require('jade');

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

//ROUTING
    server.route([

        {
            method: 'GET',
            path: '/login',
            config: {
                auth: 'github-oauth',
                handler: function (request, reply) {
                    if (true) {
                        request.auth.session.clear();
                        request.auth.session.set(request.auth.credentials);
                        return reply.redirect('/');
                    }
                    reply('Not logged in...').code(401);    
                }
            }
        },

        {
            method: 'GET',
            path: '/account',
            config: {
                auth: {mode: 'optional'},
                handler: function (request, reply) {

                    if(request.auth.isAuthenticated) {
                        var account = request.auth.credentials.profile;
                        var name = account.displayName;
                        var email = account.email;
                        var avatar = account.raw.avatar_url;
                        var link = account.raw.html_url;
                        var followers = account.raw.followers;
                        var following = account.raw.following;
                        
                        return reply.view('profile', {
                            name: name,
                            email: email,
                            avatar: avatar,
                            link: link,
                            followers: followers,
                            following: following
                        });
                    }
                    reply.redirect('/login');
                }
            }
        },

        {
            method: 'GET',
            path: '/',
            config: {
                auth: {mode: 'optional'},
                handler: function (request, reply) {
                    if (request.auth.isAuthenticated) {
                        return reply.view('homepage', {name: request.auth.credentials.profile.displayName});
                    }
                    reply.view('homepage', {name: "visitor"});
                }
            }
        },

        {
            method: 'GET',
            path: '/logout',
            config: {
                auth: false,
                handler: function (request, reply) {
                    request.auth.session.clear();
                    reply.redirect('/');
                }
            }
        },

        {
            method: 'GET',
            path: '/jade',
            config: {
                auth: {mode: 'optional'},
                handler: function(request, reply) {
                     if (request.auth.isAuthenticated) {
                        return reply.view('homepage', {name: request.auth.credentials.profile.displayName});
                    }
                    reply.view('homepage', {name: "Batman"});
                }
            }
        },

        {
            method: 'GET',
            path: '/blog/{id}',
            config: {
                auth: {mode: 'optional'},
                handler: function (request, reply) {
                        reply('Your blog post should have an id of: ' + request.params.id);
                }
            }
        },

        {
            method: 'GET',
            path: '/edit',
            config: {
                auth: {mode: 'optional'},
                handler: function(request, reply) {
                    reply.view('edit');
                }
            }
        },

        {
            method: 'GET',
            path: '/edit/{id}',
            config: {
                auth: {mode: 'optional'},
                handler: function(request, reply) {
                    reply('Your blog post should have an id of: ' + request.params.id);
                }
            }
        }

//routes not using
        // {
        //     method: 'GET',
        //     path: '/edit/{id}',
        //     handler: function (request, reply) {
        //         reply('CMS page with post: ' + request.params.id + ' loaded for editing');
        //     }
        // },

        // {
        //     method: 'POST',
        //     config: { payload: {output: 'data', parse: true} },
        //     path: '/',
        //     handler: function (request, reply) {
        //         // code here to handle new post
        //         reply('New Post Added');
        //     }
        // },

        // {
        //     method: 'PUT',
        //     config: { payload: {output: 'data', parse: true} },
        //     path: '//blog/{id}',
        //     handler: function (request, reply) {
        //         // code here to handle post update
        //         reply('Post ' + request.params.id + ' updated');
        //     }
        // },

        // {
        //     method: 'DELETE',
        //     path: '//blog/{id}',
        //     handler: function (request, reply) {
        //         // code here to delete post
        //         reply('Post ' + request.params.id + ' deleted');
        //     }
        // }

    ]);
});

module.exports = server;