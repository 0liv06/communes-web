var http = require('http');
var express = require('express');
var app = express();
var server = http.Server(app);
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.use('/src', express.static('webapp/js'));
app.use('/css', express.static('webapp/style'));
app.use('/lib', express.static('node_modules'));

app.get('/search', function(req, res) {
    
    
});

app.get('/', function (req, res) {
    
    res.sendFile('webapp/index.html', { root: __dirname });
});

app.get('/search/:term/:type', function (req, res) {
    
    client.search({
      index: 'communes',
      q: req.params.type + ':' + req.params.term + "*",
      size : 100
    }, function (error, response) {

        var hits = response.hits.hits;

        var result = [];
        
        for (var i = 0; i < hits.length; i++) {
            
            result.push(hits[i]._source);
        }
        
        res.json(result);
        
    }, this);  

    
});

server.listen(8081, function () {
  console.log('Example app listening on port 3000!');
})
