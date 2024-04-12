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