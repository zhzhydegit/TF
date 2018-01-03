
<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false"%>
<%String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();%>
<%String contextPath = request.getContextPath();%>

<script>
    var tf = tf || {};

    tf.contextPath = '<%=contextPath%>';
    tf.basePath = '<%=basePath%>';
</script>

<script src="<%=contextPath%>/jslib/tfExt/tf.js"></script>
<script src="<%=contextPath%>/jslib/jquery/1.9.1/jquery.js"></script>
<script src="<%=contextPath %>/jslib/require-config.js"></script>
<script src="<%=contextPath %>/jslib/RequireJS.min.js"></script>

