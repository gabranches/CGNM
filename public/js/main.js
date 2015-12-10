$(document).ready(function () {
	loadNades();
	setBackground();

	$('#map-title').html(map.name);

	// Sort nade list
	map.nades.sort(function(a, b) {
	    return parseFloat(b.rating) - parseFloat(a.rating);
	});
});

//** Globals **//

state = {
	addNade: false,
	boxNum: null,
	type: 'default',
	team: 'default'
}


//** Functions **//

function setBackground () {
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	if (w > 800) {
		var bg = map.tag;
		$('body').css('background', 'url(/images/backgrounds/'+bg+'.jpg) no-repeat center center fixed');
		$('body').css('-webkit-background-size', 'cover');
		$('body').css('-moz-background-size', 'cover');
		$('body').css('-o-background-size', 'cover');
		$('body').css('background-size', 'cover');
	} else {
		$('body').css('background-color', 'black');
	}
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


function passFilter(nade) {
	var pass = true;

	if (state.type != nade.type && state.type != 'default') {
		pass = false;
	}

	if (state.team != nade.team && state.team != 'default') {
		pass = false;
	}

	return pass;
}


function addNadeToMap(nade) {
	var elem = $('div[box-num="'+nade.box+'"]');
	var count = parseInt(elem.attr('count'));
	if (nade.removed != 1 && passFilter(nade)) {
		if (count == 0) {
			elem.append('<div class="nade-count">1</div>');
		} else {
			elem.find('.nade-count').text(count + 1);
		}
		elem.attr('count', count + 1);
	}

}

function loadNades() {
	$('.map-box').empty();
	$('.map-box').attr('count', '0');

	map.nades.forEach(function (nade) {
		addNadeToMap(nade);
	});
}

function listNades(num) {

	var source   = $("#entry-template").html();
	var template = Handlebars.compile(source);

	map.nades.forEach(function(nade) {
		if (nade.box == num || num == null) {
			if (nade.removed != 1 && passFilter(nade)) {
				$('#list-nades').append(template(nade));
			}
		}
	});

}

function vote(id, choice) {

	var vote = {id: id, choice: choice, map: map.tag};

	$.ajax({
	 	type: "POST",
	 	url: '/ajax/vote',
		data: vote,
		datatype: "json",
		success: function (res) {
			res = JSON.parse(res);
			if (res.error) {
				alert(res.error);
			} else {
				$('#' + id).text(res.rating);
				// Change nade rating in front end array
				var nade = getElement(map.nades, '_id', id);
				if (choice == 'up') {
					nade.rating++;
				} else {
					nade.rating--;
				}
			}
	  	}
	});
}

function deleteNade(id, session) {

	var data = {id: id, sessionID: session, map: map.tag};

	$.ajax({
	 	type: "POST",
	 	url: '/ajax/remove',
		data: data,
		datatype: "json",
		success: function (res) {
			res = JSON.parse(res);
			if (res.error) {
				alert(res.error);
			} else {
				window.location.href = '/maps/' + map.tag;
			}
	  	}
	});
}


function getElement (arr, key, value) {
    return arr.filter(function (elem) {
       return elem[key] == value;
    })[0];
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
		$('.map-box').css('cursor', 'pointer');
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
	$(this).text("Pick a spot");
	$('.map-box').css('cursor', 'crosshair');
});


// Add nade modal close
$('#add-nade').on('hidden.bs.modal', function () {
	$('#add-nade-button').text("Add a Nade");
	state.addNade = false;
	$('.map-box').css('cursor', 'pointer');
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

// Vote up
$(document).on('click', '.glyphicon-triangle-top', function() {
	var id = $(this).parent().parent().attr('data-id');
	vote(id, "up");
});

// Vote down
$(document).on('click', '.glyphicon-triangle-bottom', function() {
	var id = $(this).parent().parent().attr('data-id');
	vote(id, "down");
});

// Map select box
$('#map-select').on('change', function() {
	var nextMap = $(this).val();
	window.location.href = '/maps/' + nextMap;
});

// Delete button
$(document).on('click', '.delete-button', function () {
	var id = $(this).parent().parent().attr('data-id');
	var r = confirm("This will delete your nade. Are you sure?");
	if (r == true) {
		deleteNade(id, session);
	}
});



// Toggle filters
$('#filter').click(function () {
	$('#filter-options').toggle();
});

// Filter button hover
$('#filter').mouseenter(function () {
	$('#filter-label').show();
});

$('#filter').mouseleave(function () {
	$('#filter-label').hide();
});

// Filter options change

$('#filter-nade-team').on('change', function () {
	state.team = $(this).val();
	loadNades();
});

$('#filter-nade-type').on('change', function () {
	state.type = $(this).val();
	loadNades();
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
			link: $('#nade-link').val().trim()
		}


		$.ajax({
		 	type: "POST",
		 	url: '/ajax/newnade',
			data: data,
			datatype: "json",
			success: function (res) {
				res = JSON.parse(res);

				if (res.error) {
					alert(res.error);
				} else {
					window.location.href = '/maps/' + map.tag;
				}
		  	}
		});
	}
});


