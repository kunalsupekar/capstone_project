package com.ems.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.ems.model.User;

@Repository
public interface UserDao extends CrudRepository<User, Long> {
	Optional<User> findByEmail(String email);

}