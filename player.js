var background = chrome.extension.getBackgroundPage(); //allows communication with background page
var list;
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    var video = background.queue[0];
    var videoId = "hLpfwI3SFNk";
    if(typeof video != "undefined"){
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
        console.log(background.queue);
        if(typeof vidId != "undefined"){
            player.loadVideoById(vidId.id);
            $('#songname').text(vidId.title);
            updateQueueList();
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
        oldQueue.forEach(function(video) {
            if(video.id === id)
            {
                newQueue.push(video);
            }
        }, this);
    });
    background.queue = newQueue;
}

/**
 * Creates a list of names from the currently added videos
 */
function updateQueueList()
{

    if(typeof list != "undefined"){
        document.getElementById("queue-items").removeChild(list);
    }
    list = document.createElement('ul');
    list.setAttribute("id","sortable")
    background.queue.forEach(function(element, index) {
        //Dont show the current song playing in the queue
        if(index != 0){
            var listitem = document.createElement('li');
            listitem.innerText = element.title;
            listitem.setAttribute('id', element.id);
            listitem.setAttribute('class',"ui-state-default");
            list.appendChild(listitem);
        }
        $('#queue-count').text(index);
        
    });

    document.getElementById("queue-items").appendChild(list);
    $('#sortable').sortable(
        {
            stop: function(event, ui){
                var data = $(this).sortable('toArray');
                console.log(data);
                afterSort(data);
            }
        }
    );
}

