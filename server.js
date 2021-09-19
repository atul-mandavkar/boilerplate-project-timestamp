// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var path = require("path");

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
const { endianness } = require('os');
const e = require('express');
const { resolveSoa } = require('dns');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
/*
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
*/

let daysInLetters = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let monthsInLetters = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Fpr blank date input after api/
app.get("/api", (req, res)=>{
  let d = new Date();
  let utcVal = d.toUTCString();
  res.json({unix:d.getTime() , utc: utcVal});
})

let inputValue, d;
// For some input after api/
app.get("/api/:date", (req, res)=>{
  inputValue = req.params.date;
  d = new Date(inputValue)
  utcVal = d.toUTCString();
  res.json({unix: d.getTime(), utc: utcVal})
})

var port = process.env.PORT || 3000
// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
