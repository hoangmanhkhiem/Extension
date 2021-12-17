var xhr = new XMLHttpRequest();
var refresh_interval = 240000;
var api_url = "http://v4.ident.me/";
var ip_info = null;

function init()
{
	/* Refresh every 4 minutes */
	window.setInterval(function(){ 
		retrieve_ip();
	}, refresh_interval);
	
	//BrowserDetect.init();
}

/* Main function for parsing the information */
function retrieve_ip()
{
	xhr.open("GET", api_url, true);
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState == 4)
		{
			response = String(xhr.responseText);
			//ip_info = JSON.parse(response);
			ip_info = {
				'ip_addr': response,
				'forwarded': ""
			}
			
			chrome.browserAction.setTitle({
				title: chrome.i18n.getMessage("current_ip_is") + " " + ip_info.ip_addr
			});
			
			update_badge();
		}
	}
	xhr.send();	
}
retrieve_ip();

/**
 * Retrieve new IP-information to show in the popup 
 */
function refresh_info()
{
	xhr.open("GET", api_url, false);
	
	var requestTimer = setTimeout(function() {
       xhr.abort();
    }, 3000);

	try{ 
		xhr.send(null);
	} catch(err) {
		return false;
	}
	
	response = String(xhr.responseText);
	//ip_info = JSON.parse(response);
	ip_info = {
		'ip_addr': response,
		'forwarded': ""
	}

	return true;
}

/**
 * Return ip_info to the popup 
 * and always update the rest when done
 */
function get_ip_info()
{
	update_badge();
	return ip_info;
}

/**
 * Clear the badge (remove the little red box)
 */
function clearBadge()
{
	chrome.browserAction.setBadgeText({text: ""});
}

/**
 * Update the badge with internal info
 */
function update_badge()
{
	if(localStorage.stored_ip)
	{
		if(localStorage.stored_ip != ip_info.ip_addr)
		{
			chrome.browserAction.setBadgeText({text: "!"});
		}
	}
	else
	{
		clearBadge();
	}
	
	localStorage.stored_ip = ip_info.ip_addr;
}

/**
 * Free browser-detection script
 * by Peter Paul Koch QuirksMode.org 
 */
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	]
};

document.addEventListener('DOMContentLoaded', init);
