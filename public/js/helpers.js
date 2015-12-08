Handlebars.registerHelper('creatorHelper', function(creator, id) {
	if (creator == session) {
		return '<span class="delete-button">[delete]</span>'
	} else {
		return ''
	}
});