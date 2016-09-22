var background = chrome.extension.getBackgroundPage(); //allows communication with background page
var list;

chrome.runtime.sendMessage({}, function() {}); //Send Message to get tabId in Backgroundscript

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        updateQueueList();
    }
);


// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    var video = background.currentVideo;
    var videoId = "hLpfwI3SFNk";
    if(typeof video != "undefined" && video !== false){
        videoId = video.id;
        $('#songname').text(video.title);
    }
    player = new YT.Player('player', {
        videoId: videoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        width: '100%',
        playerVars: {
            origin: 'chrome-extension://okdocgdaofaeiolddgcielochfgacaan/',
            enablejsapi: 1
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
    updateQueueList();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when a video is finished playing (state = 0) the next
//    video should be started
var done = false;
function onPlayerStateChange(event) {
    if (event.data == 0) {
        var vidId = background.queue.shift();
        if(typeof vidId != "undefined"){
            background.currentVideo = vidId;
            chrome.storage.sync.set({'currentVideo': vidId}, function() {});
            player.loadVideoById(vidId.id);
            $('#songname').text(vidId.title);
            updateQueueList();
        } else {
            background.currentVideo = false;
            chrome.storage.sync.set({'currentVideo': false}, function() {});
        }
    }
}
function stopVideo() {
    player.stopVideo();
}

function afterSort(newSort){
    var newQueue = [];
    var oldQueue = background.queue;
    newSort.forEach(function(id){
        var found = false;
        oldQueue.forEach(function(video) {
            if(video.id === id && !found)
            {
                found = true;
                newQueue.push(video);
            }
        }, this);
    });
    background.queue = newQueue;
    chrome.storage.sync.set({'playQueue': background.queue}, function() {});
}

/**
 * Creates a list of names from the currently added videos
 */
function updateQueueList()
{
    chrome.storage.sync.set({'playQueue': background.queue}, function() {});
    if(typeof list != "undefined"){
        document.getElementById("queue-items").removeChild(list);
    }
    list = document.createElement('ul');
    list.setAttribute("id","sortable");
    list.setAttribute("class","list-group");
    $('#queue-count').text(0);
    background.queue.forEach(function(element, index) {
        var listitem = document.createElement('li');
        listitem.innerHTML = "<button id='del-"+element.id+"' class='btn btn-default'>" +
                                "<span class='glyphicon glyphicon-trash' aria-hidden='true'></span>" +
                             "</button>" +
                             "<span class='queueTitle'>"+element.title+"</span>" +
                             "<span class='pull-right'>("+element.added+")</span>";
        listitem.setAttribute('id', element.id);
        listitem.setAttribute('class',"ui-state-default list-group-item");
        list.appendChild(listitem);
        $('#queue-count').text(index+1);
        
    });

    document.getElementById("queue-items").appendChild(list);
    $('#sortable').sortable(
        {
            stop: function(event, ui){
                var data = $(this).sortable('toArray');
                afterSort(data);
            }
        }
    );
}

$( "#skipSong" ).click(function() {
    onPlayerStateChange({data: 0});
});

$(document).on('click', '[id^=del-]', function() {
    var videoId = $(this).attr('id').replace('del-', '');
    var removed = false;
    //Only removes the first item with the matching video id right now
    background.queue.forEach(function(element, index) {
        if(element.id == videoId && !removed){
            background.queue.splice(index, 1);
            updateQueueList();
            removed = true;
        }
    });
});