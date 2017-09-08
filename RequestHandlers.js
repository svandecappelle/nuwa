var url = require('url');
var log4js = require('log4js');
var logger = log4js.getLogger('RequestHandlers');
	
var settings = require("settings");
projModule = requireSrc("projects/presenter/Presenter");
indexModule = requireSrc("index/presenter/IndexPresenter")
interpretorModule = requireSrc("interpretor/presenter/InterpretorPresenter")
meModule = requireSrc("me/presenter/MePresenter")

function RequestHandlers(){

}

// GETs
RequestHandlers.prototype.index = function($request, $response) {
	logger.debug("Le gestionnaire 'index' est appelé.");
	return this.runView($request, $response, indexModule);
}

RequestHandlers.prototype.editor = function($request, $response) {
	logger.debug("Le gestionnaire 'index' est appelé.");
  	editorModule = requireSrc("editor/presenter/EditorPresenter")
	return this.runView($request, $response, editorModule);
}

RequestHandlers.prototype.interpretor = function($request, $response){
	logger.info("L'interpreteur de code est appelé.");
	return this.runView($request, $response, interpretorModule);
}

RequestHandlers.prototype.dynamicEditor = function($response, $params){
	editorModule = requireSrc("editor/presenter/EditorPresenter");
	return this.runDynamicView($response, $params, editorModule);
}

RequestHandlers.prototype.dynamicProject = function($response, $params){
	projectModule = requireSrc("complex-project/index/presenter/Presenter");
	return this.runDynamicView($response, $params, projectModule);
}

RequestHandlers.prototype.dynamicInterpretor = function($response, $params){
	editorModule = requireSrc("interpretor/presenter/InterpretorPresenter")
	return this.runDynamicView($response, $params, editorModule);
}

RequestHandlers.prototype.runDynamicView = function($response, $params, $view_module){
	var presenter = new $view_module.Presenter();
	
	presenter.bind();

	if(typeof(presenter.on) === 'function'){
		presenter.on('revealed', function(){
			$response.write(presenter.getDisplay().asString());
			$response.end();
		});
	}else{
		presenter.setResult($response);
	}

	if(typeof(presenter.parameter) === 'function'){
		presenter.parameter($params);
	}

	return presenter.revealDisplay();
}

RequestHandlers.prototype.runView = function($request, $response, $view_module){
	logger.info($request.url);
	var presenter = new $view_module.Presenter();
	
	presenter.bind();

	if(typeof(presenter.on) === 'function'){
		presenter.on('revealed', function(){
			$response.write(presenter.getDisplay().asString());
			$response.end();
		});
	}else{
		presenter.setResult($response);
	}

	if(typeof(presenter.parameter) === 'function'){
		var url_parts = url.parse($request.url, true);
		var query = url_parts.query;
		logger.info(query);
		presenter.parameter(query);
	}

	return presenter.revealDisplay();
}

RequestHandlers.prototype.me = function($request, $response){
	logger.debug("La vue me est appelé.");
  	return this.runView($request, $response, meModule);
}

RequestHandlers.prototype.projects = function($request, $response){
	logger.debug("La vue projects est appelé.");
  	return this.runView($request, $response, projModule);
}

// POSTs
RequestHandlers.prototype.save = function($request, $response){
	$response.write("Saved");
	$response.end();
	return;
}

RequestHandlers.prototype.createproj = function($request, $response){
	logger.info("createproj");
	var type = "project";
	if($request.body.snippet){
		type = "snippet";
	}

	var projectEngineModule = requireSrc("projects/engine/Project");
	var project = new projectEngineModule.Project();
	project.create(1, $request.body.name, type);
	project.on("created",function (){
		$response.json({
			data: 'true'
		});
		$response.end();
	});

	project.on("SQL-Error",function (){
		$response.json({
			data: 'false'
		});
		$response.end();
	});
}

RequestHandlers.prototype.upload = function($request, $response) {
	logger.debug("Le gestionnaire 'upload' est appelé.");
	return "<!--Uploader-->";
}

RequestHandlers.prototype.changeOptions = function($request, $response){
	//req.body.jslibrary
	var libraryjs = $request.body.jslibrary;
	var $editorModule = requireSrc("editor/presenter/EditorPresenter");
	var presenter = new $editorModule.Presenter();
	presenter.bind();
	presenter.post('js', $request);
	
	presenter.on('saved', function($post_response){
		$response.json({
			message: $post_response
		});
		$response.end();
	});
}

exports.RequestHandlers = RequestHandlers;