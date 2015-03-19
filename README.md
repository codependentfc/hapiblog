#hapiblog

Our objective for our 8th week here at Founders & Coders is to create a blog using the framework Hapi.js.

------

###Getting Started

Why not give our blog a go yourself? First thing's first:

* Clone our repo using ```git clone https://github.com/codependentfc/hapiblog.git```

* In order to install all of the dependencies, run ```npm install```

* To get ```localhost:8080``` running in your browser, enter ```node app``` into your terminal.

...and voilà!

It **should** be up and running

Let us know if you have any issues or comments

------

###Version update
* Requires github user authentication to write a post
* Saves post into remote database
* Views using jade and bootstrap
* CSS now works

TODO as of 19/03/15: 
* Display all posts
* Access individual posts
* Modularise our code
* Joi validation
* Github authentication - removing session cookie fully
* Design
* Edit/Delete posts,
* Other cool stuff :)
=======

TODO as of 19/03/15: 
* Display all posts
* Access individual posts
* Design
** Edit/Delete posts,
** Other cool stuff :)

------

###Tests
Ensure you have lab or gulp installed globally, then use ```npm test``` or ```gulp```, respectively.

------

###Other notes
If you want to store away your credentials, create a file called: creds.json and follow this format:

```
{
	"dbname": "<your db user name>",
	"dbpwd": "<your db user password>"
	"dburl": "<your db access url>"
}

{
	"clientId": "<your github app clientId>",
	"clientSecret": "<your github app clientSecret key>"
}

```
------
