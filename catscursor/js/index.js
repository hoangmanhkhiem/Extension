class Popup {
    constructor() {
        this.cats = {
            greeny: {
                id: 'greeny',
                name: "greeny",
                image: chrome.extension.getURL("assets/img/tabby.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat3.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat3_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat3_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat3_move_r.gif")
            },
            pika: {
                id: "pika",
                name: "pika",
                image: chrome.extension.getURL("assets/img/pika.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat5.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat5_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat5_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat5_move_r.gif")
            },
            punky: {
                id: "punky",
                name: "punky",
                image: chrome.extension.getURL("assets/img/punky.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat4.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat4_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat4_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat4_move_r.gif")
            },
            maneki: {
                id: "maneki",
                name: "maneki",
                image: chrome.extension.getURL("assets/img/maneki.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat6.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat6_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat6_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat6_move_r.gif")
            },
            nyan: {
                id: "nyan",
                name: "nyan",
                image: chrome.extension.getURL("assets/img/nyan.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat7.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat7_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat7_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat7_move_r.gif")
            },
            grinch: {
                id: "grinch",
                name: "grinch",
                image: chrome.extension.getURL("assets/img/grinch.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat8.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat8_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat8_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat8_move_r.gif")
            },
            rudolph: {
                id: "rudolph",
                name: "rudolph",
                image: chrome.extension.getURL("assets/img/rudolph.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat9.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat9_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat9_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat9_move_r.gif")
            },
            santa: {
                id: "santa",
                name: "santa",
                image: chrome.extension.getURL("assets/img/santa.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat10.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat10_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat10_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat10_move_r.gif")
            },
            spidey: {
                id: "spidey",
                name: "spidey",
                image: chrome.extension.getURL("assets/img/spidey.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat11.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat11_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat11_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat11_move_r.gif")
            },
            batcat: {
                id: "batcat",
                name: "batcat",
                image: chrome.extension.getURL("assets/img/batcat.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat12.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat12_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat12_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat12_move_r.gif")
            },
            hulk: {
                id: "hulk",
                name: "hulk",
                image: chrome.extension.getURL("assets/img/hulk.png"),
                itemLeft: chrome.extension.getURL("assets/img/cat13.gif"),
                itemLeftZ: chrome.extension.getURL("assets/img/cat13_move.gif"),
                itemRight: chrome.extension.getURL("assets/img/cat13_r.gif"),
                itemRightZ: chrome.extension.getURL("assets/img/cat13_move_r.gif")
            }
        };
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            chrome.storage.local.get(null, function (items) {
                this.configuration = items;
                $("#container").html("");
                this.initUi();
            }.bind(this));
        }.bind(this));
        chrome.storage.local.get(null, function (items) {
            this.configuration = items;
            this.initUi();
        }.bind(this));
    }

    initUi() {
        if (this.configuration.is_active) {
            $("#container").append(`<div class='image enable' id='kick'></div>`);
        } else {
            $("#container").append(`<div class='image disable' id='kick'></div>`);
        }
        for (let i in this.cats) {
            let catItem = `<div class="image caty ${this.cats[i].id}" data-cur="${i}" data-id="${this.cats[i].id}" data-cur="${i}" style="background-image: url('${this.cats[i].image}')" ></div>`;
            $("#container").append(catItem);
        }
        if (this.configuration.selected) {
            $(`[data-id=${this.configuration.selected.id}]`).addClass('active');
        }
        $(".caty").on('click', function (e) {
            $('.caty.active').removeClass('active');
            $(e.target).addClass('active');
            let id = $(e.target).attr('data-id');
            chrome.storage.local.set({selected: this.cats[id], is_active: true});
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {status: 'init'}, function (response) {
                }.bind(this));
            }.bind(this));
        }.bind(this));
        $("#kick").on('click', function (e) {
            if (this.configuration.is_active == true) {
                this.configuration.is_active = false;
                $("#kick").removeClass('enable');
                $("#kick").addClass('disable');
                $('.caty.active').removeClass('active');
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {status: 'kick'}, function (response) {
                    }.bind(this));
                }.bind(this));
                chrome.storage.local.set({is_active: this.configuration.is_active});
            } else {
                this.configuration.is_active = true;
                $("#kick").removeClass('disable');
                $("#kick").addClass('enable');
                $(`[data-id=${this.configuration.selected.id}]`).addClass('active');
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {status: 'init'}, function (response) {
                    }.bind(this));
                }.bind(this));
                chrome.storage.local.set({is_active: this.configuration.is_active});
            }
        }.bind(this))
        $("#linkrate").attr("href", `https://chrome.google.com/webstore/detail/${chrome.runtime.id}/reviews?utm_source=popup`);
    }
}

$(function () {
    let p = new Popup();
});

