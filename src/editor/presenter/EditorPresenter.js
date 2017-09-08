var log4js = require('log4js');
var logger = log4js.getLogger('Index');

var settings = require("settings");
var connection = requireSrc('connection/DBConnection');

editorView = require("../views/EditorViewImpl");
var events = require('events');

function EditorPresenter(){

}

EditorPresenter.prototype = new events.EventEmitter;

/*
 * Bind general app events
 */
EditorPresenter.prototype.bind = function(){
	logger.trace("Bind EditorPresenter");
}

/*
 * UnBind general app events
 */
EditorPresenter.prototype.unbind = function(){
	logger.trace("UnBind EditorPresenter");
}

/*
 * reveal general app display
 */
EditorPresenter.prototype.revealDisplay = function(){
	logger.info("EditorPresenter view reveal display");
	
	var that = this;

	var name = this.query_parameter.name;
	query = new connection.DBConnection();


	logger.info(this.query_parameter.name);
	query.execStatementQuery('SELECT code_html, code_js, code_css FROM snippet where usr_id = $1::int and name=$2', [1,this.query_parameter.name], function(result){
		logger.info("Query executed");
		var parameters = {
				code_html:result.rows[0].code_html,
			 	code_css:result.rows[0].code_css, 
				code_js:result.rows[0].code_js,
				project : {
					name: name,
				},
				username: 'svan'
			}

		editorView.setParameters(parameters);
		that.emit('revealed');
	},
		function(err){
			return logger.error('could not connect to postgres', err);
	});
}

EditorPresenter.prototype.parameter = function($query_parameter){
	this.query_parameter = $query_parameter;
	logger.info("set param");
}

EditorPresenter.prototype.getDisplay = function(){
	return editorView;
}

EditorPresenter.prototype.post = function($optionType, $params){
	this.emit('saved', 'OptionJs added: ' + $params.body.jslibrary);
}
module.exports.Presenter = EditorPresenter;