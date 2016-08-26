
var youtubeLinkParsing = function(url){
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
    return match[2];
    } else {
    alert("Given url invalid.")
    }
}

var addButton = document.createElement("BUTTON");
addButton.setAttribute("class", "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-tooltip")

var image = document.createElement("img");
image.setAttribute("src", "http://i.imgur.com/W3pzJVA.png");
image.align = "right";
image.height = "30";
image.width = "30";
addButton.appendChild(image);

var playerWin;

addButton.addEventListener("click", function(){
    var id = youtubeLinkParsing(window.location.href);
    chrome.runtime.sendMessage(id);
    alert("Added "+ document.title +" to queue.");
    playerWin = window.open();
    playerWin.document.body.innerHTML = queue_player.html;

});

var headlineTitle = document.getElementById("watch8-secondary-actions");
headlineTitle.appendChild(addButton);
