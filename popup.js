var background = chrome.extension.getBackgroundPage();

var btn = document.getElementById('playerBtn');
btn.addEventListener("click",function () {
        var player = window.open('queue_player.html');
  });

var text = document.createElement('p');
text.id = "queue-text-p";
text.textContent = background.queue.length;

document.getElementById('queue-text').appendChild(text);