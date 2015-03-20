
var mongojs = require("mongojs");
var creds = require("./creds.json");
var db = mongojs(creds.dbname + ":" + creds.dbpwd + creds.dburl, ['users']);

// Use this for local database
// var db = mongojs("mylocaldatabase", ['users']);

function post(author, title, text) {
	this.author = author;	
	this.title = title;
	this.text = text;
}

function addPost(author, title, content, callback) {
	var newPost = new post(author, title, content);
	db.users.save(newPost, function (err,data){
		if (err) {
			return callback(err, null);
		}
		else {
			console.log('Saved: ',data);
			return callback(null, data);
		}
	});
}

// TODO find by object id
function getPost(id,callback) {
	
	db.users.find(null, function(err, data){
		if (err) {
			return callback(err, null);
		}
		else {
			return callback(null, data);
		}
	});
}

function getAllPosts(callback) {
	db.users.find(function(err, data){
		if (err) {
			return callback(err, null);
		}
		else {
			console.log(data);
			return callback(null, data);
		}
	});
}

module.exports = {
	addPost: addPost,
	getPost: getPost,
	getAllPosts: getAllPosts
};