function mathForResize(imgForMath, rowWidth, difWidth ) {
	let ImagePercent =  (100 * imgForMath.clientWidth / rowWidth);
	let PixelAdd = Math.round(difWidth*ImagePercent/100)-1;
	let ImagePercentAdd = ((imgForMath.clientWidth + PixelAdd)*100/imgForMath.naturalWidth);
	let listImgWidth = Math.round(imgForMath.naturalWidth * ImagePercentAdd / 100)-3;
	return listImgWidth;
}

function baseResize( imgForResize, initRowHeight = 150) {
	return imgForResize.naturalWidth *  initRowHeight / imgForResize.naturalHeight;
}

function resizeImage(screenWidth = 0) {

	if (screenWidth === 0) {
		screenWidth = document.documentElement.clientWidth;
	}

	if (screenWidth > 860) {
		screenWidth = 860;
	}

	if (screenWidth < 320) {
		screenWidth = 320;
	}

	let listImgWidth;
	let galleryListImges = document.querySelectorAll('.gallery-list__img');
	let numLastInRow = 0; //№ последней картинки в строке
	let rowWidth = 0; //текущая ширина строки (сумма картинок в строке)
	let avgImgWidth = 0; //средняя ширина картинки в строке
	let difWidth = 0; //разница между нужной шириной строки и текущей шириной
	let count = 0; //№ текущей картинки
	let imgInRowCount = 0; //№ текущей картинки в строке
	let initRowHeight = 150; //Предполагаемая начальная высота строки
	let lastInRow = false; //Флаг того, что картинка последняя в ряду

	for (let img of galleryListImges) {

		if (!lastInRow) {
			listImgWidth = baseResize(img, initRowHeight);
			img.style.width = listImgWidth + 'px';
			rowWidth = rowWidth + listImgWidth;
			difWidth = screenWidth - rowWidth;
		} else {
			rowWidth = 0;	
			difWidth = screenWidth; 
			imgInRowCount = 0; 
			lastInRow = false;	
		}

		count = count + 1;
		imgInRowCount = imgInRowCount + 1;
		avgImgWidth = rowWidth / imgInRowCount;

		let rowRealWidth = 0;

		if (difWidth <= avgImgWidth && galleryListImges.length != count ) {
			let nextImgWidth = baseResize(galleryListImges[count], initRowHeight);
			let lastElement = count - 1;

			if (nextImgWidth >= difWidth * 1.2 || nextImgWidth < difWidth) {
				imgInRowCount = 0;
			} else {
				lastElement = count ;
				galleryListImges[count].style.width = nextImgWidth + 'px';
				rowWidth = rowWidth + nextImgWidth ; 
				difWidth = nextImgWidth - difWidth ;
				lastInRow = true;
			}

			for (var i = numLastInRow; i <= lastElement; i++) {
				correctImgWidth = mathForResize(galleryListImges[i], rowWidth, difWidth) ;

				if (i == lastElement) { 
					correctImgWidth = screenWidth - rowRealWidth -2; 
				}	
							
				rowRealWidth = rowRealWidth + correctImgWidth + 2;
				galleryListImges[i].style.width = correctImgWidth + 'px';
			}

			rowWidth = rowWidth * (lastElement - count + 1) - nextImgWidth * (lastElement - count + 1);
			numLastInRow = count + (lastElement - count +1 ) ; 
		}	

		if ( (galleryListImges.length == count) && ( (difWidth < screenWidth/2) || (screenWidth < 480) ) ) {

		 	for (var i = numLastInRow; i < count; i++) {
		 		correctImgWidth = mathForResize(galleryListImges[i], rowWidth, difWidth) ;

				if (i == count -1) { 
					correctImgWidth = screenWidth - rowRealWidth - 2; 
				}

				rowRealWidth =  rowRealWidth + correctImgWidth + 2;
				galleryListImges[i].style.width = correctImgWidth + 'px';
			}
		}
	}
}

window.onload = function () {
	resizeImage();
}

window.onresize= function () {
	resizeImage();
}