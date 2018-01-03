;(function(factory){
	if (typeof define === "function" && define.amd) {
		//AMD模式
		define( ["jquery", 'tfExt', 'plupload-min', 'plupload-i18n'], factory );
	} else {
		//全局模式
		factory(jQuery);
	}
}(function($){
	tf.ns('uploader');
	
	/**
	 * pickButtonId：选择文件按钮 ID
	 * uploadButtonId：上传按钮 ID
	 * containerId： 上传div ID
	 * uploadPromptId：上传提示信息 ID
	 * uploadFileUrlId: 上传文件url ID
	 * alreadyUploadFileUrlId：已上传文件url ID
	 * uploadFileFormat: 上传文件格式 （例如写法：rar,zip）
	 * maxFileSize:最大文件大小 （例如写法：55）
	 * hiddenField：checkMatrial
	 * 注意：文件都以MB为单位
	 */
	uploader.initUploader = function(pickButtonId,uploadButtonId,containerId,uploadPromptId,uploadFileUrlId,alreadyUploadFileUrlId,uploadFileFormat,maxFileSize,hiddenField){
		//点击选择文件 清空提示信息
	    $("#"+pickButtonId).click(function(){
	    	$("#"+uploadPromptId).html("");//清除提示信息
	    	$("#"+uploadPromptId).removeAttr("style"); //清除样式
	    	$("#"+uploadButtonId).val("上传");
	    	$("#"+uploadButtonId).attr("disabled", false).css("color", "black");
	    });
	
	    var g_object_name;
	    var key;
	    var now = timestamp = Date.parse(new Date()) / 1000;
	    var expire = 0;
	    var accessid;
	    var host;
	    var policyBase64;
	    var signature;
	    var filename;
	    var suffix;
	
	    var uploader = new plupload.Uploader({
	        runtimes : 'html5,flash,silverlight,html4',
	        browse_button : pickButtonId,
	        multi_selection: false,
	        container: document.getElementById(containerId),
	        flash_swf_url : tf.contextPath +'/jslib/plupload/js/Moxie.swf',
	        silverlight_xap_url : tf.contextPath +'/jslib/plupload/js/Moxie.xap',
	        url : 'http://oss.aliyuncs.com',
	
	        filters : {
	            mime_types: [
	                {title : "Zip Files", extensions : uploadFileFormat}
	            ],
	            max_file_size: maxFileSize + "mb"
	        },
	
	        init: {
	            PostInit: function() {
	                $("#" + uploadButtonId).click(function(){
	                	$("#"+pickButtonId).attr("disabled", true).css("color","gray");
	                	$("#"+uploadButtonId).val("上传中...");
	        	    	$("#"+uploadButtonId).attr("disabled", true).css("color","gray");
	                    setUploadParam(uploader, '', false);
	                    return false;
	                });
	            },
	
	            FilesAdded: function(up, files) {
	                plupload.each(files, function(file) {
	                    $("#"+uploadButtonId).show();
	                    // 如果有原先的文件存在时,先清除原先的Dom对象
	                    var originFile = $("#"+containerId).find(".progress");
	                    if(originFile.length > 0){
	                        if(originFile.attr("id") != undefined){
	                            up.removeFile(originFile.attr("id"));
	                        }
	                        originFile.remove();
	                    }
	                    $("#"+containerId).append("<div class='progress jindu' id='"+file.id+"'><div class='progress-bar progress-bar-danger' style='width: 0%'></div></div>");
	                });
	            },
	
	            BeforeUpload: function(up, file) {
	                setUploadParam(up, file.name, true);
	            },
	
	            UploadProgress: function(up, file) {
	                $("#"+containerId + " .progress").html("<div class='progress-bar progress-bar-danger' style='width: "+ file.percent +"%'></div>")
	                //$("#container_"+chapterIndex + "_" + classIndex).prev().find("i").text(file.percent);
	            },
	
	            FileUploaded: function(up, file, info) {
	            	$("#"+pickButtonId).attr("disabled", false).css("color", "black");
	                if (info.status == 200) {
	                	var url = host + g_object_name;
	                	var responseHeaders = info.responseHeaders;
	                	var md5 = responseHeaders.substring(responseHeaders.indexOf('"')+1,responseHeaders.lastIndexOf('"'));
	                	console.info("MD5:"+md5);
	                    console.info("Uploaded file:" + url);
	                    $("#"+hiddenField).attr("value",host + g_object_name); //回写url
	                    //TODO 上传成功
						$("#"+uploadPromptId).html("文件上传成功！").css('color','green');
						$("#"+alreadyUploadFileUrlId).empty();//清空回显的“文件上传成功！”
	                    $("#"+uploadFileUrlId).val(url+"$"+md5);
	                    
	                    $("#"+containerId + " .progress").remove();
	                    $("#"+uploadButtonId).hide();
	                }
	                else {
	                    //TODO 上传失败
	                }
	            },
	
	            Error: function(up, err) {
	                // TODO 上传失败
	                $("#"+uploadPromptId).html("文件上传失败！").css('color','red');
	                if(err.code == '-601'){//文件扩展名错误
	                	$("#"+uploadPromptId).append("文件扩展名应为"+uploadFileFormat+"格式。");
	                }
	                if(err.code == '-600'){//文件大小错误
	                	var size = maxFileSize-5;
	                	$("#"+uploadPromptId).append("文件大小不超过"+size+"MB。");
	                }
	                if(err.code == '-200'){//连接网络失败
	                	$("#"+uploadPromptId).append("请检查网络是否连接失败。");
	                }
	                
	            }
	        }
	    });
	
	    uploader.init();
	
	    // 设置文件参数
	    var setUploadParam = function(up, filename, ret){
	
	        if (ret == false){
	            ret = getSignature();
	        }
	
	        g_object_name = key;
	
	        if (filename != '') {
	            calculateObjectName(filename);
	        }
	
	        new_multipart_params = {
	            'key' : g_object_name,
	            'policy': policyBase64,
	            'OSSAccessKeyId': accessid,
	            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
	            'signature': signature
	        };
	
	        up.setOption({
	            'url': host,
	            'multipart_params': new_multipart_params
	        });
	
	        up.start();
	    };
	
	    // 获取签名
	    var getSignature = function(){
	        //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
	        now = timestamp = Date.parse(new Date()) / 1000;
	        if (expire < now + 30)
	        {
	            // 请求后台签名认证,封装的tf方法同步请求有问题,换用原生的方法
	
	            $.ajax({
	                type: "POST",
	                url: tf.contextPath + '/common/OSSPostObjectPolicy/requestUploadPolicy.htm',
	                async: false,
	                dataType : "json",
	                success: function (result) {
	                    host = result['host'];
	                    policyBase64 = result['policy'];
	                    accessid = result['accessid'];
	                    signature = result['signature'];
	                    expire = parseInt(result['expire']);
	                    key = result['dir'];
	                }
	            });
	
	        }
	        return false;
	    };
	
	    // 获取上传文件后缀名
	    var getSuffix = function(filename) {
	        pos = filename.lastIndexOf('.');
	        suffix = '';
	        if (pos != -1) {
	            suffix = filename.substring(pos);
	        }
	        return suffix;
	    };
	
	    // 计算文件名
	    var calculateObjectName = function(filename){
	        suffix = getSuffix(filename);
	        //g_object_name = key + randomString() + suffix;
	    	var uploadFileUrl = $('#'+uploadFileUrlId).val();
	    	if(!tf.str.isNullOrWhiteSpace(uploadFileUrl)){//有上传文件URL，是修改上传附件，获取原URL的GUID，拼接到新的附件上。
	    		var GUID = uploadFileUrl.substring(uploadFileUrl.lastIndexOf('/')+1,uploadFileUrl.lastIndexOf('/')+37);
	    		g_object_name = key + GUID + suffix;
	    	}else{//没有上传文件URL，是新增上传附件，请求后台生成GUID，拼接到附件名上。
	    		tf.submit({//生成GUID拼接到文件名前
	    			async: false,//必须用同步，异步会出问题
					url : tf.contextPath + '/common/GUIDUtil/getGUID.htm',
					msg : "数据加载中...",
					data : {
					},
					success : function(result) {
						g_object_name = key + result + suffix;
					}
				});
	    	}
	    };
		    
	    // 随机文件名
	    var randomString = function(len){
	        len = len || 32;
	        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	        var maxPos = chars.length;
	        var pwd = '';
	        for (i = 0; i < len; i++) {
	            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	        }
	        return pwd;
	    };
	
	};
	/**
	 * 下载附件
	 * 使用方法：<a id="${data.attachmentcode}" onclick="downloadAttachment(this)">下载附件</a>
	 * ${data.attachmentcode}是附件ID
	 * @param obj
	 */
	uploader.downloadAttachment = function(obj){
		var attachmentcode = $(obj).attr("id");
		if(!tf.str.isNullOrWhiteSpace(attachmentcode)){
			//根据attachmentcode 获取附件的URL
			window.location.href = tf.contextPath + '/common/download/attmentSortDownload.htm?attachmentId='+attachmentcode;
		}	
	};
	
	/**
	 * 下载附件解密标书
	 */
	uploader.downloadAttachmentPdf = function(obj){
		var attachmentcode = $(obj).attr("id");
		if(!tf.str.isNullOrWhiteSpace(attachmentcode)){
			//根据attachmentcode 获取附件的URL
			window.location.href = tf.contextPath + '/common/download/attmentSortDownloadPdf.htm?attachmentId='+attachmentcode;
		}	
	};
}));