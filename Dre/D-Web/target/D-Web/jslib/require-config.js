//将配置作为全局变量"require"在require.js加载之前进行定义，它会被自动应用。
//下面的示例定义的依赖会在require.js,一旦定义了require()之后即被加载
var require = {
    baseUrl: tf.contextPath+"/jslib/",
    map: {
        '*': {
           'css':'css'
        }
    },
    paths: {

        'jquery': 'jquery/1.9.1/jquery',

        'sweetalert': 'plugins/sweetalert/sweetalert.min',

        'layer': 'plugins/layui/layer-v2.3/layer/layer',

        'tfExt': 'tfExt/tfExt',

        // 上传插件
        'plupload-min': 'plugins/plupload/js/plupload.full.min',
        'plupload-i18n': 'plugins/plupload/js/i18n/zh_CN',
        'plupload': 'tfExt/plugins/pluploadUtil',

        /**上传组件2.2.1 */
        'moxie': 'plugins/plupload/2.2.1/moxie',
        'plupload_2': 'plugins/plupload/2.2.1/plupload.dev',
        'plupload_i18n': 'plugins/plupload/2.2.1/i18n/zh_CN',
        'pluploadTF': 'plugins/plupload/2.2.1/ext/plupload-ext',




    },
    shim: {
        sweetalert: {
            deps: [
                'css!./plugins/sweetalert/sweetalert.css'
            ]
        },
        //上传插件2.2.1
        'plupload_2': {deps: [
            'moxie'
        ]},
        'plupload_i18n': {deps: [
            'plupload_2'
        ]},
        'pluploadTF':{deps:[
            'css!./plugins/plupload/2.2.1/ext/css/plupload-ext.css',
            'plupload_i18n'
        ]}




    }

};

