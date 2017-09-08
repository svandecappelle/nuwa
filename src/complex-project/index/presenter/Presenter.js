var log4js = require('log4js');
var logger = log4js.getLogger('Index');

var settings = require("settings");
var connection = requireSrc('connection/DBConnection');

editorView = require("../views/ViewImpl");
var events = require('events');

function Presenter(){

}

Presenter.prototype = new events.EventEmitter;

/*
 * Bind general app events
 */
Presenter.prototype.bind = function(){
	logger.trace("Bind EditorPresenter");
}

/*
 * UnBind general app events
 */
Presenter.prototype.unbind = function(){
	logger.trace("UnBind EditorPresenter");
}

/*
 * reveal general app display
 */
Presenter.prototype.revealDisplay = function(){
	logger.info("EditorPresenter view reveal display");
	
	var that = this;

	var id = this.query_parameter.id;

	query = new connection.DBConnection();

	query.execStatementQuery('SELECT code_html, code_js, code_css FROM snippet where usr_id = $1::int and name = $2', [1, this.query_parameter.name], function(result){
		logger.info("Query executed");
		if (result.rows){
			var parameters = {
					code_html:result.rows[0].code_html,
				 	code_css:result.rows[0].code_css, 
					code_js:result.rows[0].code_js,
					project : {
						id: id,
					},
					username: 'svan'
				}
		}
		editorView.setParameters(parameters);
		that.emit('revealed');
	},
		function(err){
			return logger.error('could not connect to postgres', err);
	});
}

Presenter.prototype.parameter = function($query_parameter){
	this.query_parameter = $query_parameter;
	logger.info("set param");
}

Presenter.prototype.getDisplay = function(){
	return editorView;
}

module.exports.Presenter = Presenter;