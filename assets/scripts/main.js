

'use strict';

const offsets 			= [240, 350, 400, 500, 640, 700];
const {floor, random}	= Math;

window.addEventListener('load', function() {
	const place = floor(offsets.length * random());

	document.body.style.backgroundPosition
		= `0px -${offsets[place]}px`;
});