/* See LICENSE file for licensing details */

function EdBarDisableAkamai(event) {
  if (edBar.getAkamaiEnabled()) {
    edBar.setAkamaiEnabled(false);
    document.getElementById("EdBarDisableAkamaiButton").label = "Viewing Pre Live - Click To Change";
    gBrowser.reload();
  } else {
    edBar.setAkamaiEnabled(true);
    document.getElementById("EdBarDisableAkamaiButton").label = "Viewing Live - Click To Change";
    gBrowser.reload();
  }
}

Components.classes["@mozilla.org/observer-service;1"]
  .getService(Components.interfaces.nsIObserverService)
  .addObserver({
    observe: function(aSubject, aTopic, aData) {
      if ("http-on-modify-request" == aTopic) {
        var httpChannel = aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
        if (!edBar.getAkamaiEnabled() && (/example.com/.test(httpChannel.originalURI.host))) {
          httpChannel.setRequestHeader("X-Akamai-Cache-Control", "cache-bypass", false);
        }
      }
    }
  }, "http-on-modify-request", false);


var edBarListener = {
  QueryInterface: function(aIID)
  {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },

  onLocationChange: function(a, b, c, d) {},
  onStateChange: function(a, b, c, d) {},
  onProgressChange: function(a, b, c, d, e, f) {},
  onStatusChange: function(a, b, c, d) {},
  onSecurityChange: function(a, b, c) {}
};

var edBar = {
  akamaiEnabled: true,

  init: function() {
    // Listen for webpage loads
    gBrowser.addProgressListener(edBarListener);
  },
  
  uninit: function() {
    gBrowser.removeProgressListener(edBarListener);
  },

  setAkamaiEnabled: function(status) {
    this.akamaiEnabled = status;
  },

  getAkamaiEnabled: function() {
    return this.akamaiEnabled;
  }
};

window.addEventListener("load", function() {edBar.init()}, false);
window.addEventListener("unload", function() {edBar.uninit()}, false);
