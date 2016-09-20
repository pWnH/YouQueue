var queue = chrome.storage.sync.get('playQueue', function() {}); //array to store video elements
if(!queue){
    queue = [];
}
var currentVideo = chrome.storage.sync.get('currentVideo', function() {}); //array to store video elements
if(typeof currentVideo == 'undefined' && typeof queue[0] != 'undefined'){
    currentVideo = queue.shift();
}
var playerTab;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.id){
        if(typeof currentVideo == 'undefined'){
            currentVideo = request;
            chrome.storage.sync.set({'currentVideo': request}, function() {});
        } else {
            queue.push(request); //adds the video element (see content_script.js => ln 65)
            chrome.storage.sync.set({'playQueue': queue}, function() {});
        }

        if(playerTab){
            chrome.tabs.sendMessage(playerTab, {}, function(response) {}); //Trigger for updating the current queue
        }
    } else {
        playerTab = sender.tab.id;
    }
});