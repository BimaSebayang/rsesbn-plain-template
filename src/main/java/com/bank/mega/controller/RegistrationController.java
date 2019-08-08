package com.bank.mega.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.bank.mega.bean.UserBean;
import com.google.gson.Gson;

@Controller
@RequestMapping("/registration")
public class RegistrationController {

	
	    @PostMapping("/check-ektp")
	    public String processForm(@ModelAttribute UserBean user) {
            System.err.println(new Gson().toJson(user));
	        return "login";
	    }
	    
}
