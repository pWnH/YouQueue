var queue = []; //array to store video elements

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    queue.push(response); //adds the video element (see content_script.js => ln 65)
});
