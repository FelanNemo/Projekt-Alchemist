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
/*
Get Button liest die savegame.json Datei und liefert also Response ture oder false,
ture wenn die Datei vorhanden ist, false wenn nicht
*/
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

/*
Get Gametyp liest die games.json, wenn die Datei vorhanden ist wird in der Datei
der Gametyp Tag gesucht und die Daten des Tags in einem Array gespeichert.
Dieses Array wird als Antwort zurück geschickt.
*/
app.get('/gametype', function (req, res) {
  fs.readFile('../res/games.json', function (err, data) {
    if(!err){
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

/*
*/
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


/*---Postrequest---*/
app.post('/combine', function (req, res) {
  fs.readFile('../savegame.json', function (err, data) {
    if(!err){
        var game = JSON.parse(data);
        var gametyp = game.game[0].gametype;
        var tempi = '';

        fs.readFile('../res/games.json', function (err2, data2) {
          if(!err2){
            var temp = JSON.parse(data2);

            for( var i in game.game){
              if(gametyp == temp.game[i].gametyp){
                for(var j = 4; j < temp.game[i].combinations.length; j++){
<<<<<<< HEAD

=======
>>>>>>> Does It Work?
                  gefunden = 0;
                  for(var l in req.body.elements){
                    for(var k in temp.game[i].combinations[j].elements){
                      if(req.body.elements[l] == temp.game[i].combinations[j].elements[k] ){
<<<<<<< HEAD
                        //tempi.push(temp.game[i].combinations[j]);

                        gefunden++;

                        //console.log('Tempi: ' + tempi);
                      }
                    }//End for k
                  }//End for l

=======
                        gefunden++;
                      }
                    }//End for k
                  }//End for l
>>>>>>> Does It Work?
                  if ( gefunden == 2 ) {
                    tempi = temp.game[i].combinations[j].result;
                    console.log( 'gefunden in ' + j );
                  }
<<<<<<< HEAD

=======
>>>>>>> Does It Work?
                }//End for j
              }//End if
            }//End for i

<<<<<<< HEAD
            if ( tempi != '' )   res.send(tempi)

          /*  for(var i = 0; i < (tempi.length-1); i++ ){
              var ele0 = tempi[i];

              for(var j = (i+1); j < tempi.length; j++){
                if(ele0 == tempi[j]){
                  console.log(tempi[j].result);
                  res.send(tempi[j].result)
                  break;
                }//End if
              }//End for j
            }//End for i*/
=======
            if ( tempi != '' )   res.send(tempi);
>>>>>>> Does It Work?

            console.log('Found game.json -----------------------');
          } else {
            console.log('Datei nicht gefunden');
          }//End Else
        }); //End readFile GameJSON
    } else {
      console.log('Datei nicht gefunden');
      res.end(JSON.stringify({file: false}));
    }
  });
});

/*
Post Save liest die Datei savegame.json, wenn die Datei nicht vorhanden ist,
wird diese erstellt, ist sie vorhanden wird diese überschrieben, dadurch kann nur ein
Spiel gespeichert werden
*/
app.post('/save', function (req, res) {
  fs.readFile('../savegame.json', function (err, data) {
    if(!err){
      try {
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
        /*var game = req.body;
        fs.writeFile('../savegame.json', JSON.stringify(game));
        console.log('Datei gefunden');
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({saved: true}))*/
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

/*
*/
app.post('/update', function(req, res) {
  fs.readFile('../savegame.json', function (err, data) {
    if(!err){
      var game = JSON.parse(data);

      var isThere = true;
      for(var i in game.game[0].results){
        if(req.body.result == game.game[0].results[i])
        isThere = false;
        }
      }

    if(isThere == true){
        game.game[0].results.push(req.body.result);
      }
      fs.writeFile('../savegame.json', JSON.stringify(game));
  });
});

/*
Post Select liest die Datei games.json aus und liefert ein Objekt mit allen
Ergebnissen zu einem übertragen Gametyp zurück
*/
app.post('/select', function(req, res){
  fs.readFile('../res/games.json', function (err, data) {
    if(!err){
      var sendData = [];

      var games = JSON.parse(data);
      console.log('Datei gefunden');

      for(var i in games.game){
        if(games.game[i].gametyp == req.body.gametyp){
          for(var j in games.game[i].combinations){
            sendData.push(games.game[i].combinations[j].result);
          }
        }
      }
      res.send(sendData);
    }
  });
});

/*
Post AddEle liest games.json, und updated sie
*/
app.post('/addEle', function(req, res) {
  var input = req.body;

  fs.readFile('../res/games.json', function (err, data) {
    if(!err){
        var games = JSON.parse(data);

        var arr = input.elements;
        var newGame = input.newGametyp;
        var index = arr.indexOf('empty');
        var g = [];

        if(index > -1){
          arr.splice(index,1);
        }

        for(var i in games.game){
          g.push(games.game[i].gametyp);
        }

        if(newGame != ''){
          games.game.push({"gametyp":newGame,"combinations":[{"result":input.result,"elements":arr,"bild":"bilder/"+input.bildName}]});
          fs.writeFile('../res/games.json', JSON.stringify(games));
        } else{
          for(var i in g){
            if(g[i] == input.gametyp){
              games.game[i].combinations.push({"result":input.result,"elements":arr,"bild":"bilder/"+input.bildName})
              fs.writeFile('../res/games.json', JSON.stringify(games));
                break;
            }//End of if(g[i] == input.gametyp)
          }//End of for(var i in g)
          console.log('Datei gefunden');
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify({saved: true}))
        }
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
