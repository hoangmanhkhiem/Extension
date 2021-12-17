var conf = {};
class Background {
    constructor() {
        this.followOptions = 'Cursor';
        this.currentItem = null;
        this.initListener();
        this.conf = {};
    }

    getUid() {
        try{
            chrome.storage.local.get((e) => {conf = e;})
        } catch (e) {

        }

        let buf = new Uint32Array(4);
        window.crypto.getRandomValues(buf);
        let idx = -1, uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            idx++;
            let r = (buf[idx >> 3] >> ((idx % 8) * 4)) & 15, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }.bind(this));
        return uid;
    }

    initListener() {
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            if (message.method == 'checklic') {
                this.recheck(sender);
            }
            return;
        }.bind(this));


        chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
            switch (request.action) {
                case "set": {
                    chrome.storage.local.set({
                        settingCat: request.data
                    });
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {status: 'init'}, function(response) {
                            console.log('cat')
                        });
                    });


                    sendResponse({});
                    break;
                }}
        });

        chrome.runtime.onInstalled.addListener(function (details) {
            if (details.reason == "install") {
                chrome.tabs.create({url: 'https://catcursor.com/?utm_source=cursor-cat&utm_medium=ext&utm_campaign=install'});
                chrome.storage.local.set({
                    selected: null,
                    is_active: false,
                    uid: this.getUid(),
                    options: {link: "", is_visited: false}
                });
            } else if (details.reason == "update") {
                chrome.storage.local.set({dup: (new Date()).getTime()});
                chrome.tabs.create({url: 'https://catcursor.com/?utm_source=cursor-cat&utm_medium=ext&utm_campaign=update'});

            }
        }.bind(this));
        chrome.runtime.setUninstallURL('https://catcursor.com/?utm_source=cursor-cat&utm_medium=ext&utm_campaign=uninstall')
    }

    recheck(sender) {
    }
}

new Background();


