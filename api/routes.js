var Path = require('path');
var jade = require('jade');
var db = require('./database.js');
var Joi = require('joi');

module.exports = [

        {
            method: 'GET',
            path: '/public/css/{filename}',
            config: {auth: {mode: 'optional'} },
            handler: function(request, reply) {
                reply.file(__dirname + "/../public/css/" + request.params.filename);
            }
        },

        {
            method: 'GET',
            path: '/public/lib/{filename}',
            config: {auth: {mode: 'optional'} },
            handler: function(request, reply) {
                reply.file(__dirname + "/../public/lib/" + request.params.filename);
            }
        },

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
            path: '/logout',
            config: {
                // auth: false,
                handler: function (request, reply) {
                    request.auth.session.clear();
                    reply.redirect('/');
                }
            }
        },

        {
            method: 'GET',
            path: '/profile',
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

                        var blog = "blog should go here";

                        return reply.view('profile', {
                            name: name,
                            email: email,
                            avatar: avatar,
                            link: link,
                            followers: followers,
                            following: following,
                            blog: blog
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
                    db.getAllPosts(function(err, data){
                        if (request.auth.isAuthenticated) {
                            return reply.view('homepage', {name: request.auth.credentials.profile.displayName, posts: data});
                        }
                        reply.view('homepage', {name: "visitor"});
                    });
                }
            }
        },

        {
            method: 'POST',
            path: '/',
            config: {
                auth: {mode: 'optional'},
                handler: function (request, reply) {
                    var schema = Joi.object().options({ abortEarly: false }).keys({
                        title: Joi.string().min(3).max(50),
                        content: Joi.string().max(5000)
                    });



                    if (request.auth.isAuthenticated) {

                        var account = request.auth.credentials.profile;
                        var name = account.displayName;

                        var postData = {
                            title : request.payload.title,
                            content : request.payload.content
                            };

                        Joi.validate(postData, schema, function (err, value) { });

                    

                        db.addPost(name, postData.title, postData.content, function(err, data) {
                            if (err) { 
                                console.log(err,'Error: Post not saved.\n',name, postData.title, postData.content);
                            }
                            else {
                                console.log("Saved Succesfully: " + data.author +" - "+ data.title + " - " + data.text);
                            }    
                        });

                        return reply.view('homepage', {name: request.auth.credentials.profile.displayName});
                    }

                    else {
                    reply.view('homepage', {name: "visitor", er: "Please login to write a blog post"});
                    }
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
            path: '/allposts',
            config: {
                auth: {mode: 'optional'},
                handler: function (request, reply) {
                    db.getAllPosts(function(err, data){
                        reply.view('allposts', {posts: data} );
                    });
                }
            }
        },
    ];