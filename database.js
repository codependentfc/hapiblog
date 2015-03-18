var mongojs = require("mongojs");
var creds = require("./creds.json");
var db = mongojs(creds.dbname + ":" + creds.dbpwd + creds.dburl, ['users']);

function user(author, title, text) {
	this.author = author;	
	this.title = title;
	this.text = text;
}

var user1 = new user("Jason", "My title", "Whats up");

db.users.save(user1, function(err, savedUser) {
	if(err || !savedUser) console.log("User " + user.author + " not saved because of error" + err);
	else console.log("User " + savedUser.author + " saved");
});

db.users.find(user1, function(err, users) {
	if( err || !users.length) console.log("User " + user.name + " not found.")
		else users.forEach(function(user) {
			console.log("User Found! - " + user);
		});
});	