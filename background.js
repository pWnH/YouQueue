var queue = [];

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    var count  = queue.push(response);
});
