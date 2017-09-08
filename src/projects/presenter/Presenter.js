var log4js = require('log4js');
var logger = log4js.getLogger('Project');

projectView = require("../views/ViewImpl");

var settings = require("settings");
var connection = requireSrc('connection/DBConnection');

var pg = require('pg');
var events = require('events');


function ProjectPresenter(){
	this.result= null;
}

ProjectPresenter.prototype = new events.EventEmitter;

/*
 * Bind general app events
 */
ProjectPresenter.prototype.bind = function(){
	// TODO Try insert data into view through event
	logger.trace("Bind ProjectPresenter");
	this.on('event', function(){
		logger.info('event fired');
	});
}

/*
 * UnBind general app events
 */
ProjectPresenter.prototype.unbind = function(){
	logger.trace("UnBind ProjectPresenter");
}

/*
 * reveal general app display
 */
ProjectPresenter.prototype.revealDisplay = function(){
	logger.trace("ProjectPresenter view reveal display");
	logger.debug("ProjectPresenter Builded");

	var that = this;

	query = new connection.DBConnection();

	var parameters = {
		projects: null,
		snippets: null,
		username: 'svan'
	};

	query.execStatementQuery('SELECT name,id FROM projects where usr_id = $1::int', [1], function(result){
			logger.info("Query executed");
			parameters.projects = result.rows;
			that.emit("executed",parameters);
		},
		function(err){
			return logger.error('could not connect to postgres', err);
	});

	// Executed projects. -> call to find snippets.
	this.on("executed", function(parameters){
		query.execStatementQuery('SELECT name,id FROM snippet where usr_id = $1::int', [1], function(result){
			parameters.snippets = result.rows;
			projectView.setParameters(parameters);
			that.emit('revealed');
		},
		function(err){
			return logger.error('could not connect to postgres', err);
		});
		
	});
}

ProjectPresenter.prototype.setResult = function($result){
	this.result = $result;
}

ProjectPresenter.prototype.getDisplay = function(){
	return projectView;
}

module.exports.Presenter = ProjectPresenter;