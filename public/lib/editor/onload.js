Coding = function(){
	this.html = null;
	this.css = null;
	this.js = null;
	this.status = { "status": {
							"HTML": "NONE", 
							"CSS": "NONE", 
							"JS": "NONE"
								}
					};
	this.getState = function(editor){
		if(editor === "HTML"){
			return this.status.html;
		}else if (editor === "CSS"){
			return this.status.css;
		}else if (editor === "JS"){
			return this.status.js;
		} else {
			return "NONE";
		}
	};
}

var editors = new Coding();

var socket = io.connect("http://"+window.location.host, {
	'connect timeout': 10000,
    'reconnect': true,
    'reconnection delay': 500,
    'reopen delay': 1500,
    'max reconnection attempts': 10,
    'force new connection': false,
    'try multiple transports': true,
    'reconnection limit': Infinity,
    'sync disconnect on unload': false,
    'auto connect': true,

});
socket.on('connect', function () {
	var modificationcode = new Notifications();
	var message = new Notifications();

	socket.on('editByAnotherUser', function(data) {
		//alert('Une édition par un autre utilisateur a été effectuer sur le même code: ' + message);
		modificationcode.test(data)
		if(data.editor === "HTML"){
			editors.status.html = "EDITION_PENDING";

			var cursorpos = editors.html.getDoc().getCursor()
			editors.html.getDoc().setValue(data.code);
			editors.html.getDoc().setCursor(cursorpos);

			editors.status.html = "NONE";
		}else if(data.editor === "CSS"){
			editors.status.css = "EDITION_PENDING";
			
			var cursorpos = editors.css.getDoc().getCursor()
			editors.css.getDoc().setValue(data.code);
			editors.css.getDoc().setCursor(cursorpos);

			editors.status.css = "NONE";
		}else if (data.editor === "JS"){
			editors.status.js = "EDITION_PENDING";
			
			var cursorpos = editors.js.getDoc().getCursor()
			editors.js.getDoc().setValue(data.code);
			editors.js.getDoc().setCursor(cursorpos);

			editors.status.js = "NONE";
		}
	});

	socket.on('message', function(message_socket) {
		console.log("message: " + message_socket);
		message.notify(message_socket);
	});

	socket.on('saved', function(saved){
		if (saved){
			document.getElementById("interpreted_code").contentDocument.location.reload(true);
		}
	});
});

$(function() {
	CodeMirror.modeURL = "/public/dependencies/codemirror-3.21/mode/%N/%N.js";
	editors.js = CodeMirror.fromTextArea(document.getElementById("codejs"), {
		mode:  "javascript",
		theme: "twilight",
		lineNumbers: true,
		extraKeys: {
			"F11": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		}
	});

	editors.css = CodeMirror.fromTextArea(document.getElementById("codecss"), {
		mode:  "css",
		theme: "twilight",
		lineNumbers: true,
		extraKeys: {
			"F11": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			},
			"Ctrl-Space": "autocomplete",
		}
	});

	editors.html = CodeMirror.fromTextArea(document.getElementById("codehtml"), {
		mode:  "text/html",
		theme: "twilight",
		lineNumbers: true,
		extraKeys: {
			"F11": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			},
			"Ctrl-Space": "autocomplete",
		}
	});

	editors.html.setOption("mode", "text/html");
	CodeMirror.autoLoadMode(editors.html, "htmlmixed");

	editors.css.setOption("mode", "css");
	CodeMirror.autoLoadMode(editors.css, "css");

	editors.js.setOption("mode", "javascript");
	CodeMirror.autoLoadMode(editors.js, "javascript");
	var id = document.URL.split("/");
	id = id[id.length - 1];
	console.log("Id: "+id);
	editors.html.on('change', function(instance, changeObj){
		if(editors.getState("HTML") !== "EDITION_PENDING"){
			socket.emit('code_html', {code: editors.html.getValue(), editor: "code_html", id: id});
		}
	});

	editors.css.on('change', function(instance, changeObj){
		if(editors.getState("CSS") !== "EDITION_PENDING"){
			socket.emit('code_css', {code: editors.css.getValue(), editor: "code_css", id: id});
		}
	});

	editors.js.on('change', function(instance, changeObj){
		if(editors.getState("JS") !== "EDITION_PENDING"){
			socket.emit('code_js', {code: editors.js.getValue(), editor: "code_js", id: id});
		}
	});

	function getURL(url, c) {
		var xhr = new XMLHttpRequest();
		xhr.open("get", url, true);
		xhr.send();
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;
			if (xhr.status < 400) return c(null, xhr.responseText);
			var e = new Error(xhr.responseText || "No response");
			e.status = xhr.status;
			c(e);
		};
	}

	var server;
	getURL("http://"+window.location.host+"/public/dependencies/ternjs/defs/ecma5.json", function(err, code) {
		if (err) throw new Error("Request for ecma5.json: " + err);
		server = new CodeMirror.TernServer({defs: [JSON.parse(code)]});
		editors.js.setOption("extraKeys", {
			"Ctrl-Space": function(cm) { server.complete(cm); },
			"Ctrl-I": function(cm) { server.showType(cm); },
			"Alt-.": function(cm) { server.jumpToDef(cm); },
			"Alt-,": function(cm) { server.jumpBack(cm); },
			"Ctrl-Q": function(cm) { server.rename(cm); },
			"F11": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		});

		editors.js.on("cursorActivity", function(cm) { server.updateArgHints(cm); });
	});

	var message = new Notifications();
	$("form#js-option").submit(function(e) {
		e.preventDefault(); // Prevents the page from refreshing
		var $this = $(this); // `this` refers to the current form element
		$.post(document.URL + "/setOption",$this.serialize()
			).done(function(data) { 
				message.notify("Saved:: "+ data.message);
			}).fail(function(){
				message.notify("Error on save:: ");
			});
		});
});