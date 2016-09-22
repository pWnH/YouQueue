var queue = chrome.storage.sync.get('playQueue', function() {}); //array to store video elements
if(!queue){
    queue = [];
}
var currentVideo = chrome.storage.sync.get('currentVideo', function() {}); //array to store video elements
if(typeof currentVideo == 'undefined' && typeof queue[0] != 'undefined'){
    currentVideo = queue.shift();
}
var playerTab;
var contextTitle = '';
var contextImg = '';
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.id){
        addSongToQueue(request);

        if(playerTab){
            chrome.tabs.sendMessage(playerTab, {}, function(response) {}); //Trigger for updating the current queue
        }
    } else if(request.contextVidTitle){
        contextTitle = request.contextVidTitle;
        contextImg = request.contextImg;
    } else {
        playerTab = sender.tab.id;
    }
});

function addSongToQueue(video)
{
    if(typeof currentVideo == 'undefined'){
        currentVideo = video;
        chrome.storage.sync.set({'currentVideo': video}, function() {});
    } else {
        var currentdate = new Date();
        video.added = currentdate.timeNow();
        queue.push(video); //adds the video element (see content_script.js => ln 65)
        chrome.storage.sync.set({'playQueue': queue}, function() {});
    }
}

function youtubeLinkParsing (url){ // gets the id of the video
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        alert("Given URL invalid: '" + url + "'");
        return false;
    }
}

var contextHandler = function(e) {
    var url = e.linkUrl;
    var videoId = youtubeLinkParsing(url);

    if(videoId !== false){
        addSongToQueue({id: videoId, title: contextTitle});
        var notifyText = "Added "+ contextTitle +" to queue.";
        notifyBackground(notifyText, contextImg);
        if(playerTab){
            chrome.tabs.sendMessage(playerTab, {}, function(response) {}); //Trigger for updating the current queue
        }
    }
};

function notifyBackground(text, imagelink) { //Notification with dynamic text
    var notification = new Notification('YouQueue', {
        icon: imagelink,
        body: text
    });

    notification.onclick = function () {
        window.open('queue_player.html');
    };
}

chrome.contextMenus.create({
    "title": "Add to YouQueue",
    "contexts": ["link"],
    "onclick" : contextHandler
});

Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
};