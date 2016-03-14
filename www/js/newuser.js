// This is a JavaScript file
    
function capturePhoto() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 25, destinationType: Camera.DestinationType.DATA_URL, targetWidth: 280, targetHeight: 210});
}

//Callback function when the picture has been successfully taken
function onPhotoDataSuccess(imageData) {                
    // Get image handle
    var smallImage = document.getElementById('smallImage');

    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
    
}

//Callback function when the picture has not been successfully taken
function onFail(message) {
    alert('Failed to load picture because: ' + message);
}
