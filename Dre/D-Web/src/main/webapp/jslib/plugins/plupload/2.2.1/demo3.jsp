<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.tw.common.utils.SecurityUtil"%>
<%
	String contextPath = request.getContextPath();
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<title>上传</title>
</head>

<body>

<div id="div_uploader"></div>

<jsp:include page="/inc_js.jsp"></jsp:include>


<script type="text/javascript">
require(['pluploadTW'], function(){

	$("#div_uploader").pluploadTW({
		field: 'url',
		filesStr: 'http://jdzhl.img-cn-beijing.aliyuncs.com/mall/user/ff808081540e507b01540eed3cbe0005/4bd66b4248de47cf90213cf0a81a0b92.jpg^http://m.jdzhilian.com:81/MallUploadFile/temp/2016/12/8/350520b199454d4d966900da7edf9b2e.jpg^http://m.jdzhilian.com:81/MallUploadFile/temp/2016/12/8/350520b199454d4d966900da7edf9b2e.jpg^http://m.jdzhilian.com:81/MallUploadFile/temp/2016/12/8/350520b199454d4d966900da7edf9b2e.jpg^http://m.jdzhilian.com:81/MallUploadFile/temp/2016/12/8/350520b199454d4d966900da7edf9b2e.jpg',
		up_num: 5,	//上传数量控制
		
		url : '/member/uploadFile',
		
		//resize : {width : 320, height : 240, quality : 90},
		
		filters : {
			mime_types: [
				{title : "Image files", extensions : "jpg,gif,png,bmp"},
				{title : "Zip files", extensions : "zip"}
			]
		}
	});

});
</script>
</body>
</html>