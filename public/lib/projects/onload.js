$(function() {
	var message = new Notifications();

	// initalize popup
	$('#create').magnificPopup({
		key: 'my-popup', 
		midClick: true,
		type: 'inline',
		items: {
			src: '#newproject',
			type: 'inline'
		},

		callbacks: {
			markupParse: function(template, values, item) {
				console.log('new Project');
				// optionally apply your own logic - modify "template" element based on data in "values"
				// console.log('Parsing:', template, values, item);
			}
		}
	});

	$("form#createproj").submit(function(e) {
		e.preventDefault(); // Prevents the page from refreshing
		var $this = $(this); // `this` refers to the current form element
		$.post("/projects/create",$this.serialize()
			).done(function(data) { 
				message.notify("Saved:: "+ data.data);
				$.magnificPopup.close();
			}).fail(function(){
				message.notify("Error on save:: ");
			});
		});
});