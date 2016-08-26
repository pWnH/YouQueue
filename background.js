var queue = new Array();

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    var count  = queue.push(response);
    alert("In queue: " + count);
});
