var log4js = require('log4js');
var logger = log4js.getLogger('Me');

meView = require("../views/ViewImpl");

var pg = require('pg');
var events = require('events');

function MePresenter(){
	this.result = null;
}

MePresenter.prototype = new events.EventEmitter;

/*
 * Bind general app events
 */
MePresenter.prototype.bind = function (){
	// TODO Try insert data into view through event
	logger.trace("Bind MePresenter");
}

/*
 * UnBind general app events
 */
MePresenter.prototype.unbind = function(){
	logger.trace("UnBind MePresenter");
}

/*
 * reveal general app display
 */
MePresenter.prototype.revealDisplay = function(){
	logger.trace("MePresenter view reveal display");
	logger.debug("MePresenter Builded");
	

	var conString = "postgres://nuwa:nuwa@localhost/nuwa";

	var client = new pg.Client(conString);

	var that = this;

	client.connect(function(err) {
		if(err) {
			return console.error('could not connect to postgres', err);
		}
		client.query('SELECT username, mail, name, firstname FROM usr where id = 1', function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			logger.info(result.rows[0].username);
			// output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
			client.end();

			var parameters = {
				username: result.rows[0].username,
				email: result.rows[0].mail,
				name: result.rows[0].name,
				firstname: result.rows[0].firstname,
			}

			meView.setParameters(parameters);
			
			that.emit('revealed');
		});
	});
}

MePresenter.prototype.getDisplay = function(){
	return meView;
}

module.exports.Presenter = MePresenter;