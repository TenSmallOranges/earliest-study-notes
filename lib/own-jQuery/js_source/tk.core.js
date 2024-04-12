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