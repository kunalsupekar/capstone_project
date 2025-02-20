package com.ems.controller;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ems.config.TokenUtil;
import com.ems.model.AuthToken;
import com.ems.model.LoginUser;
import com.ems.model.Entity.AccessHistory;
import com.ems.model.Entity.User;
import com.ems.model.dto.UserDto;
import com.ems.repository.UserDao;
import com.ems.service.FileUploaderService;
import com.ems.service.UserService;
import com.ems.service.serviceImpl.AccessHistoryServiceImpl;
import com.ems.service.serviceImpl.AuthenticationService;
import com.ems.util.UserStatus;

import lombok.extern.slf4j.Slf4j;

/**
 * Rest Controller for users end-point
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
@Slf4j
public class UserController {
	
	@Autowired
	AuthenticationService authenticationService;

	@Autowired
	private UserService userService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private AccessHistoryServiceImpl accessHistoryService;

	@Autowired
	private FileUploaderService fileUploaderService;

	// Authentication and Login/Registration

	@PostMapping("/authenticate")
	public ResponseEntity<?> authenticateUser(@RequestBody LoginUser loginUser) throws AuthenticationException {

		log.debug("Attempting authentication for: " + loginUser.getEmail());

		Optional<AuthToken> authToken = authenticationService.generateToken(loginUser);

		if (authToken.isPresent()) {

			log.debug("Authentication Success for: " + loginUser.getEmail());

			// Updating Access history upon authentication
			Long currentUserId = getUserIdWithEmail(loginUser.getEmail()).orElse(0L);
			accessHistoryService.loggedIn(currentUserId, LocalDateTime.now());

			return ResponseEntity.ok(authToken.get());

		} else {
			log.error("Authentication failed: Bad credentials for user " + loginUser.getEmail());

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
		}

	}

	@PostMapping("/register")
	public User registerUser(@RequestBody UserDto user) {
		user.setStatus("PENDING");
		return userService.save(user);
	}

	// ADMIN ROLE

	@Secured("ADMIN")
	@GetMapping("/adminping")
	public String adminPing() {
		return "Only Admins Can Read This";
	}

	@Secured("ADMIN")
	@PostMapping("/create")
	public User createUser(@RequestBody UserDto user) {
		return userService.createUser(user);
	}

	@Secured("ADMIN")
	@GetMapping("/find/all")
	public List<User> getAllUser() {
		return userService.findAll();
	}

	@Secured("ADMIN")
	@GetMapping("/accessHistory")
	public List<AccessHistory> getAccessHistory() {
		return accessHistoryService.getAllHistory();
	}

	// USER ROLE

	@Secured("USER")
	@GetMapping("/get/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		Optional<User> updatedUser = userService.findByid(id);
		return updatedUser
				.map(user -> ResponseEntity.ok(user))
				.orElse(ResponseEntity.notFound().build());
	}

	@Secured("USER")
	@RequestMapping(value = "/userping", method = RequestMethod.GET)
	public String userPing() {
		return "Any User Can Read This";
	}

	// NO ROLE Base AUTHORIZATION

	@GetMapping("/admins")
	public List<User> getAllAdmins() {
		return userService.findAllAdmins();
	}

	@PostMapping("/upload")
	public List<User> registerUsers(@RequestParam("file") MultipartFile file) {
		return fileUploaderService.uploadAndCreateUsers(file);
	}

	@PutMapping("/edit/{id}")
	public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserDto updatedUserDto) {
		User updatedUser = userService.updateUser(id, updatedUserDto);
		return ResponseEntity.ok(updatedUser);
	}

	@GetMapping("/find/{email}")
	public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
		String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);
		
		log.debug("Decoded Email: " + decodedEmail);
		
		return userService.findByEmail(decodedEmail)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/stats")
	public Map<String, Integer> getUserStatus() {
		System.out.println("notification");
		Map<String, Integer> stats = new HashMap<>();
		stats.put("activeUsers", userDao.countByStatus(UserStatus.ACTIVE));
		stats.put("inactiveUsers", userDao.countByStatus(UserStatus.INACTIVE));
		stats.put("pendingUsers", userDao.countByStatus(UserStatus.PENDING));
		return stats;
	}

	@GetMapping("/getId/{usermail}")
	public ResponseEntity<Long> getUserIdByMail(@PathVariable String usermail) {
		Optional<User> userId = userService.findByEmail(usermail);
		return userId.map(user -> ResponseEntity.ok(user.getId())).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping("/{userId}/make-admin")
	public ResponseEntity<String> makeUserAdmin(@PathVariable Long userId) {
		userService.makeUserAdmin(userId);
		return ResponseEntity.ok("User with ID " + userId + " is now an Admin.");
	}

	// UTILITY
	public Optional<Long> getUserIdWithEmail(String usermail) {
		return userService.findByEmail(usermail).map(user -> user.getId());
	}

}