(function (window) {
    // 1. 把沙箱中声明的函数 jQuery 赋值给window的jQuery属性(和$属性)，使其暴露在全局作用下
    window.jQuery = window.$ = jQuery;
    /* 2. 声明一个jQuery函数 ，这个函数 返回 的是其 prototype 对象中的一个方法(构造函数) init 的实例
       我们将这个构造函数单独写在一个包中，并在最后引入。(目的：方便我们在扩展其它包时，随时修改这个构造函数创建实例的方式(代码执行路径/判断方式)，同时也便于将完整版的 jQuery.prototype (加上其他扩展包扩展的方法)赋值给这个构造函数的prototype.从而让jQuery函数返回的init实例，可以访问jQuery.prototype中的所有方法)*/
    function jQuery(sele) {
        return new jQuery.fn.init(sele);
    }
    // 3. 设置jQuery函数的 prototype 的值，并将其重命名为 fn.
    // 同时，我们为其添加一些在众多地方都会用到的 核心方法
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        length: 0,
        each: function (callback) {
            return jQuery.each(this, callback);
        },
        map: function (callback) {
            return jQuery.map(this, callback);
        },
        // 把 this 堆叠到 obj 中, 方便end 取出
        pushStack: function (obj) {
            obj.prvEle = this;
            return obj;
        },
        end: function () {
            return this.prvEle || jQuery(this);
        }
    }
    // 4. 为jQuery 函数对象添加一些静态方法，使我们可以在全局作用域下通过其属性 直接 调用这些方法
    jQuery.isArrayLike = function (obj) {
        var length = obj && obj.length;
        return typeof length == "number" && length >= 0;
        // a && b 的写法，可以简单理解为：
        /* 真  真     b
           真  假     b
           假  真     a
           假  假     a
           从左向右，如果哪一项首先为假，就返回哪一项
           否则，返回最后一项    */
        // a || b 的写法，可以简单理解为：
        /* 真  真     a
           真  假     a
           假  真     b
           假  假     b
           从左向右，如果哪一项首先为真，就返回哪一项
           否则，返回最后一项    */
    }
    jQuery.each = function (psary, callback) {
        if (callback != undefined) {
            if (jQuery.isArrayLike(psary)) {
                for (var i = 0; i < psary.length; i++) {
                    // 如果这个回调函数的返回值是false ，则停止循环；
                    if (callback.call(psary[i], psary[i], i) == false) break;
                }
            } else {
                for (var k in psary) {
                    if (callback.call(psary[k], psary[k], k) == false) break;
                }
            }
        }
        //你传入了一个数组，在each中进行了遍历操作，然后我再将这个 数组 返回出去，以便你进行其他操作
        return psary;
    }
    jQuery.map = function (psary, callback) {
        var temp = [];
        jQuery.each(psary, function(v, i){
            if(v != undefined){
                temp.push(callback(v, i));
            }
        })
        return temp;
    }
    // 5. 我们为jQuery 函数对象自身以及其原型属性fn对象添加一个特殊的方法，使其可以方便的混入其他对象的方法
    jQuery.extend = jQuery.fn.extend = function (obj) {
        for (var key in obj) {
            this[ key ] = obj[ key ];
        }
    }
})(window);

// 总结：创建jQuery库 的核心包代码共分 5 步：
// 1. 将jQuery暴露在全局作用域
// 2. 声明jQuery函数，返回构造函数实例
// 3. 为jQuery函数的原型属性添加核心属性和方法
// 4. 为jQuery函数对象添加常用静态方法
// 5. 为jQuery函数及其原型属性添加扩展方法


// 当前包提供each map 静态和原型方法；以及原型end方法；
(function (window) {
    // 1. 在沙箱中声明一个变量jQuery, 接收来自全局作用域下的jQuery对象
    var jQuery = window.jQuery;

    var arr = [];
    var push = arr.push;
    // 2. 为jQuery函数对象的prototype 对象中添加构造函数 init.
    jQuery.fn.init = function (sele) {
        if (!sele) {
            return this;//虽然构造函数中的return this,并没有任何用处,但是在这里使用,可以终止函数继续执行
        } else if (typeof sele == "string") {
            if (sele.charAt(0) == "<" && sele.charAt(sele.length - 1) == ">") {
                push.apply(this, jQuery.parseHTML(sele));
                return this;
            } else {
                var dom = document.querySelectorAll(sele);
                if (dom.length != 0) {
                    push.apply(this, dom);
                }else{
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
    }
    /* 3. 将jQuery函数对象的prototype 对象赋值给新写入的构造函数 init 的prototype对象
    这样使得由该构造函数创建出来的实例都可以访问到jQuery.prototype中的所有方法*/
    jQuery.fn.init.prototype = jQuery.fn;
})(window);

// 总结：创建jQuery构造器包代码共分 3 步
// 1. 声明变量jQuery，接收来自全局作用域的jQuery对象
// 2. 给jQuery对象的prototype写入构造器
// 3. 把jQuery对象的prototype赋值给构造器的prototype
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