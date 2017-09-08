var log4js = require('log4js');
var logger = log4js.getLogger('Index');

var settings = require("settings");
var connection = requireSrc('connection/DBConnection');

indexView = getView("index");
var events = require('events');

function IndexPresenter(){
	this.result = null;
}

IndexPresenter.prototype = new events.EventEmitter;

/*
 * Bind general app events
 */
IndexPresenter.prototype.bind = function(){
	logger.trace("Bind IndexPresenter");
}

/*
 * UnBind general app events
 */
IndexPresenter.prototype.unbind = function(){
	logger.trace("UnBind IndexPresenter");
}

/*
 * reveal general app display
 */
IndexPresenter.prototype.revealDisplay = function(){
	logger.info("IndexPresenter view reveal display");
	this.emit('revealed');
}

IndexPresenter.prototype.parameter = function($query_parameter){
	this.query_parameter = $query_parameter;
	logger.info("set param");
}

function pushCode($html_code, $css_code, $js_code){

}

IndexPresenter.prototype.getDisplay = function(){
	return indexView;
}

module.exports.Presenter = IndexPresenter;