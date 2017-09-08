var settings = require("settings");
var log4js = require('log4js');
var logger = log4js.getLogger('DBConnection');

function DBConnection(){
	this.url = 'postgres://'+ settings.DB.user + ':'+ settings.DB.passwd + '@' + settings.DB.host + '/' + settings.DB.database;
}

DBConnection.prototype.client= function(){
	pg = require('pg');
	logger.trace("DB connection: " + this.url);
	var client = new pg.Client(this.url);
	logger.trace("Connected");
	return client;
}


DBConnection.prototype.execQuery = function($query, $onSuccessCallback, $onFailureCallback){
	logger.trace("Query execution: " + $query);
	client = this.client();

	client.connect(function(err) {
		if(err) {
			logger.error('could not connect to postgres: ' + err);
			return $onFailureCallback('CONNECTION ERROR: ' + err);
		}

		client.query($query, function(err, result) {
			if(err) {
				logger.warn("Query In Error: " + $query);
				return $onFailureCallback('SQL ERROR: '+err);
			}
			logger.trace("Query In Success");
			client.end();

			return $onSuccessCallback(result);
		});
	});
}

DBConnection.prototype.execStatementQuery = function($query, $params, $onSuccessCallback, $onFailureCallback){
	logger.trace("Query execution: " + $query);
	client = this.client();

	client.connect(function(err) {
		if(err) {
			logger.error('could not connect to postgres: ' + err);
			return $onFailureCallback('CONNECTION ERROR: ' + err);
		}

		client.query($query, $params, function(err, result) {
			if(err) {
				logger.warn("Query In Error: " + $query);
				return $onFailureCallback('SQL ERROR: '+err);
			}
			logger.trace("Query In Success");
			client.end();

			return $onSuccessCallback(result);
		});
	});
}

module.exports.DBConnection = DBConnection;