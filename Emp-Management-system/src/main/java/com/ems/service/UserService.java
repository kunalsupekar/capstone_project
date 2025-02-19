package com.ems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;

import com.ems.model.Entity.User;
import com.ems.model.dto.UserDto;

public interface UserService {

	User save(UserDto user);

	User createUser(UserDto user);

	User updateUser(Long userId, UserDto updatedUserDto);

	List<User> findAllAdmins();

	List<User> findAll();

	UserDetails loadUserByUsername(String email);

	Optional<User> findByEmail(String email);

	Optional<User> findByid(Long id);

	public void makeUserAdmin(Long userId);

}