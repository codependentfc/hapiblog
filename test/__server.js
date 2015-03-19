var lab 	= exports.lab = require('lab').script();
var assert 	= require('chai').assert;
var server 	= require('../api/server.js');
//______________________Jason's custom line break________________________//

lab.experiment('Invalid route', function() {

	var options = {
		url: '/fake/link',
		method: 'GET'
	};

	lab.test('Return a 404 status code', function(done) {

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 404, 'it should return da 404');
			done();
		});
	});
});
//_______________________________________________________________________//

lab.experiment('Homepage: ', function() {

	var options_get = {
		url: '/',
		method: 'GET'
	};

	lab.test('The home page should exist', function(done) {

		server.inject(options_get, function(response) {

			assert.equal(response.statusCode, 200, 'it should return a 200 status code');
			assert.equal(typeof response.result, 'string', 'it should reply with a string');
			done();
		});
	});

	var options_post = {
		url: '/',
		method: 'POST'
	};

	lab.test('New post should be added', function(done) {

		server.inject(options_post, function(response) {

			assert.equal(response.statusCode, 200, 'it should return a 200 status code');
			assert.equal(typeof response.result, 'string', 'it should reply with a string');
			assert.equal(response.result, 'New Post Added', 'it should return our string');
			done();
		});
	});
});
//_______________________________________________________________________//

lab.experiment('User profile page: ', function() {

	var options = {
		url: '/account',
		method: 'GET'
	};

	lab.test('User profile should exist only when logged in', function(done) {

		server.inject(options, function(response) {

			assert.equal(response.statusCode, 302, 'it should return a 302 status code');
			done();
		});
	});
});

//_______________________________________________________________________//

lab.experiment('Every blog post page: ', function() {

	var options = {
		url: '/blog/{id}',
		method: 'GET'
	};

	lab.test(' A blog post page should exist', function(done) {

		server.inject(options, function(response) {

			assert.equal(response.statusCode, 200, 'it should return a 200 status code');
			assert.equal(typeof response.result, 'string', 'it should reply with a string');
			assert.equal(response.result, 'Your blog post should have an id of: {id}', 'it should return our string');
			done();
		});
	});
});
//_______________________________________________________________________//

lab.experiment('Edit main page: ', function() {

	var options = {
		url: '/edit',
		method: 'GET'
	};

	lab.test('Edit main page should exist ', function(done) {

		server.inject(options, function(response) {

			assert.equal(response.statusCode, 200, 'it should return a 200 status code');
			assert.equal(typeof response.result, 'string', 'it should reply with a string');
			done();
		});
	});
});
//_______________________________________________________________________//

lab.experiment('Edit blog post page', function() {

	var options = {
		url: '/edit/{id}',
		method: 'GET'
	};

	lab.test('The blog post ready for editing should exist', function(done) {

		server.inject(options, function(response) {

			assert.equal(response.statusCode, 200, 'it should return a 200 status code');
			assert.equal(typeof response.result, 'string', 'it should reply with a string');
			assert.equal(response.result, 'Your blog post should have an id of: {id}', 'it should return our string');
			done();
		});
	});
});
//_______________________________________________________________________//

//Tests TODO
lab.experiment('Posts page: ', function() {

	var options = {
		url: '/posts',
		method: 'GET'
	};

	lab.test('Return an array of objects', function(done) {

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, 'it should return a 200 status code');
			assert.equal(response.result instanceof Array, true, 'it should reply with an array');
			assert.equal(typeof response.result[0].author, 'string', 'author should be a string');
			assert.equal(typeof response.result[0].contents, 'string', 'contents should be a string');
			done();
		});
	});
});
//_______________________________________________________________________//

lab.experiment('Posts page', function() {

	var options = {
		url: '/posts',
		method: 'POST',
		payload: {
			author: 'thezurgx',
			title: 'Anakin goes clubbing again',
			content: 'blahblahblah'
		}
	};

	lab.test('Return valid fields', function(done) {

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 201, 'it should return a 201 CREATED status code');
			assert.deepEqual(response.result, options.payload, 'it should reply with the created post's content');
			done();
		});
	});
});
//_______________________________________________________________________//

lab.experiment('User authentication', function() {

	lab.test('Registering a valid user', function(done) {

	    var options = {
	        method: 'PUT',
	        url: '/users/testuser',
	        payload: {
	            full_name: 'Test User',
	            age: 33,
	            image: 'dhown783hhdwinx.png',
	            password: 'p455w0rd'
	        }
	    };

	    server.inject(options, function(response) {

	        var result = response.result,
	        payload = options.payload;

	        assert.equal(response.statusCode, 201);
	        assert.equal(result.full_name, payload.full_name);
	        assert.equal(result.age, payload.age);
	        assert.equal(result.image, payload.image);
	        assert.equal(result.count, 0);

	        done();
	    });
	});

	lab.test('A failed login attempt', function(done) {

		var badlogin = {
			url: '/login',
			method: 'POST',
			headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
			payload: 'username=zurfyx&pass=password'
		};

		server.inject(badlogin, function(response) {
			assert.equal(response.statusCode, 401, 'it should return a 401 status code');
			assert.equal(response.result.message, 'Invalid username or password', 'it should return an error message');
			assert.equal(response.cookie, undefined, 'it should not give us a cookie');
			done();
		});
	});

	lab.test('Successful login', function(done) {

		var goodlogin = {
			url: '/login',
			method: 'POST',
			headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
			payload: 'username=thezurgx&pass=l337_p@s5w0rD?'
		};

		server.inject(goodlogin, function(response) {
			assert.equal(response.statusCode, 200, 'it should return a 200 status code');
			assert.notEqual(response.cookie, undefined, 'it should return a good cookie');
			done();
		});
	});
});