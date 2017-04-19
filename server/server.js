/* Mein erster Webserver */

//var http = require('http');
var fs = require('fs');
var express = require('express');
var bp = require('body-parser');
var app = express();

var server = app.listen(12345, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server listen http//%s:%s', host, port);
});

var files = [
  {req:'/', file:'../index.html'},
  {req:'/user', file:'../user.html'},
  {req:'/admin', file:'../admin.html'}
];

//console.log(files);
app.use(bp.urlencoded({extended:true}));
app.use(express.static('../res'));

for(var i in files){
  (function (i) {
    app.get(files[i].req, function( req, res) {

      console.log(files[i]);

      fs.readFile(files[i].file, function(err, data) {
        if(!err){
          res.writeHead(200,{'Content-Type':'text/html'});
          res.end(data.toString());
        } else{
          res.writeHead(404,{'Content-Type':'text/html'});
          res.end('File not found');
        }
      });
    });
  })(i);
};

app.post('/save', function (req, res) {
  console.log(req.body);

  fs.readFile('../savegame.json', function (err, data) {
    if(!err){
      try {
        var game = JSON.parse(data);
        game.game.push(req.body);
        fs.writeFile('savegame.json', JSON.stringify(game));
        console.log('Datei gefunden');
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({saved: true}))
      } catch (err){
        res.writeHead(500,{'Content-Type':'text/html'});
        res.end('File corrupted');
      }
    } else {
          var game = {game:[]};
          game.game.push(req.body);
          fs.writeFile('../savegame.json', JSON.stringify(game));
          console.log('Datei erstellt');
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify({saved: true}));
      }
  });
});

app.get('/button', function (req, res) {
  fs.readFile('../savegame.json', function (err) {
    if(!err){
      console.log('Datei gefunden');
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({file: true}));
    } else {
      console.log('Datei nicht gefunden');
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({file: false}));
    }
  });
});

app.get('/gametype', function (req, res) {
  fs.readFile('../res/games.json', function (err, data) {
    if(!err){
      //res.writeHead(200,{'Content-Type':'text/html'});
      console.log('Datei gefunden!');
      var games = JSON.parse(data);
      var sendData = [];

      for(var i in games.game){
        console.log(games.game[i].gametyp);
        sendData.push(games.game[i].gametyp);
      }

      res.send(sendData);
      //console.log(sendData);


    } else {
      console.log('Datei nicht gefunden');
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({file: false}));
    }
  });
});
