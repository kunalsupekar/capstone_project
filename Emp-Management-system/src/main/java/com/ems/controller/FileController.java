package com.ems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ems.model.Entity.File;
import com.ems.model.Entity.User;
import com.ems.repository.FileDao;
import com.ems.repository.UserDao;
import com.ems.service.FileService;

import jakarta.transaction.Transactional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
//@RequestMapping("/users/file")
public class FileController {

	@Autowired
	private UserDao userRepository;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileDao fileDao;

	@Transactional
	@PostMapping("/users/uploadFile/{userId}")
	public ResponseEntity<String> uploadFile(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {

		User existingUser = userRepository
				.findById(userId)
				.orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

		try {
			String fileUrl = fileService.uploadFile(file, userId);

			File userFile = new File(existingUser, file.getOriginalFilename(), fileUrl);
			
			fileDao.save(userFile);

			return ResponseEntity.ok().body(fileUrl);
		} catch (Exception e) {
			throw new RuntimeException("File upload failed for user ID " + userId + ": " + e.getMessage());
		}
	}
}