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