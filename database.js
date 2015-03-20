//Works on it's own
// node database.js

var mongojs = require("mongojs");
var creds = require("./creds.json");
var db = mongojs(creds.dbname + ":" + creds.dbpwd + creds.dburl, ['users']);

// Use this for local database
// var db = mongojs("mylocaldatabase", ['users']);

function user(author, title, text) {
	this.author = author;	
	this.title = title;
	this.text = text;
}

//adds this mock data into our remote database
var user1 = new user("Jason", "My title", "Whats up");

db.users.save(user1, function(err, savedUser) {
	if(err || !savedUser) console.log("Error: User " + user.author + " not saved." + err);
	else console.log("User " + savedUser.author + " has been saved successfully.");
});

db.users.find(user1, function(err, users) {
	if( err || !users.length) console.log("User " + user.name + " not found.");
		else users.forEach(function(user) {
			console.log("User Found! - " + user.text	);
		});
});