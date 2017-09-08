var log4js = require('log4js');
var logger = log4js.getLogger('Interpretor');
var settings = require("settings");
var connection = requireSrc('connection/DBConnection');
var events = require('events');

function InterpretorUpdator(){

}

InterpretorUpdator.prototype = new events.EventEmitter;

InterpretorUpdator.prototype.update = function(data){
	this.updateCode(data.id, data.code, data.editor);
}

InterpretorUpdator.prototype.updateCode = function(id, code, type_name){

	query = new connection.DBConnection();

	var codeFormatted = this.replaceAll('\'','\'\'', code);
	var updateSql = 'UPDATE snippet SET ' + type_name + ' = \'' + codeFormatted + '\' where name = \'' + id+'\'';
	logger.info(query);

	var that = this;

	query.execQuery(updateSql, function(result){
		logger.info("Updated code");
		that.emit('updated');
	},
		function(err){
			return logger.error('could not connect to postgres', err);
	});

}

InterpretorUpdator.prototype.replaceAll = function(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

exports.InterpretorUpdator = InterpretorUpdator;