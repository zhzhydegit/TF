package com.tf.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * PACKAGE_NAME
 * DESCRIPTION :
 *
 * @author zhzhy
 * @create 2018-01-02 17:01
 **/

@Controller
@RequestMapping("/test")
public class TestController {

    @RequestMapping("/test")
    public String doTest() {
        /**
         * 在这里进行修改，查看能否同步到gitHub上
         */

        return "test";
    }

}