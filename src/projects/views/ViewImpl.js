var log4js = require('log4js');
var logger = log4js.getLogger('Project');

var jade = require('jade');

ViewImpl = {
	parameters : null
}

/*
 * Get as String HTML View
 */
 function asString(){
	logger.debug("Get string interpretor representation");
	
	if (ViewImpl.parameters == null){
		logger.warn("No parameters to view.");
	}
	
	var html = jade.renderFile(getViewPath('projects'), ViewImpl.parameters);
	
	return html;
}


function setParameters($params){
	logger.debug("Set parameters to view: " + $params);
	ViewImpl.parameters = $params; 
}


exports.asString = asString;
exports.setParameters = setParameters;