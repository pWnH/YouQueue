var background = chrome.extension.getBackgroundPage();

var btn = document.getElementById('playerBtn');
btn.addEventListener("click",function () {
        var player = window.open('queue_player.html'); //Calls "queue_player" page
  });

//sets a text in the popup which shows the current count of videos in queue
var text = document.createElement('p');
text.id = "queue-text-p";
var queueCount = background.queue.length;
console.log(background.currentVideo);
if(typeof background.currentVideo != 'undefined'){
    queueCount++;
}
text.textContent = queueCount;

document.getElementById('queue-text').appendChild(text);