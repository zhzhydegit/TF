
var tf = tf || {};

/**
 * 命名空间
 */
tf.ns = function () {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i++) {
        d=a[i].split(".");
        o=window;
        for (j=0; j<d.length; j++) {
            o=o[d[j]]=o[d[j]] || {};
        }
    }

    return o;
}

