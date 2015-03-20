var Path = require('path');
var jade = require('jade');
var db = require('./database.js');

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
                else {
                    reply('Not logged in...').code(401);
                }
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
        path: '/profile',
        config: {
            auth: {mode: 'optional'},
            handler: function (request, reply) {
                if(request.auth.isAuthenticated) {
                    db.getAllPosts(function(err, data){
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
                            blog: blog,

                            posts: data
                        });
                    });
                }
                else {
                    reply.redirect('/login');
                }
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
                    else {
                        reply.view('homepage', {name: "visitor", posts: data});
                    }
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
                db.getAllPosts(function(err2, posts){
                    if (request.auth.isAuthenticated) {

                        var account = request.auth.credentials.profile;
                        var name = account.displayName;
                        var title = request.payload.title;
                        var content = request.payload.content;

                        db.addPost(name, title, content, function(err, data) {
                        
                            if (err) { 
                                console.log(err,'Error: Post not saved.\n',name,title,content);
                            }
                            else {
                                console.log("Saved Succesfully: " + data.author +" - "+ data.title + " - " + data.text);
                            }   
                        }); 
                        

                        return reply.view('homepage', {name: request.auth.credentials.profile.displayName, posts:posts});
                    }
                    else {
                        reply.view('homepage', {name: "visitor", er: "Please login to write a blog post", posts:posts});
                    }
                });
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