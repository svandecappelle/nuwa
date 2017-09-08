var log4js = require('log4js');
var logger = log4js.getLogger('Interpretor');
var settings = require("settings");

var connection = requireSrc('connection/DBConnection');
var interpretorView = require("../views/ViewImpl");
var events = require('events');

function InterpretorPresenter(){
	this.query_parameter= null;
}


InterpretorPresenter.prototype = new events.EventEmitter;

/*
 * Bind general app events
 */
InterpretorPresenter.prototype.bind = function(){
	// TODO Try insert data into view through event
	logger.trace("Bind InterpretorPresenter");
}

/*
 * UnBind general app events
 */
InterpretorPresenter.prototype.unbind = function(){
	logger.trace("UnBind InterpretorPresenter");
}

/*
 * reveal general app display
 */
InterpretorPresenter.prototype.revealDisplay = function(){
	logger.trace("InterpretorPresenter view reveal display");

	query = new connection.DBConnection();
	var name = this.query_parameter.name;
	
	logger.info(this.query_parameter.name);
	
	if(name === null){
		var parameters = {
			code_html:'',
		 	code_css:'', 
			code_js:''
		}

		interpretorView.setParameters(parameters);
		
		var view = interpretorView.asString();
		that.emit('revealed');
	}else{
		var that = this;
		query.execStatementQuery('SELECT code_html, code_js, code_css FROM snippet where usr_id = $1::int and name=$2', [1,name], 
			function(result){
					var parameters = {
						code_html:result.rows[0].code_html,
					 	code_css:result.rows[0].code_css, 
						code_js:result.rows[0].code_js,
						scripts: ["http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"],
					}

					interpretorView.setParameters(parameters);
					
					that.emit('revealed');
				},
			function(err){
				logger.error(err);
				that.emit('revealed');
			}
		);
	}
}

InterpretorPresenter.prototype.parameter = function($query_parameter){
	this.query_parameter = $query_parameter;
}

InterpretorPresenter.prototype.getDisplay = function(){
	return interpretorView;
}


module.exports.Presenter = InterpretorPresenter;