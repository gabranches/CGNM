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
	} else {
		// Show nades
	}
});
