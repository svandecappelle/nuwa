DBSettings = {
	host: 'localhost',
	user: 'nuwa',
	passwd: 'nuwa',
	database: 'nuwa'
}


module.exports = {
    POST_MAX_SIZE : 40 , //MB
    UPLOAD_MAX_FILE_SIZE: 40, //MB
    PROJECT_DIR : __dirname,

    DB: DBSettings,
    app: {
		server : {
			port: 9000,
		}
	}
};

global.requireSrc = function($path){
	var settings =require("settings");
    return require(settings.PROJECT_DIR + '/src/' +$path);
}

global.getViewPath = function($module){
	var settings = require("settings");
	return settings.PROJECT_DIR + '/src/' + $module + '/views/template.jade';
}

global.getView = function($module){
	var settings = require("settings");
	return require(settings.PROJECT_DIR + '/src/' + $module + '/views/ViewImpl');
}