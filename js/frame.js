/**
 * Created by John on 2017/6/12.
 */

$(function () {
    //闭包, 语法糖
    var package = (function () {
        var hit = $(window).innerHeight();
        var index;
        return {
            get hit() {
                return hit;
            },
            get index() {
                return index;
            },
            set hit(value) {
                hit = value;
            },
            set index(value) {
                index = value;
            }
        }
    })();
    // 根据终端屏幕的宽度设置根元素的字体大小；
    $("html").css("fontSize", window.innerWidth / 130 + "px");
    // 将可视区域的高度，赋值给文章部分
    $("article").css("height", package.hit);
    // 设置主体部分标题项的宽度

    $("main h5").each(function (key, value) {
        $(value).css("width", $(value).text().length + 4 + "rem");
    })
    //------------------------------------------------------------------------------
    //声明一个数组，保存旁白栏所有一级列表项的字符值；

    var listname = [];
    $("nav>div>span").each(function (key, value) {
        listname.push($(value).text());
    });
    //将该数组的每一项，变成config对象的属性，并为其赋值一个空数组，用以保存对应的值
    var config = {};
    for (var i = 0; i < listname.length; i++) {
        config[listname[i]] = [];
    }
    //为旁白栏每一项的二级列表项，绑定点击事件
    // for (var i = 0; i < listname.length; i++) {
    //     bindEvent($("nav>div:eq(" + i + ")>ul>li"), listname[i]);
    // }
    listname.forEach(function (value, key) {
        bindEvent($("nav>div:eq(" + key + ")>ul>li"), value);
    });

    //声明函数：为某个对象绑定点击事件，该事件使页面被卷去的高度对应到配置单中的值。
    function bindEvent(obj, key) {
        obj.on("click", function () {
            $(window).scrollTop(config[key][$(this).index()]);
        })
    }
    //--------------------------------------------------------------------
    //展开与关闭部分动画，暂时如此。
    $("nav>div>span").on("click", function () {
        if ($(this).next().height() == 0) { //旁白栏  如果当前被点击 div 的高度为 0;
            $("nav").css("color", "#333");
            package.index = $(this).parent().index();
            //旁白栏  展开当前 div 的高度,以当前被点击 div 内部 li 标签的数量,来决定该 div 的高度;同时关闭其兄弟元素的高度；
            var target = $(this).parent().find("li").length*1.4 + "rem";
            $(this).next().css("height", target).parent().siblings().find("ul").css("height", 0);
            //文章部分  关闭其高度；
            $("article").css("height", 0);
            $(window).scrollTop(0);
            //主体部分  展开与当前旁白栏div索引对应的 div 的高度；同时关闭其兄弟元素的高度；
            $("main>div").eq(package.index).css("height", "auto").siblings().css("height", 0);
            //如果文章部分处于打开状态，且对应的配置单为空，则为配置单添加特有的配置。
            if ($("article").height() != 0 && config[listname[package.index]].length == 0) {
                $("main>div").eq(package.index).find("h5").each(function (key, value) {
                    config[listname[package.index]].push($(value).offset().top - 1.47 * $("nav").height());
                });
            }
            //如果文章部分处于关闭状态，且对应的配置单为空，则为配置单添加公共的配置。
            if ($("article").height() == 0 && config[listname[package.index]].length == 0) {
                $("main>div").eq(package.index).find("h5").each(function (key, value) {
                    config[listname[package.index]].push($(value).offset().top - 5 * $(value).height());
                });
            } else {
                // do not 
            }
        } else { //旁白栏  如果当前被点击的 div 有高度;
            $("nav").css("color", "#fff");
            package.index = $(this).parent().index();
            //旁白栏  关闭当前 div 的高度;
            $(this).next().css("height", 0);
            //文章部分  展开其高度；
            $("article").css("height", package.hit);
            //主体部分  关闭当前div的高度；
            $("main>div").eq(package.index).css("height", 0);
        }
    });

});