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