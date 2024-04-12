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
(function (window) {
    var jQuery = window.jQuery;
    var arr = [];
    var push = arr.push;

    jQuery.fn.extend({
        appendTo: function (doms) {
            var ndoms = jQuery(doms);
            var obj = jQuery();
            for (var i = 0; i < ndoms.length; i++) {
                this.each(function () {
                    var temp = i != ndoms.length - 1 ? this.cloneNode(true) : this;
                    push.call(obj, temp);
                    ndoms[i].appendChild(temp);
                })
            }
            return this.pushStack(obj);
            //doms.appendChild(this)
        },
        append: function (doms) {
            doms = jQuery(doms);
            var obj = jQuery();
            this.each(function (v, key) {
                for(var i = 0; i<doms.length; i++){
                    var temp = key != this.length - 1 ? doms[i].cloneNode(true) : doms[i];
                    push.call(obj, temp);
                    this.appendChild(temp);
                }
            });
            return this.pushStack(obj);
            //this.appendChild(doms)
        },
        parent: function () {
            var t = [];
            var j = jQuery();
            this.each(function () {
                if (t.indexOf(this.parentNode) == -1) {
                    push.call(t, this.parentNode);
                }
            });
            push.apply(j, t);
            return j;
        }
    });

    jQuery.extend({
        parseHTML: function (str) {
            var t = [];
            var div = document.createElement("div");
            div.innerHTML = str;
            t.push.apply(t, div.childNodes);
            return t;
        }
    });
})(window);
(function (window) {
    var jQuery = window.jQuery;

    jQuery.fn.extend({
        on: function (event, callback) {
            this.each(function () {
                this.addEventListener(event, callback);
            });
            return this;
        },
        off: function (event, callback) {
            this.each(function () {
                this.removeEventListener(event, callback);
            });
            return this;
        }
    });
    jQuery.each(
        ('abort,blur,cancel,canplay,canplaythrough,change,click,close,contextmenu,' +
            'cuechange,dblclick,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,' +
            'durationchange,emptied,ended,error,focus,input,invalid,keydown,keypress,keyup,' +
            'load,loadeddata,loadedmetadata,loadstart,mousedown,mouseenter,mouseleave,mousemove,' +
            'mouseout,mouseover,mouseup,mousewheel,pause,play,playing,progress,ratechange,reset,' +
            'resize,scroll,seeked,seeking,select,show,stalled,submit,suspend,timeupdate,toggle,' +
            'volumechange,waiting,autocomplete,autocompleteerror,beforecopy,beforecut,' +
            'beforepaste,copy,cut,paste,search,selectstart,wheel,webkitfullscreenchange,' +
            'webkitfullscreenerror').split(","), function (v) {
                jQuery.fn[v] = function (callback) {
                    return this.on(v, callback);
                }
            }
    );
})(window);
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
(function ( window ) {
    var jQuery = window.jQuery;

jQuery.fn.extend({
    attr: function ( name, value ) {
        if  ( value === undefined ) {
            return this[ 0 ].getAttribute( name );
        } else {
            return this.each( function () {
                this.setAttribute( name, value );
            });
        }
    },
    prop: function ( name, value ) {
        if  ( value === undefined ) {
            return this[ 0 ][ name ];
        } else {
            return this.each( function () {
                this[ name ] = value;
            });
        }
    }
});

jQuery.each( {
    html: 'innerHTML',
    text: 'innerText',
    val: 'value'
    }, function ( v, k ) {
    jQuery.fn[ k ] = function ( value ) {
        if ( value === undefined ) {
            return this[ 0 ][ v ];
        } else {
            return this.each( function () {
                this[ v ] = value;
            });
        }
    };
});

})( window );