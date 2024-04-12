(function (window) {
    // 直接将函数 jQuery 暴露在全局作用域
    window.jQuery = window.$ = jQuery;
    var arr = [];
    var push = arr.push;

    // jQeury 是一个无需写 new 关键字的构造函数
    function jQuery(sele) {
        if (this instanceof jQuery) {
            if (!sele) {
                return this;
            } else if (typeof sele == "string") {
                if (sele.charAt(0) == "<" && sele.charAt(sele.length - 1) == ">") {
                    push.apply(this, jQuery.parseHTML(sele));
                    return this;
                } else {
                    var dom = document.querySelectorAll(sele);
                    if (dom.length != 0) {
                        push.apply(this, dom);
                    } else {
                        console.log("cannot find this element!");
                    }
                    return this;
                }
            } else if (sele.nodeType || sele.constructor == NodeList || sele.constructor == HTMLCollection || sele.constructor == Array) {
                if (sele.nodeType) {
                    push.call(this, sele);
                } else {
                    push.apply(this, sele);
                }
                return this;
            } else if (sele.constructor == jQuery) {
                push.apply(this, sele);
                return this;
            } else if (typeof sele == "function") {
                window.addEventListener("load", sele);
            } else {
                this[0] = sele;
                return this;
            }
        } else {
            return new jQuery(sele);
        }
    }

    // 设置 jQuery 函数的原型属性为一个对象 (具备伪数组的length属性)，并为其添加一些原型方法
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        length: 0,
        each: function (callback) {
            return jQuery.each(this, callback);
        },
        map: function (callback) {
            return jQuery.map(this, callback);
        },
        pushStack: function (obj) {
            obj.prvEle = this;
            return obj;
        },
        end: function () {
            return this.prvEle || jQuery(this);
        }
    }
    // 为 jQuery 函数对象添加一些静态方法，使我们可以在全局作用域下通过其属性 直接 调用这些方法
    jQuery.isArrayLike = function (obj) {
        var length = obj && obj.length;
        return typeof length == "number" && length >= 0;
    }
    jQuery.each = function (psary, callback) {
        if (callback != undefined) {
            if (jQuery.isArrayLike(psary)) {
                for (var i = 0; i < psary.length; i++) {
                    if (callback.call(psary[i], psary[i], i) == false) break;
                }
            } else {
                for (var k in psary) {
                    if (callback.call(psary[k], psary[k], k) == false) break;
                }
            }
        }
        return psary;
    }
    jQuery.map = function (psary, callback) {
        var temp = [];
        jQuery.each(psary, function (v, i) {
            if (v != undefined) {
                temp.push(callback(v, i));
            }
        })
        return temp;
    }
    // 为jQuery 函数对象自身以及其原型属性fn对象添加一个扩展其他功能包的方法
    jQuery.extend = jQuery.fn.extend = function (obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
    }
})(window);