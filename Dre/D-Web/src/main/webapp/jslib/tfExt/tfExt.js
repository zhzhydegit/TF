;(function(factory){
    if (typeof define === "function" && define.amd) {
        //AMD模式
        define( ['jquery','sweetalert','layer'], factory );
    } else {
        //全局模式
        factory(jQuery);
    }
}(function($){
    tf.ns('tf');

    layer.config({
        path: tf.contextPath+'/jslib/plugins/layui/layer-v2.3/layer/',
        extend: ['skin/layer.css'],
        skin: 'layer-ext-default'
    });

    /**
     * 系统提示框
     */
    tf.alert = function(){
        var len = arguments.length;
        var defOpt = {
            html:true,
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定！",
            cancelButtonText: "取消！",
            closeOnConfirm: false,
            closeOnCancel: false

        }

        switch(len) {
            case 1:
                swal(arguments[0]);
                break;

            case 2:
                if (tf.str.isString(arguments[0]) && tf.str.isString(arguments[1])) {
                    var opt ={
                        title : arguments[0],
                        text : arguments[1]
                    }
                    $.extend(defOpt,opt);
                    swal(defOpt);
                }else {
                    $.extend(true,defOpt,arguments[0]);
                    swal(defOpt,arguments[1]);
                }
                break;

            case 3:
                var opt = {
                    title : arguments[0],
                    text : arguments[1],
                    type : arguments[2]
                }
                $.extend(defOpt,opt);
                swal(defOpt);
                break;
            case 4:
                var callback = null;
                if(typeof arguments[3]=="function") {
                    callback = arguments[3]
                }
                var opt = {
                    title : arguments[0],
                    text : arguments[1],
                    type : arguments[2]
                }
                $.extend(defOpt,opt);
                swal(defOpt,function () {
                    if (callback != null) {
                        callback();
                    }
                });
                break;

        }

    };



    /**
     * 系统弹出层
     */
    tf.open = function (option) {

        var defaults = {
            type:2,
            fixed: false, //不固定
            maxmin: true,
        }

        $.extend(defaults,option);

        parent.layer.open(defaults);

    }


    /**
     * 关闭弹出层
     */

    tf.openClose = function (index) {
        layer.close(index);
    }

    /**
     * 提示询问
     */
    tf.confirm = function(option, callback){
        var defOpt = {
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '确认',
            showCancelButton: true,
            cancelButtonText: '取消',
            closeOnConfirm: false,
            title: '询问',
            text: '请确认？',
            type: 'warning'
        };

        if (typeof option === 'string') {
            $.extend(defOpt,{text:option})
        }

        if (!(typeof callback === 'function')) {
            tf.alert('系统提示', '参数错误', 'warning');
            return;
        }

        $.extend(true, defOpt, option);
        tf.alert(defOpt, callback);
    };









}));

+function ($) {
    tf.str = {};

    //判断一个对象是否是字符串
    tf.str.isString = function (obj) {return $.type(obj) == "string";}
    //判断字符串是否为空
    tf.str.isNullOrEmpty = function (str) {return str === undefined || str === null || str === "" || str === "null"}
    //判断字符串是否为空，是否为空格
    tf.str.isNullOrWhiteSpace = function (str) {return tf.str.isNullOrEmpty(str) || $.trim(String(str) === "")};




}(jQuery);





