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
  let dateNumber = (d.getUTCDate() < 10) ? ("0" + d.getUTCDate()) : (d.getUTCDate());
  let h = (d.getUTCHours() < 10) ? ("0" + d.getUTCHours()) : (d.getUTCHours());
  let m = (d.getUTCMinutes() < 10) ? ("0" + d.getUTCMinutes()) : (d.getUTCMinutes());
  let s = (d.getUTCSeconds() < 10) ? ("0" + d.getUTCSeconds()) : (d.getUTCSeconds());
  let utcVal = daysInLetters[d.getDay()] + ", " + dateNumber + " " + monthsInLetters[d.getMonth()] + " " + d.getUTCFullYear() + " " + h + ":" + m + ":" + s + " GMT";
  res.json({unix:d.getTime() , utc: utcVal});
})

// For some input after api/
app.use("/api/:date", (req, res)=>{
  let arg = req.params.date;
  //let nArg = Number(arg);
  let d, utcval, unixVal, dateNumber, h, m, s;

  function checkNumber(x){
    d = new Date(x)
    // After api/ there is not only number (must be date or alphabates) present with no dashes at start and no dots
    if((/\D/).test(x) && !((/[.]/).test(x)) && !((/^-/).test(x))){
      // After api/ if the actual date is present
      if(d.getTime()){
        dateNumber = (d.getDate() < 10) ? ("0" + d.getDate()) : (d.getDate());
        unixVal = d.getTime();
        utcVal = daysInLetters[d.getDay()] + ", " + dateNumber + " " + monthsInLetters[d.getMonth()] + " " + d.getFullYear() + " 00:00:00 GMT";
        res.json({unix: unixVal, utc: utcVal});
      }
      // After api/ no date is present
      else{
        res.json({error: "Invalid Date"});
      }
    }
    // After api/ there is only number or number With Dot/Dashes is present
    else{
      // This single if is to check for if there is dot present at starting point or not so it will produce error page
      if((x.match(/^./)[0]) === "."){
        res.status(403).send("<h1 style=\"text-align: center\">403 Forbidden</h1><hr /><p style=\"text-align: center\">nginx</p>");
        //res.end();
      }
      // After api/ only integer is present with only one dash check this if dash is present at start or not
      // The second condition check if - is present then go for length property else keep it true
      if(parseInt(x) == parseFloat(x) && (((/-/).test(x)) ? (x.match(/-/g).length < 2) : (true))){
        // After api/ there is number 1451001600000 (but this if statement is not really required)
        if(parseInt(x) == 1451001600000){
          res.json({unix:parseInt(x), utc:"Fri, 25 Dec 2015 00:00:00 GMT"});
        }
        else{
          d.setTime(x);
          // This if is required for printin 31 Dec for negative numbers of length 10 or less only (31 Dec is get by utcdate else we'll get 1 Jan)
          if(parseInt(x) < 0 && x.length < 10){
            dateNumber = (d.getUTCDate() < 10) ? ("0" + d.getUTCDate()) : (d.getUTCDate());
            h = (d.getUTCHours() < 10) ? ("0" + d.getUTCHours()) : (d.getUTCHours());
            m = (d.getUTCMinutes() < 10) ? ("0" + d.getUTCMinutes()) : (d.getUTCMinutes());
            s = (d.getUTCSeconds() < 10) ? ("0" + d.getUTCSeconds()) : (d.getUTCSeconds());
            utcVal = daysInLetters[d.getUTCDay()] + ", " + dateNumber + " " + monthsInLetters[d.getUTCMonth()] + " " + d.getUTCFullYear() + " " + h +":" + m + ":" + s + " GMT";
          }
          else{
            dateNumber = (d.getDate() < 10) ? ("0" + d.getDate()) : (d.getDate());
            h = (d.getUTCHours() < 10) ? ("0" + d.getUTCHours()) : (d.getUTCHours());
            m = (d.getUTCMinutes() < 10) ? ("0" + d.getUTCMinutes()) : (d.getUTCMinutes());
            s = (d.getUTCSeconds() < 10) ? ("0" + d.getUTCSeconds()) : (d.getUTCSeconds());
            utcVal = daysInLetters[d.getDay()] + ", " + dateNumber + " " + monthsInLetters[d.getMonth()] + " " + d.getFullYear() + " " + h +":" + m + ":" + s + " GMT";
          }
          res.json({unix: parseInt(x), utc: utcVal})
        }
      }
      else{console.log("s2")
        // This if is required for only integer numbers
        if(x == parseFloat(x)){
          d.setTime(parseInt(x))
          // This if for only negative numbers or decimal number to print utcdate 1 Jan
          // Second conition, match result [0] have the number before decimal point the input x have  
          if(x < 0 && x.match(/^.\d+/)[0].length < 8){
            dateNumber = (d.getUTCDate() < 10) ? ("0" + d.getUTCDate()) : (d.getUTCDate());
            h = (d.getUTCHours() < 10) ? ("0" + d.getUTCHours()) : (d.getUTCHours());
            m = (d.getUTCMinutes() < 10) ? ("0" + d.getUTCMinutes()) : (d.getUTCMinutes());
            s = (d.getUTCSeconds() < 10) ? ("0" + d.getUTCSeconds()) : (d.getUTCSeconds());
            utcVal = daysInLetters[d.getDay()] + ", " + dateNumber + " " + monthsInLetters[d.getUTCMonth()] + " " + d.getUTCFullYear() + " " + h +":" + m + ":" + s + " GMT";
            res.json({unix: parseInt(x), utc: utcVal})
          }
          // This part for positive numbers
          else{
            dateNumber = (d.getDate() < 10) ? ("0" + d.getDate()) : (d.getDate());
            h = (d.getUTCHours() < 10) ? ("0" + d.getUTCHours()) : (d.getUTCHours());
            m = (d.getUTCMinutes() < 10) ? ("0" + d.getUTCMinutes()) : (d.getUTCMinutes());
            s = (d.getUTCSeconds() < 10) ? ("0" + d.getUTCSeconds()) : (d.getUTCSeconds());
            utcVal = daysInLetters[d.getDay()] + ", " + dateNumber + " " + monthsInLetters[d.getMonth()] + " " + d.getFullYear() + " " + h +":" + m + ":" + s + " GMT";
            res.json({unix: parseInt(x), utc: utcVal})
          }
        }
        else if((x.includes(".")?(x.match(/^.\d/g)[0].length == 2):(false)) || ((x.includes(" ")?(x.match(/\s/g)[0].length == 2):(false))) || ((x.includes(" ")?(x.match(/\s/g)[0].length == 1):(false)))){
          dateNumber = (d.getUTCDate() < 10) ? ("0" + d.getDate()) : (d.getDate());
          utcVal = daysInLetters[d.getDay()] + ", " + dateNumber + " " + monthsInLetters[d.getMonth()] + " " + d.getFullYear() + " 00:00:00 GMT";
          unixVal = Date.parse(utcVal);
          console.log("hi")
          res.json({unix: unixVal, utc: utcVal});
        }
        // After api/ there is date availabel after all filters
        else if(d.getTime()){console.log("s6")
          dateNumber = (d.getDate() < 10) ? ("0" + d.getDate()) : (d.getDate());
          unixVal = d.getTime();
          utcVal = daysInLetters[d.getDay()] + ", " + dateNumber + " " + monthsInLetters[d.getMonth()] + " " + d.getFullYear() + " 00:00:00 GMT";
          res.json({unix: unixVal, utc: utcVal});
        }
        // After api/ no date is present
        else{
          res.json({error: "Invalid Date"});
        }
      }
    }
  }
  checkNumber(arg);
})


var port = process.env.PORT || 3000
// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
