var express = require('express');
var request = require('request');
var app = express();


var port = process.env.PORT || 3000;
var apiUrl = process.argv[2] || 'https://beta.greenmile.com';

// Where your static files are
var frontEndFiles = '/Users/cmilfont/projetos/gm-server/src/main/webapp/gm-live/src';

app.use(express.static('files'));

app.use('/login', function(req, res){
  var url = apiUrl + "/login";
  req.pipe(request(url, function(err, response, body){
    
    var body = {};
    
    console.log("RETORNO DO LOGIN", body);
    
    try {
      //body = JSON.parse(body);
      body.targetUrl = "http://dev.greenmile.com/index"      
    } catch (e) {
      console.log(e);
    }
    
    res.json(body);
    return body;
  }));
});

// Don't map to your root folder directly, instead map to index.html, so we
// will be able to use root folder to map remote API calls to remote server
app.use('/index', express.static(frontEndFiles + '/index.html'));
app.use('/server_down', express.static(frontEndFiles + '/server_down.html'));

// Mapping your static files
app.use('/resources/javascripts/', express.static(frontEndFiles + '/resources/javascripts'));
app.use('/resources/stylesheets/', express.static(frontEndFiles + '/resources/stylesheets'));
app.use('/resources/images/', express.static(frontEndFiles + '/resources/images'));
app.use('/resources/fonts/', express.static(frontEndFiles + '/resources/fonts'));
app.use('/resources/html_templates/', express.static(frontEndFiles + '/resources/html_templates'));

// Here is the secret, all your api call will be dynamically mapped to a remote
// server with the same kind of request e same parameters and same content body
app.use('/', function(req, res) {
  var url = apiUrl + req.url;
  req.pipe(request(url)).pipe(res);
});

app.listen(80);

console.log ('Server target: ' + apiUrl);
console.log ('Front-end folder: ' + frontEndFiles);
console.log ('API server running since ' + new Date());

