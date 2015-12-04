$(document).ready(function () {
	loadNades();
	setBackground();

});

//** Globals **//

state = {
	addNade: false,
	boxNum: null
}



//** Functions **//

function setBackground () {
		var bg = map.tag;

		$('body').css('background', 'url(/images/backgrounds/'+bg+'.jpg) no-repeat center center fixed');
		$('body').css('-webkit-background-size', 'cover');
		$('body').css('-moz-background-size', 'cover');
		$('body').css('-o-background-size', 'cover');
		$('body').css('background-size', 'cover');
	}

function validateNewNade() {

	var errors = '';
	$("#errors").html('');

	// Check if nade type is selected
	if ($('#nade-type option:selected').val() == 'default') {
		errors += 'Please select a nade type. <br />';
	}

	// Check if nade team is selected
	if ($('#nade-team option:selected').val() == 'default') {
		errors += 'Please select a team. <br />';
	}

	// Check for nade title
	if ($('#nade-title').val().trim() == '') {
		errors += 'Please enter a nade title. <br />';
	}

	// Check for nade link
	if ($('#nade-link').val().trim() == '') {
		errors += 'Please enter a nade link. <br />';
	}


	$('#errors').append(errors);

	if (errors == '') {
		return true;
	} else {
		return false;
	}

}

function addNadeToMap(nade) {
	var elem = $('div[box-num="'+nade.box+'"]');
	var count = parseInt(elem.attr('count'));
	if (count == 0) {
		elem.append('<div class="nade-count">1</div>');
	} else {
		elem.find('.nade-count').text(count + 1);
	}
	elem.attr('count', count + 1);

}

function loadNades() {
	map.nades.forEach(function (nade) {
		addNadeToMap(nade);
	})
}

function listNades(num) {

	var source   = $("#entry-template").html();
	var template = Handlebars.compile(source);

	map.nades.forEach(function(nade) {
		if (nade.box == num || num == null) {
			$('#list-nades').append(template(nade));
		}
	});

}



//** Events **//

// Click on map squares
$('.map-box').on('click', function () {

	var boxNum = $(this).attr('box-num');

	if (state.addNade) {
		// Add nade
		$("#errors").html('');
		$('#add-nade').modal('show');
		state.boxNum = boxNum;
	} else {
		// Show nades
		if ($(this).find('.nade-count').length > 0) {
			listNades(boxNum);
			$('#list-nades-modal').modal('show');
		}
	}
});


// Add nade button
$('#add-nade-button').on('click', function () {
	state.addNade = true;
	$(this).text("Pick a spot on the map");
});

// Add nade close button
$('#nade-close').on('click', function () {
	$('#add-nade-button').text("Add a Nade");
});


// Add nade modal close
$('#add-nade').on('hidden.bs.modal', function () {
	state.addNade = false;
});


// List nades modal close
$('#list-nades-modal').on('hidden.bs.modal', function () {
	$('#list-nades').empty();
});

// All nades button
$('#all-nades-button').on('click', function () {
	listNades(null);
	$('#list-nades-modal').modal('show');
});


// Map select box
$('#map-select').on('change', function() {
	var nextMap = $(this).val();
	window.location.href = '/maps/' + nextMap;
});

// Nade submit
$('#nade-submit').on('click', function () {
	if(validateNewNade()) {

		$("#error").html("Submitting...");

		data = {
			map: map.tag,
			box: state.boxNum,
			type: $('#nade-type option:selected').val(),
			team: $('#nade-team option:selected').val(),
			title: $('#nade-title').val().trim(),
			description: $('#nade-description').val().trim(),
			link: $('#nade-link').val().trim(),
			rating: 0
		}


		$.ajax({
		 	type: "POST",
		 	url: '/ajax/newnade',
			data: data,
			datatype: "json",
			success: function () {
		  		$('#add-nade').modal('hide');
		  		$('#add-nade-button').text("Success!");
				addNadeToMap(data);
				map.nades.push(data);
		  		window.setTimeout(function() {
		  			$('#add-nade-button').text("Add a Nade");
		  		}, 5000);

		  	}
		});
	}
});
