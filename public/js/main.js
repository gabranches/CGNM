$(document).ready(function () {

});

//** Globals **//

state = {
	addNade: false
}

//** Events **//

// Click on map squares
$('.map-box').on('click', function () {

	var boxNum = $(this).attr('box-num');

	if (state.addNade) {
		// Add nade
		$('#add-nade').modal('show');
	} else {
		// Show nades

	}
});


// Add nade button
$('#add-nade-button').on('click', function () {
	state.addNade = true;
	$(this).text("Select a spot on the map");
});


// Add nade modal close
$('#add-nade').on('hidden.bs.modal', function () {
	state.addNade = false;
	$('#add-nade-button').text("Add a nade");
});
