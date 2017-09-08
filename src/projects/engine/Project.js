var log4js = require('log4js');
var logger = log4js.getLogger('Interpretor');
var settings = require("settings");

var connection = requireSrc('connection/DBConnection');
var events = require('events');

function Project(){
	
}

Project.prototype = new events.EventEmitter;

Project.prototype.create = function(usr_id, name, type) {
	var query = new connection.DBConnection();
	var that = this;

	if (type === "project"){
		query.execStatementQuery('INSERT INTO projects (usr_id, name) values($1::int,$2)', [usr_id, name],
			function(result){	
				that.emit('created');
			},
			function(err){
				logger.error(err);
				that.emit('SQL-Error');
			}
		);

	}else if(type === "snippet"){

		query.execStatementQuery('INSERT INTO snippet (usr_id, name) values($1::int,$2)', [usr_id, name],
			function(result){
				that.emit('created');
			},
			function(err){
				logger.error(err);
				that.emit('SQL-Error');
			}
		);

	}


};

module.exports.Project = Project;