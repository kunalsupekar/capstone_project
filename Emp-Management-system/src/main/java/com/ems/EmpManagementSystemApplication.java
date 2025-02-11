package com.ems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.ems.service.UserService;
import com.ems.service.serviceImpl.UserServiceImpl;

@SpringBootApplication
public class EmpManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmpManagementSystemApplication.class, args);
		System.out.println("hiii");
	}
	
	

}
