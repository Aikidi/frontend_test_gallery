let uploadForm = document.querySelector('.upload-form');
let uploadField = document.querySelector('.upload-form__field');
let uploadFile = document.querySelector('.upload-form__link');
let uploadButton = document.querySelector('.upload-form__button');
let galleryList = document.querySelector('.gallery-list');
let listItems = document.querySelectorAll('.gallery-list__item');
let delButtons = document.querySelectorAll('.gallery-list__del-button');
let uploadzone= document.getElementById('uploadzone');

function delParent(evt) {
    evt.parentNode.parentNode.removeChild(evt.parentNode);
    resizeImage();
}

function createOneItem (oneItemUrl,  lastImg = false) {
    let listItem = document.createElement('li');
    let newImg = document.createElement('img'); 
    let delButton = document.createElement('button');
    
    delButton.onclick = function () { 
       delParent(this); 
    }

    listItem.classList.add('gallery-list__item');
    newImg.classList.add('gallery-list__img');

    if (lastImg) {
        newImg.onload = function () {
            resizeImage();
        }
    }

    delButton.classList.add('gallery-list__del-button');
    galleryList.append(listItem);
    listItem.append(newImg);
    listItem.append(delButton);
    newImg.setAttribute('src', oneItemUrl);
    uploadField.value = '';
}

function createItems (toDoItems, lastImg = false) {
    for (let oneItemUrl in toDoItems) {
        if (oneItemUrl == toDoItems.length-1) {
            lastImg = true; 
        }        
        createOneItem(toDoItems[oneItemUrl].url, lastImg);
    }
    uploadField.value = '';
}

function readURLJSON (fileUrl) {   
    if (uploadField.value === '') { 
        return true;
    }  

    fetch(fileUrl, 
                {
                method: 'GET',
                headers: { 'Content-Type': 'text/plain' }
                }
    ).then(function(response) { return response.json(); }
        ).then(function(data) { 
            createItems(data.galleryImages);
        }  
    );
};

function imageExists(url, callback) {
    let img = new Image();

    img.onload = function() { 
        callback(true); 
    };

    img.onerror = function() { 
        callback(false); 
    };
    
    img.src = url;
}

function chooseJSONorIMG(testURL = uploadField.value) {
    imageExists(testURL, function (exists) {
        if (exists) {
            createOneItem(testURL, true);
        } else {
            readURLJSON(testURL);
        }
    } );

    return true;
}

function onSabmitChoose(evt) {
    evt.preventDefault();  
    chooseJSONorIMG();
}

function onLocalUpload() {
    let curFiles = uploadFile.files;
    uploadField.value = URL.createObjectURL(curFiles[0]);
}

uploadForm.onsubmit = function (evt) {
    onSabmitChoose(evt);
}

function clearData() {
    uploadFile.value = null;
}

uploadField.onchange = function () {
    clearData();
}

uploadFile.onchange = function () {
    onLocalUpload();
}

uploadzone.onclick = function () {
    uploadFile.click(); 
}

uploadzone.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
});

uploadzone.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();
    let fileList = event.dataTransfer.files;

    for (var i = 0; i < fileList.length; i++) {
        let urlForDWL = URL.createObjectURL(fileList[i]) ;
        chooseJSONorIMG(urlForDWL);
    }

    uploadField.value = URL.createObjectURL(fileList[0]) ;

}); 