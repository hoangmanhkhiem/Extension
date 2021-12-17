class Content {
    constructor(item) {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.status == 'kick') {
                $("#cat").remove();
            }
            if (request.status == 'init') {
                chrome.storage.local.get(null, function (items) {
                    if (items.is_active == true) {
                        let item = items.selected;
                        this.onInit();
                        this.create('cat', item);
                    }
                }.bind(this));
            }
        }.bind(this));
        chrome.storage.local.get(null, function (items) {
            if (items.is_active == true) {
                let item = items.selected;
                this.onInit();
                this.create('cat', item);
            }
        }.bind(this));
    }

    create(id, item) {
        this.item = item.name;
        this.itemName = item.name;
        this.itemLeft = item.itemLeft;
        this.itemLeftZ = item.itemLeftZ;
        this.itemRight = item.itemRight;
        this.itemRightZ = item.itemRightZ;
        this.freeView = true;
        this.lookRight = false;
        this.lookLeft = false;
        this.followOptions = 'Cursor';
        this.followSpeed = 2000;
        this.laserSpeed = 1000;
        this.initializeImages = true;
        this.mousePositionX = 0;
        this.mousePositionY = 0;
        $(`<style> .nyanFix { max-height: 90px; width: auto !important; } .draggable {  max-width: 276px; width: 10%; }</style>`).appendTo('body');
        let img = document.createElement("img");
        img.setAttribute('src', this.itemRightZ);
        img.setAttribute('id', id);
        img.setAttribute('class', 'draggable');
        document.body.appendChild(img);
        img.style.position = 'absolute';
        img.style.zIndex = 1000;
        img.style.display = 'none';

        let newItem = document.getElementById(id);
        $(newItem).attr("itemLeft", this.itemLeft)
            .attr("itemLeftZ", this.itemLeftZ)
            .attr("itemRight", this.itemRight)
            .attr("itemRightZ", this.itemRightZ)
            .attr("freeView", this.freeView)
            .attr("lookRight", this.lookRight)
            .attr("lookLeft", this.lookLeft)
            .attr("followOptions", this.followOptions)
            .attr("data-followspeed", this.followSpeed)
            .css("width", "10%")
            .removeClass("draggable")
            .bind("contextmenu", function (e) {
                return false;
            });

        this.bringitemIntoScreen(newItem);
    }

    bringitemIntoScreen(item) {
        $(item).removeClass("nyanFix");
        $(item).css("display", "block");
        $(item).stop().animate({
            left: $(this.item).parent().width() / 2 - $(this.item).width() / 2,
            top: $(document).scrollTop() + $(window).height() / 2 - $(this.item).height() / 2,
        }, {
            duration: this.laserSpeed, start: function () {
                $(item).data("freeview", false);
                $(item).attr('src', this.itemRightZ);
            }.bind(this), complete: function () {
                $(item).data("freeview", true);
            }.bind(this)
        });
        this.initializeImages = false;
    }

    onInit() {
        $(document).mousemove(function (e) {
            if (Math.abs(this.mousePositionX - e.pageX) > 50) {
                this.mousePositionX = e.pageX;
            } else {
                return;
            }
            if (Math.abs(this.mousePositionY - e.pageY) > 50) {
                this.mousePositionY = e.pageY;
            } else {
                return;
            }
            let cat = null;
            cat = '#cat';
            if ($(cat).length) {
                let imageLeft = $(cat).offset().left;
                let imageRight = imageLeft + $(cat).width();
                let imageTop = $(cat).offset().top;
                let imageBottom = imageTop + $(cat).height();
                if ($(cat).data("freeview")) {
                    if (e.pageX > imageRight) {
                        if (!$(cat).data('lookRight')) {
                            $(cat).attr('src', $(cat).attr('itemRight'));
                        }
                        $(cat).attr('lookRight', true);
                        $(cat).attr('lookLeft', false);
                    } else {
                        if (e.pageX < imageLeft) {
                            if (!$(cat).data('lookLeft')) {
                                $(cat).attr('src', $(cat).attr('itemLeft'));
                            }
                            $(cat).attr('lookRight', false);
                            $(cat).attr('lookLeft', true);
                        }
                    }
                }
                let difH = Number(e.pageX) - Number(imageLeft), difV = Number(e.pageY) - Number(imageBottom), speed;
                if (!this.initializeImages) {
                    if ((difH > 400) || (difH < -200) || (difV > 200) || (difV < -440)) {
                        speed = $(cat).data('followspeed');
                        $(cat).stop().animate({left: e.pageX, top: e.pageY}, {
                            queue: false,
                            duration: speed,
                            easing: "swing",
                            start: function () {
                                $(cat).data("freeview", false);
                                if (e.pageX > imageLeft) {
                                    if ($(cat).prop("src") != $(cat).attr('itemRightZ')) {
                                        $(cat).attr("src", $(cat).attr('itemRightZ'));
                                        $(cat).attr('lookRight', true);
                                        $(cat).attr('lookLeft', false);
                                    }
                                } else {
                                    if (e.pageX < imageLeft) {
                                        if ($(cat).prop("src") != $(cat).attr('itemLeftZ')) {
                                            $(cat).attr("src", $(cat).attr('itemLeftZ'));
                                            $(cat).attr('lookRight', false);
                                            $(cat).attr('lookLeft', true);
                                        }
                                    }
                                }
                            }.bind(this),
                            complete: function () {
                                $(this).attr('src', $(this).attr('itemLeft'));
                                $(this).data("freeview", true);
                                $(this).attr('lookLeft', true);
                            }
                        });
                    }
                }
            }
        }.bind(this));
    }
}

$(function () {
    chrome.runtime.sendMessage({method: "checklic"}, function (response) {
    });
    new Content();
});
