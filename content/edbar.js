/* See LICENSE file for licensing details */

function EdBarSiteDown(event) {
  window._content.document.location = "mailto:tomsinger@gmail.com&subject=[edbar] Site Down&body=Please Enter Any details Here\n\nPlease do not change any information below this line.\n\n---------------------------------------------\n\nDebug follows:";
}

function EdBarEnvSwitch(event) {
  var newHost = document.getElementById("EdBarEnvSelector").value;
  currentUrl = window._content.document.location.toString();

  var protocolEnd = currentUrl.indexOf("://") + 3;
  var currentHost = currentUrl.substring(protocolEnd, currentUrl.indexOf("/", protocolEnd));

  if (currentHost != newHost) {
    newUrl = currentUrl.replace(currentHost, newHost);
    window._content.document.location = newUrl;
  }
}

function EdBarEnvSelectorRebuild(newUrl) {
  var urls = new Object();
  urls["Google UK"] = "www.google.co.uk";
  urls["Google Global"] = "www.google.com";
  urls["Google US"] = "www.google.us";
  urls["Google FR"] = "www.google.fr";

  var protocolEnd = newUrl.indexOf("://") + 3;
  var currentHost = newUrl.substring(protocolEnd, newUrl.indexOf("/", protocolEnd));

  var envSelector = document.getElementById("EdBarEnvSelector");

  envSelector.removeAllItems();

  var count = 0;
  for (var label in urls) {
    envSelector.appendItem(label, urls[label]);
    if (currentHost == urls[label]) {
      envSelector.selectedIndex = count;
    }
	count++
  }
}


function EdBarEditContent(event) {
  try {
    var metas = window._content.document.getElementsByTagName("meta"), objectType, objectID, cmsURL;

    for (var i=0; i<metas.length; i++) {
      if ('edbar-object-type' == metas[i].name) {
        objectType = metas[i].content;
      } else if ('edbar-object-id' == metas[i].name) {
        objectID = metas[i].content;
      } else if ('edbar-cms' == metas[i].name) {
        cmsURL = metas[i].content;
      }
    }

    if (!cmsURL) {
      cmsURL = 'https://cms.89pies.com';
    }

    if (!objectType) {
      throw 'NoObjectType';
    }

    if (!objectID) {
      throw 'NoObjectID';
    }

    cmsURL += '/' + objectType + '/' + objectID + '/edit';
    window._content.document.location = cmsURL;
  } catch (err) {
    alert('Cannot direct from this page. ' + err);
  }
}

function EdBarClearCacheStatuses() {
  EdBarUpdateAkamaiCacheStatus("Clear");
  EdBarUpdateDrupalCacheStatus("Clear");
  EdBarUpdateZTMCacheStatus("Clear");
}

/*
  All descriptions from Akamai Edge Staging Network User Guide except:
    TCP_SWAPFAIL_MISS from http://www.comfsm.fm/computing/squid/FAQ-6.html
*/
function EdBarUpdateAkamaiCacheStatus(value) {
  var result = new Array();
  result = value.split(" ")[0];

  if ((result != "Enabled") && !edBar.getAkamaiEnabled()) {
    result = "Disabled";
  }

  switch(result) {
    case "Clear": // Clear Status
    case "Unknown": // Unknown Status
      document.getElementById("EdBarAkamaiStatus").value = "No Cache Status";
      //Firebug.Console.log("edbar : Akamai Status : Unknown");
      break;
    case "Disabled": // Akamai disabled by user
      document.getElementById("EdBarAkamaiStatus").value = "Disabled";
      //Firebug.Console.log("edbar : Akamai Status : Disabled");
      break;
    case "Enabled": // Akamai enabled by user
      document.getElementById("EdBarAkamaiStatus").value = "Enabled";
      //Firebug.Console.log("edbar : Akamai Status : Enabled");
      break;
    case "TCP_MEM_HIT": // Object was on disk and in the memory cache. Server served it without hitting the disk.
      document.getElementById("EdBarAkamaiStatus").value = "Cached";
      //Firebug.Console.log("edbar : Akamai Status : TCP_MEM_HIT");
      break;
    case "TCP_HIT": // The object was fresh in cache and object from disk cache.
      document.getElementById("EdBarAkamaiStatus").value = "Cached";
      //Firebug.Console.log("edbar : Akamai Status : TCP_HIT");
      break;
    case "TCP_IMS_HIT": // IF-Modified-Since request from client and object was fresh in cache and served.
      document.getElementById("EdBarAkamaiStatus").value = "Cached";
      //Firebug.Console.log("edbar : Akamai Status : TCP_IMS_HIT");
      break;
    case "TCP_REFRESH_HIT": // The object was stale in cache and we successfully refreshed with the origin on an If-Modified-Since request.
      document.getElementById("EdBarAkamaiStatus").value = "Refresh Cached";
      //Firebug.Console.log("edbar : Akamai Status : TCP_REFRESH_HIT");
      break;
    case "TCP_MISS": // The object was not in cache, server fetched object from origin.
      document.getElementById("EdBarAkamaiStatus").value = "Not Cached";
      //Firebug.Console.log("edbar : Akamai Status : TCP_MISS");
      break;
    case "TCP_REFRESH_MISS": // Object was stale in cache and refresh obtained a new object from origin in response to our IF-Modified- Since request.
      document.getElementById("EdBarAkamaiStatus").value = "Not Cached";
      //Firebug.Console.log("edbar : Akamai Status : TCP_REFRESH_MISS");
      break;
    case "TCP_REFRESH_FAIL_HIT": // Object was stale in cache and we failed on refresh (couldn't reach origin) so we served the stale object.
      document.getElementById("EdBarAkamaiStatus").value = "Cached (Server Error)";
      //Firebug.Console.log("edbar : Akamai Status : TCP_REFRESH_FAIL_HIT");
      break;
    case "TCP_NEGATIVE_HIT": // Object previously returned a “not found” (or any other negatively cacheable response) and that cached response was a hit for this new request.
      document.getElementById("EdBarAkamaiStatus").value = "Not Cached Page Error";
      //Firebug.Console.log("edbar : Akamai Status : TCP_NEGATIVE_HIT");
      break;
    case "TCP_SWAPFAIL_MISS": // The object was believed to be in the cache, but could not be accessed
      document.getElementById("EdBarAkamaiStatus").value = "Not Cached Swap Error";
      //Firebug.Console.log("edbar : Akamai Status : TCP_SWAPFAIL_MISS");
      break;
    case "TCP_DENIED": // Denied access to the client for whatever reason
      document.getElementById("EdBarAkamaiStatus").value = "Not Cached Page Denied";
      //Firebug.Console.log("edbar : Akamai Status : TCP_DENIED");
      break;
    case "TCP_COOKIE_DENY": // Denied access on cookie authentication (if centralized or decentralized authorization feature is being used in configuration)
      document.getElementById("EdBarAkamaiStatus").value = "Not Cached Page Denied";
      //Firebug.Console.log("edbar : Akamai Status : TCP_COOKIE_DENY");
      break;
    default:
      document.getElementById("EdBarAkamaiStatus").value = "Unknown";
      //Firebug.Console.log("edbar : Akamai Status : UNKNOWN: " + result);
  }
}

function EdBarDisableAkamai(event) {
  if (edBar.getAkamaiEnabled()) {
    EdBarUpdateAkamaiCacheStatus("Disabled");
    edBar.setAkamaiEnabled(false);
    document.getElementById("EdBarDisableAkamaiButton").label = "Enable";
  } else {
    EdBarUpdateAkamaiCacheStatus("Enabled");
    edBar.setAkamaiEnabled(true);
    document.getElementById("EdBarDisableAkamaiButton").label = "Disable";
  }
}

function EdBarUpdateDrupalCacheStatus(value) {
  result = new Array();
  result = value.split(" ")[0];

  switch(result) {
    case "Clear": // Clear Status
    case "Unknown": // Unknown Status
      document.getElementById("EdBarDrupalStatus").value = "No Cache Status";
      //Firebug.Console.log("edbar : Drupal Cache : No status");
      break;
    case "HIT": // Object served from cache
      document.getElementById("EdBarDrupalStatus").value = "Cached";
      //Firebug.Console.log("edbar : Drupal Cache : cached");
      break;
    case "MISS": // Object not in cache
      document.getElementById("EdBarDrupalStatus").value = "Not cached";
      //Firebug.Console.log("edbar : Drupal Cache : Not cached");
      break;
    default:
      //Firebug.Console.log("edbar : Drupal Cache : unknown : " + result);
  }
}

function EdBarUpdateZTMCacheStatus(value) {
  result = new Array();
  result = value.split(" ")[0];

  switch(result) {
    case "Clear": // Clear Status
    case "Unknown": // Unknown Status
      document.getElementById("EdBarZTMStatus").value = "No Cache Status";
      //Firebug.Console.log("edbar : ZTM Cache : unknown");
      break;
    case "cached": // 
      document.getElementById("EdBarZTMStatus").value = "Cached";
      //Firebug.Console.log("edbar : ZTM Cache : cached");
      break;
    case "caching":
      document.getElementById("EdBarZTMStatus").value = "Caching";
      //Firebug.Console.log("edbar : ZTM Cache : caching");
      break;
    case "not cacheable; response specified \"Cache-Control: no-store\"":
      document.getElementById("EdBarZTMStatus").value = "Not Cacheable";
      //Firebug.Console.log("edbar : ZTM Cache : Not Cacheable");
      break;
    default:
      //Firebug.Console.log("edbar : ZTM Cache : unknown : " + result);
  }
}


Components.classes["@mozilla.org/observer-service;1"]
  .getService(Components.interfaces.nsIObserverService)
  .addObserver({
    observe: function(aSubject, aTopic, aData) {
      if ("http-on-modify-request" == aTopic) {
        var url = aSubject.QueryInterface(Components.interfaces.nsIHttpChannel).originalURI.spec;
        if (url) { // @todo only set headers for urls we care about && url.match("^http://www.example.com/")) {
          aSubject.setRequestHeader("Pragma", "akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-extracted-values, akamai-x-get-nonces, akamai-x-get-ssl-client-session-id, akamai-x-get-true-cache-key, akamai-x-serial-no", true);
          if (!edBar.getAkamaiEnabled()) {
            aSubject.setRequestHeader("X-edbar-Cache-Control", "no-store", true);
          }
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

  onLocationChange: function(aProgress, aRequest, aURI)
  {
    edBar.processCacheHeaders(aProgress, aRequest, aURI);
  },

  onStateChange: function(a, b, c, d) {},
  onProgressChange: function(a, b, c, d, e, f) {},
  onStatusChange: function(a, b, c, d) {},
  onSecurityChange: function(a, b, c) {}
};

var edBar = {
  akamaiEnabled: true,

  init: function() {
    // Listen for webpage loads
    gBrowser.addProgressListener(edBarListener, Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
  },
  
  uninit: function() {
    gBrowser.removeProgressListener(edBarListener);
  },

  setAkamaiEnabled: function(status) {
    this.akamaiEnabled = status;
  },

  getAkamaiEnabled: function() {
    return this.akamaiEnabled;
  },

  processCacheHeaders: function(aProgress, aRequest, aURI) {
    //Firebug.Console.log("page reload");
    EdBarEnvSelectorRebuild(aURI.spec);
    EdBarClearCacheStatuses();

    aRequest.QueryInterface(Components.interfaces.nsIHttpChannel).visitResponseHeaders({
      visitHeader: function(name, value) {
        switch(name) {
          case "X-Cache":
          case "X-Cache-Remote":
            EdBarUpdateAkamaiCacheStatus(value);
            break;
          case "X-Drupal-Cache":
            EdBarUpdateDrupalCacheStatus(value);
            break;
          case "X-Cache-Info":
            EdBarUpdateZTMCacheStatus(value);
            break;
        }
      }
    });
  }
};

window.addEventListener("load", function() {edBar.init()}, false);
window.addEventListener("unload", function() {edBar.uninit()}, false);