package com.tf.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * com.tf.controller
 * DESCRIPTION :
 *
 * @author zhzhy
 * @create 2018-01-03 10:00
 **/

@Controller
@RequestMapping(value = "/test")
public class TestController {

    @RequestMapping(value = "/test")
    public String doTest() {
        return "test";
    }

}