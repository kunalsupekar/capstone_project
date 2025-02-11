package com.ems.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import com.ems.model.User;
import com.ems.model.UserDto;



public interface UserService {

	// Saves a user
	User save(UserDto user);

	// Retrieves all users
	List<User> findAll();

	// Retrieves a user by username
//    User findOne(String email);

	User createUser(UserDto user);

	String sendHtmlEmail(String toEmail, String subject, String body);

	public UserDetails loadUserByUsername(String email);
	
	
}