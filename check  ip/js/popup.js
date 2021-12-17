/**
 * First things first!
 * Because of internationalization
 */
document.getElementById("refresh_button").innerHTML = chrome.i18n.getMessage("refresh");

/**
 * Refresh the IP
 */
function refresh_ip()
{
	document.getElementById("refresh_button").innerHTML = chrome.i18n.getMessage("refresh_loading");

	setTimeout(function(){
		chrome.extension.getBackgroundPage().retrieve_ip();
		if(chrome.extension.getBackgroundPage().refresh_info() != false)
		{
			document.location.href = "popup.html";
		}
	}, 300);
}

/**
 * Get the current browser, not used at the moment
 */
function get_browser()
{
	browser_string = chrome.extension.getBackgroundPage().BrowserDetect.browser
					+ " " + 
					chrome.extension.getBackgroundPage().BrowserDetect.version; 
	return browser_string;
}

/**
 * Copy the current IP to clipboard
 */
function copyToClipboard()
{
	document.getElementById("copy_to_clipboard").innerHTML = chrome.i18n.getMessage("copied");
	var copyDiv = document.createElement('span');
	copyDiv.style.height = '1px';
	copyDiv.style.lineHeight = '1px';
	copyDiv.style.fontSize = '1px';
	copyDiv.contentEditable = true;
	document.body.appendChild(copyDiv);
	copyDiv.innerHTML = document.getElementById("current_ip").innerHTML;
	copyDiv.unselectable = "off";
	copyDiv.focus();
	document.execCommand('SelectAll');
	document.execCommand("Copy", false, null);
	document.body.removeChild(copyDiv);
	setTimeout(function(){
		document.getElementById("copy_to_clipboard").innerHTML = "&#9733; " + chrome.i18n.getMessage("copy_to_clipboard");
	}, 1500);
}

document.getElementById("initial_help").innerHTML = chrome.i18n.getMessage("initial_help");
ip_info = chrome.extension.getBackgroundPage().get_ip_info();
chrome.extension.getBackgroundPage().clearBadge();
document.getElementById("initial_help").style.display = "none";
document.getElementById("your_current_ip").innerHTML = chrome.i18n.getMessage("your_current_ip");
document.getElementById("current_ip").innerHTML = ip_info.ip_addr;

if(ip_info.forwarded != "")
{
	document.getElementById("via_ip").innerHTML = chrome.i18n.getMessage("via_ip");
	document.getElementById("forwarded").innerHTML = ip_info.forwarded;
	
	document.getElementById("via_host").innerHTML = chrome.i18n.getMessage("via_host");
	document.getElementById("proxy").innerHTML = ip_info.via;
	
	document.getElementById("user_agent").style.display = "none";
} else {
	document.getElementById("proxy_list").style.display = "none";
	document.getElementById("proxy_host").style.display = "none";
	document.getElementById("user_agent").style.display = "none";
}

//document.getElementById("your_current_browser").innerHTML = chrome.i18n.getMessage("your_current_browser");
//document.getElementById("browser_version").innerHTML = get_browser();

document.getElementById("refresh_button").onclick = refresh_ip;

document.getElementById("copy_to_clipboard").innerHTML = "&#9733; " + chrome.i18n.getMessage("copy_to_clipboard");
document.getElementById("copy_to_clipboard").onclick = copyToClipboard;
