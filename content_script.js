document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();s
});

var youtubeLinkParsing = function(url){
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
    return match[2];
    } else {
    alert("Given URL invalid: '" + url + "'")
    }
}

function notifyMe(text) {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('YouQueue', {
      icon: 'http://imgur.com/E7L5QMe.png',
      body: text,
    });

    notification.onclick = function () {
      window.open("chrome-extension://gdadllnmdbbggaoimbjckpadnhheladk/queue_player.html");      
    };
  }
}

var addButton;

function createAddButton(){
    addButton = document.createElement("BUTTON");
    addButton.setAttribute("class", "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-tooltip");
    addButton.setAttribute("title", "Add to queue");

    var image = document.createElement("img");
    image.setAttribute("src", "http://i.imgur.com/xzr5pVP.png");
    image.align = "right";
    image.height = "32";
    image.width = "28";

    addButton.appendChild(image);
}

function setAddButton(){
    createAddButton();
    var headlineTitle = document.getElementById("watch8-secondary-actions");
    headlineTitle.appendChild(addButton);

    addButton.addEventListener("click", function(){
        var id = youtubeLinkParsing(window.location.href);
        var video = {
            "id": id,
            "title": videoTitle
        };
        chrome.runtime.sendMessage(video);

        var notifyText = "Added "+ videoTitle +" to queue.";
        notifyMe(notifyText);
        image.setAttribute("src", "http://i.imgur.com/Ptyp4I6.png");
        addButton.disabled=true;
    });
}

setAddButton();

var videoTitle = document.getElementById("eow-title").getAttribute("title");




