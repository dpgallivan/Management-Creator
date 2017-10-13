const bodyParser = require('body-parser');
const react = require('react');
const router = require('react-router');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));

app.get('/welcome', function(req, res, err){
	res.send(__dirname + '/public/html/index.html');
		console.log(err)
});

app.get('/', function(req, res, err){
	res.sendFile(__dirname + '/public/html/index.html');
		console.log(err);
});

// app.get('/createCharacter', function(req, res, err){
// 	res.send();
// 		console.log(err);
// });

app.get('/forum', function(req, res, err){
	res.sendFile(__dirname + '/public/html/index.html');
		console.log(err);
});

app.listen(3000, function() {
	console.log('app running on port 3000')
});