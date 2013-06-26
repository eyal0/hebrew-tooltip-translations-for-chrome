function xhr(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = xhr.responseText;
        callback(data);
      } else {
        callback(null);
      }
    }
  }
  // Note that any URL fetched here must be matched by a permission in
  // the manifest.json file!
  xhr.open('GET', url, true);
  xhr.send();
};

/**
 * Handles data sent via chrome.extension.sendRequest().
 * @param request Object Data sent in the request.
 * @param sender Object Origin of the request.
 * @param callback Function The method to call when the request completes.
 */
function onRequest(request, sender, callback) {
  if (request.action == 'xhr') {
    xhr(request.url, callback);
  } else if(request.action == 'localStorage_set') {
    localStorage[request.attribute] = JSON.stringify(request.value || null);
    
    callback();
  } else if(request.action == 'localStorage_get') {
    callback(JSON.parse(localStorage[request.attribute] || null) || null);
  }
};

// Wire up the listener.
chrome.extension.onRequest.addListener(onRequest);