/**
 * 上传组件跟路径
 */
var plupload_path=document.scripts;
plupload_path=plupload_path[plupload_path.length-1].src.substring(0,plupload_path[plupload_path.length-1].src.lastIndexOf("/")+1);
plupload_path = plupload_path.replace('ext/', '');

plupload_path = tf.contextPath + '/jslib/plugins/plupload/2.2.1/';

/**
 * 
 * plupload扩展
 * 
 * Date: 2016-12-17
 * 
 * v2.2.1
 * 
 */
;(function(window, document, plupload, o, $) {

	var uploaders = {},
		upUtils = moxie.core.utils,
		upEnv = moxie.core.utils.Env,
		up_num_bl = false;	//标识选择文件是否超过上传数量
		
	
	upEnv.debug = {
		runtime: false,
		events: false,
		islog: true
	};	
	
	
	function _(str) {
		return plupload.translate(str) || str;
	}
	
	
	function renderUI(id, target, setting) {
		target.contents().each(function(i, node) {
			node = $(node);
	
			if (!node.is('.plupload')) {
				node.remove();
			}
		});
		
		target.prepend(
			'<div class="file-input plupload" id="'+ id +'_container">'+
				'<div class="file-preview" style="display:none;">'+
					'<div class="file-drop-disabled">'+
						'<div class="file-preview-thumbnails">'+
							'<div class="file-initial-thumbs plupload_filelist">'+
								
							'</div>'+
							'<div class="clearfix"></div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="file-caption-main">'+
					'<div class="file-buttons">'+
						'<div class="file-select" id="'+ id +'_browse" title="选择文件"><i></i><span class="btn-txt">选择</span></div>'+
						'<div class="file-upload plupload_start" title="开始上传"><i></i><span class="btn-txt">上传</span></div>'+
						'<div class="file-delete" title="删除选择文件"><i></i><span class="btn-txt">删除</span></div>'+
						'<div class="clearfix"></div>'+
					'</div>'+
				'</div>'+
				'<div style="display: none;">'+
					'<input type="hidden" id="'+ id +'_count" name="' + id + '_count" value="0" />' +
					'<input type="hidden" id="'+ setting.field +'" name="'+ setting.field +'"/>' +
				'</div>'+
			'</div>'
		);
	}
	
	
	/**
	 * 图片预览
	 */
	function previewImage(file){
		if(file){
			var fileImgObj = $('#'+file.id+'_img');
			
			if (/image\//.test(file.type)){		//文件为图片类型
				if(file.filePath){		//初始化地址
					fileImgObj.attr('src', file.filePath);
				} else {
					if(file.uploadPath){	//上传成功服务器地址
						fileImgObj.attr('src', file.uploadPath);
					} else {	//图片预览
						if(_checkPreviewSuffix(file)){	// 可预览文件
							if(upEnv.browser !== 'IE' || upEnv.version >= 9){
								_previewImage(file, function(imgSrc){
									fileImgObj.attr('src', imgSrc);
								});
							} else {	//IE9以下
								fileImgObj.attr('src', plupload_path + 'ext/img/preview.png');
							}
						} else {	//不可预览文件
							fileImgObj.attr('src', plupload_path + 'ext/img/preview.png');
						}
					}
				}
			} else {
				fileImgObj.attr('src', plupload_path + 'ext/img/preview.png');
			}
		}
		
		
		/**
		 * 验证文件是否可以预览
		 */
		function _checkPreviewSuffix(file){
			var fileSuffix = (file.name ? file.name : '').split('.')[1];
			if('jpeg,jpg,png,gif'.indexOf(fileSuffix.toLocaleLowerCase()) > -1){
				return true;
			} else {
				return false;
			}
		}
		
		
		/**
		 * plupload中为我们提供了mOxie对象
		 * 有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
	     * 如果你不想了解那么多的话，那就照抄本示例的代码来得到预览的图片吧
		 */
		function _previewImage(file, callback){
			if (file.type == 'image/gif') {			//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
	            var fr = new moxie.file.FileReader();
	            fr.onload = function () {
	                callback(fr.result);
	                fr.destroy();
	                fr = null;
	            }
	            fr.readAsDataURL(file.getSource());
	        } else {
	            var preloader = new moxie.image.Image();
	            preloader.onload = function () {
	                preloader.downsize(160, 160);	//先压缩一下要预览的图片,宽300，高300
	                var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
	                callback && callback(imgsrc);	//callback传入的参数为预览图片的url
	                preloader.destroy();
	                preloader = null;
	            };
	            preloader.load(file.getSource());
	        }
		}
	}
	
	
	function handleStatus(file) {
		var actionClass;

		if (file.status == plupload.DONE) {
			actionClass = 'plupload_done';
		}

		if (file.status == plupload.FAILED) {
			actionClass = 'plupload_failed';
		}

		if (file.status == plupload.QUEUED) {
			actionClass = 'plupload_delete';
		}

		if (file.status == plupload.UPLOADING) {
			actionClass = 'plupload_uploading';
		}

		var icon = $('#' + file.id).attr('class', actionClass).find('a').css('display', 'block');
		if (file.hint) {
			icon.attr('title', file.hint);
		}
	}
	
	
	/**
	 * 更新文件列表
	 */
	function updateList(up, files) {
		var target = up.getOption().container;
		var fileList = $('div.plupload_filelist', target), inputCount = 0, inputHTML;

		if(up.files.length < 1){
			$('div.file-preview', target).css('display', 'none');
			$(target).refresh();
		}
		
		if(files.length < 1){
			return false;
		}
		
		$('div.file-preview', target).css('display', 'block');
		
		
		$.each(files, function(i, file) {
			
			fileList.append(
				'<div class="file-preview-frame file-preview-initial" id="'+ file.id +'">'+
					'<div class="kv-file-content">'+
						'<img src="" class="kv-preview-data file-preview-image" style="width:auto;height:160px;" id="'+ file.id +'_img" title="'+ file.name +'" alt="'+ file.name +'">'+
					'</div>'+
					'<div class="file-thumbnail-footer">'+
						'<div class="file-footer-caption" title="'+ file.name +'">'+ file.name +'<br><samp>('+ plupload.formatSize(file.size) +')</samp></div>'+
						'<div class="file-thumb-progress">'+
							'<div class="progress">'+
								'<div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:'+ file.percent +'%;">'+ file.percent +'%</div>'+
							'</div>'+
						'</div>'+
						'<div class="file-actions">'+
							'<div class="file-footer-buttons">'+
								'<div class="action-del" title="删除"></div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'
			);
			
			
			// 删除图片操作
			$('#' + file.id + ' .file-actions .action-del').click(function(e) {
				
				var fieldObj = $('#'+up.getOption().field);
				var fieldVal = fieldObj.val();
				if(file.filePath){	//初始化加载的图片地址
					fieldVal = fieldVal.replace(file.filePath+'^', '');
					fieldVal = fieldVal.replace(file.filePath, '');
				} else if(file.uploadPath){		//上传成功的图片地址
					fieldVal = fieldVal.replace(file.uploadPath+'^', '');
					fieldVal = fieldVal.replace(file.uploadPath, '');
				}
				fieldObj.val(fieldVal);
				
				
				$('#' + file.id).remove();
				if(file.isOldData){
					up.files.splice($.inArray(file, up.files), 1);
				} else {
					up.removeFile(file);
				}
				
				if(up.files.length < 1){
					$('div.file-preview', target).css('display', 'none');
				}
				
				$(target).refresh();
				e.preventDefault();
			});
			
			
			// 图片预览
			previewImage(file);
			
			
			if(file.isOldData){
				$('samp', target).html('&nbsp;');
				$('div.progress-bar', target).html('<em>已上传</em>');
			}
			
			$('div.plupload_start', target).removeClass('plupload_disabled');
			
			$(target).refresh();
		});
	}
	
	
	/**
	 * 组件初始化加载数据
	 */
	function initLoadData(up){
		var opt = up.getOption();
		var filesStr = opt.filesStr;	//文件地址字符串
		if(filesStr && filesStr != ''){
			$('#'+opt.field).val(filesStr);
			
			var fileList = filesStr.split('^');
			
			showFile(up, fileList);
		}
	}
	
	/**
	 * 显示文件
	 */
	function showFile(up, fileList){
		if(up && fileList && fileList.length > 0){
			$.each(fileList, function(i, file) {
				if(file && '' != file){
					var temp = file;
					if(file.indexOf('?') > -1){
						temp = file.split('?')[0];
					}
					var fileName = temp.substring(temp.lastIndexOf('\/')+1);
					var suffixPos = temp.lastIndexOf('.');
					var suffix = null;
					if (suffixPos != -1) {
				        suffix = temp.substring(suffixPos+1).toLocaleLowerCase();
				    }
				    
				    if(fileName) {
				    	var tempFile = {
							"id": upUtils.Basic.guid('f_'),
							"name": fileName,
							"percent": 100,
							"size": "0",
							"isOldData": true
						};
						
						if(suffix != null){
							if(',jpeg,jpg,gif,png,bmp,'.indexOf(','+ suffix +',') > -1){
								tempFile.type = 'image/'+suffix;
								tempFile.filePath = file;
							}
						}
						
						up.files.push(tempFile);
				    }
				}
			});
			
			updateList(up, up.files);
		}
	}
	
	
	window.onresize = function(){
		for(var key in uploaders){
			$('#'+key).refresh();
		}
	};
	
	
	/**
	 * 组件刷新
	 */
	$.fn.refresh = function(){
		var target = $(this);
		
		var moxie_shim = $('.moxie-shim', target);
		var file_select = $('.file-select', target);
		
		moxie_shim.css({
			top: file_select.position().top,
			left: file_select.position().left,
			width: file_select.outerWidth(true),
			height: file_select.outerHeight(true)
		});
	};
	
	/**
	 * 显示文集
	 * 传入文件地址集合
	 */
	$.fn.showFiles = function(up, fileList){
		showFile(up, fileList);
	};

	/**
	 * 清空上传组件
	 */
	$.fn.removeFiles = function(up){
		var target = $(this);
		
		$('div.plupload_start', target).addClass('plupload_disabled');
		$('div.file-preview', target).css('display', 'none');
		
		$('div.plupload_filelist', target).html('');
		$('#'+ up.getOption().field).val('');
		
		$.each(up.files.concat(), function(i, file) {
			if(file){
				if(file.isOldData){
					up.files.splice($.inArray(file, up.files), 1);
				} else {
					up.removeFile(file);
				}
			}
		});
		
		up.stop();
		target.refresh();
	};
	
	
	$.fn.pluploadTF = function(settings) {
		if (settings) {
			this.each(function() {
				var uploader, target, id, contents_bak,
					field = settings.field;		//（扩展）表单提交字段
				
				target = $(this);
				id = target.attr('id');

				if (!id) {
					id = plupload.guid();
					target.attr('id', id);
				}

				contents_bak = target.html();
				renderUI(id, target, settings);
				
				
				//参数设置
				settings = $.extend({
					runtimes : 'html5,flash,silverlight,html4',
					//runtimes : 'flash',
					unique_names : true,		//当值为true时会为每个上传的文件生成一个唯一的文件名，并作为额外的参数post到服务器端，参数明为name,值为生成的文件名
					
					flash_swf_url : plupload_path + 'Moxie.swf',
					silverlight_xap_url : plupload_path + 'Moxie.xap',
					
					dragdrop : true,
					browse_button : id + '_browse',		//触发文件选择对话框的DOM元素，当点击该元素后便后弹出文件选择对话框。该值可以是DOM元素对象本身，也可以是该DOM元素的id
					container : id,						//用来指定Plupload所创建的html结构的父容器，默认为前面指定的browse_button的父元素。该参数的值可以是一个元素的id,也可以是DOM元素本身
					
					
					//========== 自定义参数 ==========//
					up_num: 1	//上传数量控制
				}, settings, {
					'success_action_status' : '200'	 	//让服务端返回200,不然，默认会返回204
				});
				
				
				uploader = new plupload.Uploader(settings);
				uploaders[id] = uploader;
				
				
				//当Plupload初始化完成后触发
				uploader.bind('Init', function(up, res) {
					
					// 开始上传事件
					$('div.plupload_start', target).click(function(e) {
						if (!$(this).hasClass('plupload_disabled') && up.files.length > 0) {
							up.start();
						}
						e.preventDefault();
					});


					$('div.plupload_start', target).addClass('plupload_disabled');
				});
				
				
				//当Init事件发生后触发
				uploader.bind("PostInit", function(up) {
					
					initLoadData(up);
					
					// 删除所有上传文件
					$('div.file-delete', target).click(function(e) {
						$('div.plupload_start', target).addClass('plupload_disabled');
						$('div.file-preview', target).css('display', 'none');
						
						$('div.plupload_filelist', target).html('');
						$('#'+ field).val('');
						
						$.each(up.files.concat(), function(i, file) {
							if(file){
								if(file.isOldData){
									up.files.splice($.inArray(file, up.files), 1);
								} else {
									up.removeFile(file);
								}
							}
						});
						
						e.preventDefault();
						uploader.stop();
						target.refresh();
					});
				});
				
				
				//当文件添加到上传队列后触发
				uploader.bind('FilesAdded', function(up, files){
					//清洗本次添加到上传队列里的文件,与上传队列保持一致
					$.each(files.concat(), function(i, file) {
						if($.inArray(file, up.files) < 0){
							files.splice($.inArray(file, files),1); 
						}
					});
					updateList(up, files);
					
					
					if(up_num_bl){
						alert('只允许上传' + settings.up_num + '个附件');
					}
					
					if($.isFunction(settings.FilesAdded)){
						settings.FilesAdded();
					}
				});
				
				
				// 会在文件上传过程中不断触发，可以用此事件来显示上传进度
				uploader.bind("UploadProgress", function(up, file) {
					//上传进度
					if(file.percent < 90){
						$('div.progress-bar', $('#'+file.id)).css('width', file.percent + '%').html(file.percent + '%');
					}
					
				});
				
				
				//暂不清楚该事件的意义，但根据测试得出，该事件会在每一个文件被添加到上传队列前触发
				uploader.bind('FileFiltered', function(up, file){
					/*================= 控制上传数量扩展 Begin =================*/
					up_num_bl = false;
					if(up.files.length > settings.up_num){
						up.removeFile(file);
						up_num_bl = true;
						return false;
					}
					/*================= 控制上传数量扩展 End =================*/
				});
				
				
				// 当队列中的某一个文件上传完成后触发
				uploader.bind('FileUploaded', function(up, file, resp) {
					
					//上传成功
                        if(resp.status == 200) {
						if(resp.response){
							var response = resp.response;
							var resJson = response;
							if ($.type(response) == "string") {
								resJson = $.parseJSON(response)
							}
							
							var filePath = resJson.filePath;
							file.uploadPath = filePath;
							var fieldObj = $('#'+field);
							var fieldVal = fieldObj.val();
							fieldVal += filePath + '^';
							fieldObj.val(fieldVal);
							
							previewImage(file);
							
							upEnv.log('【uploadPath】' + filePath);

							$('div.progress-bar', $('#'+file.id)).css('width', '100%').html('100%');
						}
					}
				});
				
				
				//当发生错误时触发
				uploader.bind("Error", function(up, err) {
					var file = err.file, message;

					if (file) {
						message = err.message;

						if (err.details) {
							message += " (" + err.details + ")";
						}

						if (err.code == plupload.FILE_SIZE_ERROR) {
							alert(_("Error: File too large:") + " " + file.name);
						}

						if (err.code == plupload.FILE_EXTENSION_ERROR) {
							alert(_("Error: Invalid file extension:") + " " + file.name);
						}

						file.hint = message;
						$('#' + file.id).attr('class', 'plupload_failed').find('a').css('display', 'block').attr('title', message);
					}

					if (err.code === plupload.INIT_ERROR) {
						setTimeout(function() {
							destroy();
						}, 1);
					}
				});
				
				
				
				uploader.init();
			});
			
			
			//////////////////// 内部函数 Begin ////////////////////
			function destroy() {
				delete uploaders[id];
				uploader.destroy();
				target.html(contents_bak);
				uploader = target = contents_bak = null;
			}
			//////////////////// 内部函数 End ////////////////////
			
			return this;
		} else {
			return uploaders[$(this[0]).attr('id')];
		}
	};

} (window, document, plupload, moxie, jQuery));
