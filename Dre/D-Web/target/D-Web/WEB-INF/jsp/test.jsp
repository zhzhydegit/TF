<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%String contextPath = request.getContextPath();%>
<html>
<head>
    <title>Title</title>
</head>
<body>


<input type="button" id="btn" value="点击">
<div id="pl_upload"></div>

<jsp:include page="/inc_js.jsp"></jsp:include>
<script type="text/javascript" src="<%=contextPath%>/jslib/test.js"></script>
</body>
</html>
