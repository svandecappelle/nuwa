//require('look').start();
//var run = require("./run");

function Nuwa(){
	this.settings = require("settings");
	this.configureLoggers();
}

Nuwa.prototype.start = function(){

	var server = require("./HttpServer");
	var router = require("./Router");

	var router = new router.Router();
	var http_server = new server.Server(router);
	server = http_server.start();

	this.loggerRoot.info("Starting SocketIO...");
	var io = require('socket.io').listen(server);
	io.set('log level', 1);
	io.set('transports', [
		'websocket'
		, 'flashsocket'
		, 'htmlfile'
		, 'xhr-polling'
		, 'jsonp-polling'
	]);
	io.enable('browser client etag');

	var that = this;

	io.on('connection', function (socket) {
		that.loggerRoot.info('Un client est connecté ! ' + socket.id);
		//socket.emit('message', 'Vous êtes bien connecté !');

		socket.on('code_html', function (data){
			that.updateCode(socket, data);
		});

		socket.on('code_css', function (data){
			that.updateCode(socket, data);
		});

		socket.on('code_js', function (data){
			that.updateCode(socket, data);
		});

		if (socket.handshake.headers['x-forwarded-for'] !== undefined){
			socket.set('remoteAddress', socket.handshake.headers['x-forwarded-for']);
		}
		else{
			socket.set('remoteAddress', socket.handshake.address.address);
		}
		

		// Quand on client se connecte, on le note dans la console
		// socket.of("/me").on('connection', function (socket) {
		// 	console.log('Un client est connecté !');
		// 	console.log('I received a private message by ', from, ' saying ', msg);
		// 	socket.emit('message', 'Vous êtes bien connecté !');
		// });
	});

	this.loggerRoot.info("SocketIO Started");
	this.serveMessage();
}

Nuwa.prototype.serveMessage = function(){
	var message = "Server ready to serve on ";
	var addressServer = [""];
	
	var os=require('os');
	var ifaces=os.networkInterfaces();
	var i = 0;
	var portNumber = this.settings.app.server.port;
	for (var dev in ifaces) {
	  var alias = 0;
	  ifaces[dev].forEach(function(details){
	    if (details.family=='IPv4') {
	      // loggerRoot.info(dev+(alias?':'+alias:''),details.address);
	      addressServer[i] = (details.address + ":" + portNumber);
	      ++alias;
	      i+=1;
	    }
	  });
	}

	for (var j = 0; j < i; j++){
		message += "[" + addressServer[j] + "] ";
	}
	this.loggerRoot.info(message);
}

Nuwa.prototype.updateCode = function(socket, data){
	this.loggerRoot.trace('Un client a modifier du code [' + data.id + '] (' + data.editor + '): ' + data.code);

	var intrepretorUpdator = require("./engine/InterpretorUpdator");
	var engine = new intrepretorUpdator.InterpretorUpdator();
	engine.on('updated', function(){
		socket.broadcast.emit('editByAnotherUser', data);
		// socket.emit('message', 'Saved code successfully');
		socket.emit('saved', true);
	});
	engine.update(data);
}

Nuwa.prototype.configureLoggers = function(){
	var log4js = require('log4js');
	var log_level = 'INFO';

	this.loggerRoot = log4js.getLogger('nuwa');
	log4js.loadAppender('file');
	log4js.addAppender(log4js.appenders.file('log/nuwa.log'), 'nuwa');
	log4js.addAppender(log4js.appenders.file('log/nuwa.log'), 'Index');
	log4js.addAppender(log4js.appenders.file('log/nuwa.log'), 'Interpretor');
	log4js.addAppender(log4js.appenders.file('log/nuwa.log'), 'Me');
	log4js.addAppender(log4js.appenders.file('log/nuwa.log'), 'Project');
	log4js.addAppender(log4js.appenders.file('log/nuwa.log'), 'FileManager');
	log4js.addAppender(log4js.appenders.file('log/nuwa.log'), 'RequestHandlers');
	log4js.addAppender(log4js.appenders.file('log/nuwa.log'), 'Router');
	

	this.loggerRoot.setLevel(log_level);
	log4js.getLogger('nuwa').setLevel(log_level);
	log4js.getLogger('Index').setLevel(log_level);
	log4js.getLogger('Interpretor').setLevel(log_level);
	log4js.getLogger('Me').setLevel(log_level);
	log4js.getLogger('Project').setLevel(log_level);
	log4js.getLogger('FileManager').setLevel(log_level);
	log4js.getLogger('RequestHandlers').setLevel(log_level);
	log4js.getLogger('Router').setLevel(log_level);
}

run = new Nuwa();
run.start();
