$(document).ready(function () {

});

//** Globals **//

state = {
	addNade: false,
	boxNum: null
}



//** Function **//

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

	// Check for nade name
	if ($('#nade-name').val().trim() == '') {
		errors += 'Please enter a nade name. <br />';
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

	}
});


// Add nade button
$('#add-nade-button').on('click', function () {
	state.addNade = true;
	$(this).text("Select a spot on the map");
});

// Add nade close button
$('#nade-close').on('click', function () {
	$('#add-nade-button').text("Add a nade");
});


// Add nade modal close
$('#add-nade').on('hidden.bs.modal', function () {
	state.addNade = false;
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
			name: $('#nade-name').val().trim(),
			description: $('#nade-description').val().trim(),
			link: $('#nade-link').val().trim()
		}

		$.ajax({
		 	type: "POST",
		 	url: '/ajax/newnade',
			data: data,
			datatype: "json",
			success: function (data) {
		  		$('#add-nade').modal('hide');
		  		$('#add-nade-button').text("Success!");
		  		window.setTimeout(function() {
		  			$('#add-nade-button').text("Add a nade");
		  		}, 5000);

		  	}
		});
	}
});
