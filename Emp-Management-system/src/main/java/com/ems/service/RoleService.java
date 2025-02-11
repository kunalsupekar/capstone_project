package com.ems.service;

import com.ems.model.Role;

//Importing the Role model

//Declaring the RoleService interface
public interface RoleService {
	// Method to find a Role by its name
	Role findByName(String name);
}
