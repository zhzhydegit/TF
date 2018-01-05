package com.tf.util;

import com.alibaba.fastjson.JSON;
import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * com.tf.util
 * DESCRIPTION :
 *
 * @author zhzhy
 * @create 2018-01-03 17:25
 **/


public class Upload extends HttpServlet {

    /**
     * 上传路径
     */
    private String uploadDir = "E:\\sun\\gitRepository\\TF\\Dre\\D-Web\\src\\main\\webapp\\WEB-INF\\static\\upload";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map<String,Object> map = new HashMap<String, Object>();

        //判断上传表单是否为multipart/form-data类型
        if (ServletFileUpload.isMultipartContent(req)){
            InputStream is = null;
            FileOutputStream fos = null;
            try {
                //创建解析器工厂
                DiskFileItemFactory factory = new DiskFileItemFactory();
                //设置缓冲区大小 默认为10K
                factory.setSizeThreshold(1024);
                //获取解析器
                ServletFileUpload upload = new ServletFileUpload(factory);
                //设置解析器编码格式
                upload.setHeaderEncoding("UTF-8");
                //接收上传内容
                FileItemIterator fii = upload.getItemIterator(req);

                while (fii.hasNext()) {
                    FileItemStream fis = fii.next();
                    if (!fis.isFormField()) {
                        System.out.println(System.getProperty("file.separator"));
                        String fileName = fis.getName();
                        fileName =  fileName.substring(fileName.lastIndexOf("\\")+1);

                        is = fis.openStream();
                        fos = new FileOutputStream(uploadDir+"\\"+fileName);
                        byte[] byff = new byte[1024];

                        int len = 0;
                        while ((len=is.read(byff))>0) {
                            fos.write(byff);
                        }
                    }
                }

            } catch (FileUploadException e) {
                e.printStackTrace();
                System.out.println("出大事了");
            }finally {
                if (fos != null && is != null) {
                    fos.close();
                    is.close();
                }
            }

            map.put("success",true);
            map.put("msg","文件上传成功");

        }

    resp.getWriter().write(JSON.toJSONString(map));







    }
}