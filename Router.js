var log4js = require('log4js');
var logger = log4js.getLogger('Router');

requestHandlers = require("./RequestHandlers");

var handle = [];
function Router(){
	this.handle = [];
	this.postMethods = [];

	this.requestHandlers = new requestHandlers.RequestHandlers();

	this.handle["/"] = requestHandlers.index;
	this.handle["/index"] = requestHandlers.index;
	this.handle["/editor"] = requestHandlers.editor;
	this.handle["/interpretor"] = requestHandlers.interpretor;
	this.handle["/me"] = requestHandlers.me;
	this.handle["/projects"] = requestHandlers.projects;	
	this.handle["/upload"] = requestHandlers.upload;

	this.postMethods["/save"] = requestHandlers.save;
	this.postMethods["/createproj"] = requestHandlers.createproj;
}

Router.prototype.redirect = function(request, response) {
	var url = require("url");
	var pathname = url.parse(request.url).pathname;
	logger.trace("Début du traitement de l'URL " + pathname + ".");
	response.writeHead(200, {"Content-Type": "text/html"});
	logger.info(pathname);
	if(pathname==="/"){
		logger.info("index");
		this.requestHandlers["index"](request, response);
		logger.info("index called");
	}else {
		logger.info(pathname.replace("/",""));
		this.requestHandlers[pathname.replace("/","")](request, response);
		logger.info(pathname.replace("/","")+" called");
	}
}

Router.prototype.redirectApp = function(server) {
	var that = this;
	for (var route in this.handle){
		logger.info("serve: " + route);
		logger.trace("Get method");
		server.get(route, function(req, res){
			that.redirect(req,res);			
		});
	}
	/*
	for (var route in this.postMethods){
		logger.info("serve as post: " + route);
		server.post(route, function(req, res){
			logger.info("Post method::"+route);
			var url = require("url");
			var pathname = url.parse(req.url).pathname;
			this.requestHandlers[pathname.replace("/","")](req, res);
		});
	}*/

	// static files serving
	var express = require("express");
	server.use("/public", express.directory('public'));
	server.use("/public", express.static('public'));

	server.get('/snippet/:user/:name', function(req, res) {
		logger.info("call editor:: " + req.params.name + " user::" + req.params.user);
		that.requestHandlers.dynamicEditor(res, {name : req.params.name, user: req.params.user});
	});
	server.post('/editors/:user/:name/setOption', function(req, res) {
		logger.info("call editor:: " + req.params.name + " user::" + req.params.user);
		logger.info("save option for:" + req.params.name +" user: " +req.params.user +" -- "+ req.body.jslibrary);
		//that.requestHandlers.dynamicEditor(res, {id : req.params.id, user: req.params.user});
		that.requestHandlers.changeOptions(req, res);
		//res.end();
	});

	server.post('/projects/create', function(req, res) {
		that.requestHandlers.createproj(req, res);
	});

	server.get('/interpretor/:user/:name', function(req, res) {
		logger.info("call editor:: " + req.params.name + " user::" + req.params.user);
		that.requestHandlers.dynamicInterpretor(res, {name : req.params.name, user: req.params.user});
	});
	server.get('/project/:user/:name', function(req, res) {
		logger.info("call editor:: " + req.params.name + " user::" + req.params.user);
		that.requestHandlers.dynamicProject(res, {name : req.params.name, user: req.params.user});
	});
}

exports.Router = Router;