package com.ems.service.serviceImpl;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ems.model.Entity.User;
import com.ems.repository.UserDao;
import com.ems.util.UserStatus;


@Service
public class SchedulerService {

	private static final Logger logger = LoggerFactory.getLogger(SchedulerService.class);

	@Autowired
	private UserDao userRepository;

	@Scheduled(cron = "7 8 10 * * ?") //12 am midnight
	public void updateUserStatusToActive() {
		List<User> users = userRepository.findByStatus(UserStatus.PENDING);
		for (User user : users) {
			user.setStatus(UserStatus.ACTIVE);
			userRepository.save(user);
		}

		logger.info("Updated {} users to ACTIVE status.", users.size());
	}
}
