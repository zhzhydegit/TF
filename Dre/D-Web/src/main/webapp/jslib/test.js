require(['tfExt','pluploadTF'],function () {

    $(function () {
        $("#btn").click(function () {
            tf.alert("Hello,Word!!!")
        });

        $("#pl_upload").pluploadTF({
            field : 'enen',
            filesStr: 'en',
            up_num: 1,
            url : tf.contextPath + '/upload',
            filters : {
                mime_types: [
                    {title : "Image files", extensions : "pdf,docx,txt"}
                ]
            }
        })





    })
})