var $CodeTools = {
	actions: {
		save : function(){
			prompt('Save?');
		},
		showToggle: function($elem){
			if(!$($elem).parent().find('.options-bar').hasClass("active")){
				$($elem).parent().find('.options-bar').addClass("active");
				$($elem).addClass("active");
			}else{
				$($elem).parent().find('.options-bar').removeClass("active");
				$($elem).removeClass("active");
			}
		}
	}
};

var Notifications = function Notifications() {
	this.newMessages = false;
	this.delay = function(callback, ms){
		var timer = 0;
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
	this.notify = function($message){
		//alert($message);
		$('#messages').fadeIn().delay(3000).fadeOut(500);
		$("#messages > .text").text($message);
	};
	this.test = function($message){
		var that = this;
		//alert($message);
		if ( !$("#messages").is(":visible") ){
			console.log("print new message");
			//$('#messages').;
			
			var callback = function(){
				console.log("test new message: " + that.newMessages);
				if (!that.newMessages){
					that.newMessages = false;
					$('#messages').fadeOut(500);
				}else{
					that.newMessages = false;
					that.delay(callback, 3000);
				}
			};
			this.delay(callback, 3000);
			
			$('#messages').fadeIn();
		}else{
			console.log("New message but message banner already visible");
			that.newMessages = true;	
		}
		
		$("#messages > .text").text("New code: "+$message.code);
	};
};