const wpi = require('wiring-pi');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const path = require('path');
app.use(bodyParser.json());
const fs = require('fs');
const secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));

console.log(secrets);

// GPIO pin of the motor
const configPin = 19;
wpi.setup('gpio');
wpi.pinMode(configPin, wpi.OUTPUT);

app.get('/', function (req, res) {
	res.status(200).sendFile(path.join(__dirname, '/static/index.html'));
});
app.get('/robots.txt', function (req, res) {
	res.status(200).sendFile(path.join(__dirname, '/static/robots.txt'));
});

app.post('/motor', function (req, res) {
	console.log(req.body);
	if (req.body.password === secrets.password) {
		if (req.body.state === true) {
			wpi.digitalWrite(configPin, 1);
			setTimeout(function () {
				wpi.digitalWrite(configPin, 0);
				res.status(200).send(true);
			}, req.body.seconds * 1000);
		} else if (req.body.state === false) {
			wpi.digitalWrite(configPin, 0);
			res.status(200).send(false);
		} else {
			res.status(404).send('please send a state');
		}
	} else {
		res.status(401).send('password required!');
	}
});

app.listen(3000, function () {
	console.log('listening on port 3000!');
});
