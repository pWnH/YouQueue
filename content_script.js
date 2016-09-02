document.addEventListener('DOMContentLoaded', function () { 
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

var youtubeLinkParsing = function(url){ // gets the id of the video
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
    return match[2];
    } else {
    alert("Given URL invalid: '" + url + "'")
    }
};

function notifyMe(text) { //Notification with dynamic text
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('YouQueue', {
      icon: 'http://imgur.com/E7L5QMe.png',
      body: text
    });

    notification.onclick = function () {
      window.open("chrome-extension://gdadllnmdbbggaoimbjckpadnhheladk/queue_player.html");      
    };
  }
}

//Add to queue button variables
var btnImage;
var videoTitle = "";

function createAddButton(){ //creates the add to queue button + image
    var addButton;
    addButton = document.createElement("BUTTON");
    addButton.setAttribute("class", "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-tooltip");
    addButton.setAttribute("title", "Add to queue");

    btnImage = document.createElement("img");
    btnImage.setAttribute("src", "http://i.imgur.com/xzr5pVP.png");
    btnImage.align = "right";
    btnImage.height = "32";
    btnImage.width = "28";

    addButton.appendChild(btnImage);
    return addButton;
}

function setAddButton(){ //adds the button to the current youtube page 
    var addButton = createAddButton();   //+ adds event listener + notification
    var headlineTitle = $("#watch8-secondary-actions");
    var newHeadLine = $("div#info");
    if(typeof headlineTitle[0] != "undefined"){
        headlineTitle.append(addButton);
    } else if(typeof newHeadLine[0] != "undefined"){
        console.log("newheadlin");
        newHeadLine.append(addButton);
    }

    addButton.addEventListener("click", function(){
        var id = youtubeLinkParsing(window.location.href);
        var video = {
            "id": id,
            "title": videoTitle
        };
        chrome.runtime.sendMessage(video);

        var notifyText = "Added "+ videoTitle +" to queue.";
        notifyMe(notifyText);
        btnImage.setAttribute("src", "http://i.imgur.com/Ptyp4I6.png");
        addButton.disabled=true; //"prevents" duplicate added videos
    });
}

setAddButton();
var newTitle = $("yt-formatted-string[class~='ytd-video-primary-info-renderer']").text();

if(typeof newTitle !== 'undefined'){
    videoTitle = newTitle;
} else {
    videoTitle = document.getElementById("eow-title").getAttribute("title");
}






