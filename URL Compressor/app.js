const compressBtn = document.getElementById('compress-btn');
const reloadBtn = document.getElementById('reload-btn');

compressBtn.addEventListener('click', compressUrl);

function compressUrl() {
    var originalUrl = document.getElementById("originalUrl").value;
    var apiUrl = "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(originalUrl);

    compressedUrlTextarea = document.getElementById("compressedUrl");

    fetch(apiUrl).then(response => response.text()).then(data => {
        compressedUrlTextarea.value = data;
    }).catch(error => {
        compressedUrlTextarea.value = "Error : Url cannot be compressed (╥﹏╥)!";
    });
}

reloadBtn.addEventListener( 'click', () => {
    location.reload();

})