(function (window) {
    var jQuery = window.jQuery;

    jQuery.fn.extend({
        css: function (attr, value) {
            if (value === undefined) {
                //单个参数
                if (typeof attr == "string") {
                    if (this[0].style[attr]) {
                        return this[0].style[attr];
                    }else{
                        console.log("The first one has no '" + attr + "' attribute.");
                        return "";
                    }
                } else if (typeof attr == "object") {
                    this.each(function () {
                        for (var k in attr) {
                            this.style[k] = attr[k];
                        }
                    })
                }
            } else {
                //两个参数
                this.each(function(){
                    this.style[attr] = value;
                })
            }
            return this;
        },
        addClass: function (name) {
            this.each(function () {
                if (this.className) {
                    var t = this.className.split(" ");
                    t = t.filter(function (v) {
                        return v != name;
                    });
                    t.push(name);
                    this.className = t.join(" ");
                } else {
                    this.className = name;
                }
            });
            return this;
        },
        removeClass: function (name) {
            this.each(function () {
                if (this.className) {
                    var t = this.className.split(" ");
                    t = t.filter(function (v) {
                        return v != name;
                    });
                    this.className = t.join(" ");
                } else {
                    console.log("The element has no classname.")
                }
            });
            return this;
        },
        hasClass: function (name) {
            var t = [];
            for (var i = 0; i < this.length; i++) {
                if (this[i].className) {
                    t.push.apply(t, this[i].className.split(" "));
                }
            }
            for (var i = 0; i < t.length; i++) {
                if (t[i] == name) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        toggleClass: function (name) {
            if (this.hasClass(name)) {
                this.removeClass(name);
            } else {
                this.addClass(name);
            }
        }
    });
})(window); 