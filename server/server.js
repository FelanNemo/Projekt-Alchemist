var fs = require('fs');
var express = require('express');
var bp = require('body-parser');

var path = require('path');

var app = express();

var server = app.listen(12345, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server listen http//%s:%s', host, port);
});

var files = [
  {req:'/', file:'../index.html'},
  {req:'/user', file:'../user.html'},
  {req:'/admin', file:'../admin.html'},
  {req:'/game', file:'../game.html'}
];

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

/*---Getrequest---*/
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
    } else {
      console.log('Datei nicht gefunden');
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({file: false}));
    }
  });
});

app.get('/book', function (req, res) {
  fs.readFile('../savegame.json', function (err, data) {
    if(!err){
      console.log('Datei gefunden!');
      var games = JSON.parse(data);
      var sendData = [];

      for(var i in games.game){
        for(var j = 1; j < games.game[i].results.length; j++)
        sendData.push(games.game[i].results[j]);
      }
      res.send(sendData);

    } else {
      console.log('Datei nicht gefunden');
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({file: false}));
    }
  });
});

app.post('/combine', function (req, res) {

  fs.readFile('../savegame.json', function (err, data) {
    if(!err){
        var game = JSON.parse(data);
        var gametyp = game.game[0].gametype;

        fs.readFile('../res/games.json', function (err2, data2) {
          if(!err2){
            var temp = JSON.parse(data2);

            console.log(req.body.elements);

            for( var i in game.game){
              if(gametyp == temp.game[i].gametyp){
                for(var j = 4; j < temp.game[i].combinations.length; j++){
                  console.log(temp.game[i].combinations[j].elements);
                  if(temp.game[i].combinations[j].elements == req.body.elements){
                    console.log('element gefunden');
                  }
                }//End for j
              }//End if
            }//End for i
            console.log('Found game.json -----------------------');
          } else {
            console.log('Datei nicht gefunden');
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({file: false}));
          }//End Else
        }); //End readFile GameJSON
    } else {
      console.log('Datei nicht gefunden');
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({file: false}));
    }//End else
  });//End readFile SaveJSON
});//En app.det COMBINE


/*---Postrequest---*/
app.post('/save', function (req, res) {
  fs.readFile('../savegame.json', function (err, data) {
    if(!err){
      try {
        var game = JSON.parse(data);
        game.game.push(req.body);
        fs.writeFile('../savegame.json', JSON.stringify(game));
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
          fs.readFile('../res/games.json',function(err2,data2) {
            var temp = JSON.parse(data2);
            if(!err2){

              for(var i in temp.game){
                if(req.body.gametype == temp.game[i].gametyp){
                  for(var j = 0; j<4; j++){
                    game.game[i].results.push(temp.game[i].combinations[j].result)
                  }
                  fs.writeFile('../savegame.json', JSON.stringify(game));
                  console.log('Datei erstellt');
                  res.writeHead(200,{'Content-Type':'application/json'});
                  res.end(JSON.stringify({saved: true}));
                }
              }
            }
          });
      }
  });
});

app.post('/select', function(req, res){
  fs.readFile('../res/games.json', function (err, data) {
    if(!err){
      var sendData = [];

      var games = JSON.parse(data);
      console.log('Datei gefunden');
      //console.log(req.body.gametyp);

        for(var i in games.game){
          if(games.game[i].gametyp == req.body.gametyp){
            for(var j in games.game[i].combinations){
              sendData.push(games.game[i].combinations[j].result);
            }//End for
          }//End if
        }//End for
        res.send(sendData);
        //console.log(sendData);
    }//End if(!err)
  });
});//End app.pos Select

app.post('/addEle', function(req, res) {
  //console.log(req.body);

  var input = req.body;

  fs.readFile('../res/games.json', function (err, data) {
    if(!err){
        var games = JSON.parse(data);

        var arr = input.elements;
        var index = arr.indexOf('empty')

        if(index > -1){
          arr.splice(index,1);
        }

        var g = [];
        for(var i in games.game){
          g.push(games.game[i].gametyp);
        }

        for(var i in g){
          if(g[i] == input.gametyp){
            games.game[i].combinations.push({"result":input.result,"elements":arr,"bild":"bilder/"+input.bildName})
            fs.writeFile('../res/games.json', JSON.stringify(games));
              console.log(games.game[i].combinations);
              break;
          }//End of if(g[i] == input.gametyp)
        }//End of for(var i in g)

        console.log('Datei gefunden');
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({saved: true}))
    } else {
          var game = {game:[]};
          game.game.push(req.body);
          fs.writeFile('../res/games.json', JSON.stringify(game));
          console.log('Datei erstellt');
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify({saved: true}));
      }
  });
});
