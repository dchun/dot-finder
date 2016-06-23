var cv = require('opencv');

function detect(image, name) {
	var lowThresh = 50;
	var highThresh = 125;
	var maxArcLength;

	var GREEN = [0, 255, 0]; // B, G, R
	var WHITE = [255, 255, 255]; // B, G, R
	var RED   = [0, 0, 255]; // B, G, R

	var dotCount = 0;

  return new Promise(function (resolve, reject){

		cv.readImage(image, function(err, im) {
		  if (err) reject(err);
		  var width = im.width();
		  var height = im.height();
		  if (width < 1 || height < 1) throw new Error('Image has no size');
			
			maxArcLength = (height / 10);

			counted = im.copy();
		  im.convertGrayscale();
		  im.gaussianBlur([11,11]);
		  im_canny = im.copy();

		  im_canny.canny(lowThresh, highThresh);

		  contours = im_canny.findContours();
			
			dotCount = 0;

			// only draw and count found contours within range of deinfed length
		  for(i = 0; i < contours.size(); i++) {
		    if(contours.arcLength(i, true) < maxArcLength) {
		      counted.drawContour(contours, i, GREEN, 3);
		      dotCount += 1;
		    }
		  }

		  counted.save('./uploads/modified/contour_' + name);
		  console.log('Image saved');
		  resolve(dotCount);

		});
  
  });

}

module.exports = { detect };