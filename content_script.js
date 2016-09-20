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

function notifyMe(text, imagelink) { //Notification with dynamic text
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('YouQueue', {
      icon: imagelink,
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
    addButton.setAttribute("id", "Youqueue-Add");

    btnImage = document.createElement("img");
    btnImage.setAttribute("src", "https://i.imgur.com/xzr5pVP.png");
    btnImage.align = "right";
    btnImage.height = "32";
    btnImage.width = "28";

    addButton.appendChild(btnImage);
    return addButton;
}


function setAddButton(){ //adds the button to the current youtube page
    var addButton = document.getElementById('Youqueue-Add');
    if(addButton == null){
        addButton = createAddButton();   //+ adds event listener + notification
    }

    var headlineTitle = $("#watch8-secondary-actions");
    var newHeadLine = $("div#info");
    if(typeof headlineTitle[0] != "undefined"){
        headlineTitle.append(addButton);
    } else if(typeof newHeadLine[0] != "undefined"){
        console.log("Fuck new youtube design...");
        // Polymer.dom(newHeadLine).appendChild(addButton)
        // newHeadLine.append(addButton);
    }

    addButton.addEventListener("click", function(){
        addToQueue(window.location.href);
        btnImage.setAttribute("src", "http://i.imgur.com/Ptyp4I6.png");
        addButton.disabled=true; //"prevents" duplicate added videos
    });
}

function addToQueue(url) {
    var id = youtubeLinkParsing(url);
    var video = {
        "id": id,
        "title": videoTitle
    };
    chrome.runtime.sendMessage(video);
    var notifyText = "Added "+ videoTitle +" to queue.";
    var thumbnail = document.getElementById('watch7-content').children[10].href;
    notifyMe(notifyText, thumbnail);
}

function afterNavigate() {
    if ('/watch' === location.pathname) {
        videoTitle = document.getElementById("eow-title").getAttribute("title");
        setAddButton();
    }
}
(document.body || document.documentElement).addEventListener('transitionend',
    function(/*TransitionEvent*/ event) {
        if (event.propertyName === 'width' && event.target.id === 'progress') {
            afterNavigate();
        }
    }, true);
// After page load

afterNavigate();

$(document).mousedown(function(e) {
    if (e.button == 2) {
        var title = $(e.target).attr('title');

        if(typeof title == 'undefined'){
            var link = $(e.target).closest('.yt-lockup-dismissable').find('.yt-lockup-title').children('a');
            if(typeof link != 'undefined'){
                title = link.attr('title');
            }
        }

        chrome.runtime.sendMessage({contextVidTitle: title});
    }
    return true;
});




