var log4js = require('log4js');
var loggerRoot = log4js.getLogger('nuwa');

//var http = require("http");

var express = require('express');

var url = require("url");
var settings = require("settings");

function HttpServer(router){
  this.router = router;
}

HttpServer.prototype.start = function() {
  loggerRoot.info("Starting server...");
  
  var that = this;
  
  function onRequest(request, response) {

      // catch the uncaught errors that weren't wrapped in a domain or try catch statement
      // do not use this in modules, but only in applications, as otherwise we could have multiple of these bound
      //process.on('uncaughtException', function(err) {
          // handle the error safely
       //   logger.error("FATAL ERROR: " + err)
         // response.writeHead(500, {"Content-Type": "text/html"});
       //   response.write("Internal Error: 500");
       //   response.end();
      //});

      var pathname = url.parse(request.url).pathname;
      loggerRoot.info("Requête reçue pour le chemin " + pathname + ".");
      //that.redirect(pathname, request, response);
  }
  
  //var server = express();
  //app.listen(settings.app.server.port);
  
  //var server = require('http').createServer(express);
  //server.listen(settings.app.server.port);

  var express = require('express');
  //var https = require('https');
  var http = require('http');
  var app = express();
  app.use(express.json());       // to support JSON-encoded bodies
  app.use(express.urlencoded()); // to support URL-encoded bodies
  var server = http.createServer(app).listen(settings.app.server.port);
  //https.createServer(options, app).listen(443);

  //app.use(onRequest);
  this.router.redirectApp(app);
  // for (routes in this.router.handle){
  //   console.log("route: " + routes);
  //   server.get();
  //   server.post();
  // }
  return server;
}

HttpServer.prototype.redirect = function(pathname,request,response){
  this.router.redirect(pathname, request, response);
}

exports.Server = HttpServer;