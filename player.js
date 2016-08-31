var background = chrome.extension.getBackgroundPage(); //allows communication with background page

//Creates a list of names from the currently added videos
var list = document.createElement('ul');

background.queue.forEach(function(element) {
    var listitem = document.createElement('li');
    listitem.innerText = element.title;
    list.appendChild(listitem);
}, this);


var player = document.getElementById("player");
player.appendChild(list);
