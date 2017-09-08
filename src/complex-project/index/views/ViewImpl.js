var log4js = require('log4js');
var logger = log4js.getLogger('Index');

var jade = require('jade');
var settings = require("settings");

DefaulIndex = {
	parameters : null
}

/*
 * Get as String HTML View
 */
var asString = function(){
	logger.debug("Get string index representation");
	
	if (DefaulIndex.parameters == null){
		logger.warn("No parameters to view.");
	}

	var html = jade.renderFile(getViewPath('complex-project/index'), DefaulIndex.parameters);
	return html;
}

function setParameters($params){
	logger.debug("Set parameters to view: " + $params);
	DefaulIndex.parameters = $params; 
}

exports.asString = asString;
exports.setParameters = setParameters;