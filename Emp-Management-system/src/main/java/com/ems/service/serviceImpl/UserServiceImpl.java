package com.ems.service.serviceImpl;

import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ems.model.Role;
import com.ems.model.User;
import com.ems.model.UserDto;
import com.ems.repository.UserDao;
import com.ems.service.RoleService;
import com.ems.service.UserService;

import jakarta.mail.internet.MimeMessage;

@Service(value = "userService")
public class UserServiceImpl implements UserDetailsService,UserService {

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserDao userDao; // Renamed from userRepository to avoid confusion

    @Autowired
    private BCryptPasswordEncoder bcryptEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public String sendHtmlEmail(String toEmail, String subject, String body) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom("abhishekbhosale676@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(mimeMessage);
            return "Email sent to " + toEmail;
        } catch (Exception e) {
            e.printStackTrace(); // Log the full error
            return "Error sending email to " + toEmail + ": " + e.getMessage();
        }
    }

    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Send the email *after* successful retrieval of user details
        sendLoginConfirmationEmail(user);  // Call the new method

        return org.springframework.security.core.userdetails.User
        	    .withUsername(user.getEmail())
        	    .password(user.getPassword()) // Ensure password is encoded
        	    .authorities(mapRolesToAuthorities(user.getRoles()))  // ✅ Convert roles to GrantedAuthority
        	    .accountExpired(false)
        	    .accountLocked(false)
        	    .credentialsExpired(false)
        	    .disabled(false)
        	    .build();
    }

    private void sendLoginConfirmationEmail(User user) {
        String toEmail = user.getEmail();
        String subject = "Welcome to EMS - Login Confirmation";
        String body = "<html><body>"
                    + "<p>Dear " + user.getFirstName() + ",</p>"  // Assuming User has a firstName
                    + "<p>Thank you for logging into the Employee Management System!</p>"
                    + "<p>If you did not initiate this login, please contact us immediately.</p>"
                    + "<p>Best regards,<br/>The EMS Team</p>"
                    + "</body></html>";

        String result = sendHtmlEmail(toEmail, subject, body);
        System.out.println("Email sending result: " + result); // Log the result
    }
    
    private List<SimpleGrantedAuthority> mapRolesToAuthorities(Set<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName())) // Ensure ROLE_prefix
                .collect(Collectors.toList());
    }

    private Collection<? extends GrantedAuthority> getAuthorities(Set<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findAll() {
        return (List<User>) userDao.findAll();
    }

    @Transactional
    @Override
    public User save(UserDto userDto) {
        User user = modelMapper.map(userDto, User.class);
        user.setPassword(bcryptEncoder.encode(userDto.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleService.findByName("USER");
        roles.add(userRole);

        if (userDto.getEmail().endsWith("@mitaoe.ac.in")) {
            Role adminRole = roleService.findByName("ADMIN");
            roles.add(adminRole);
        }

        user.setRoles(roles);
        return userDao.save(user);
    }

   

    @Transactional
    @Override
    public User createUser(UserDto userDto) {
        User user = modelMapper.map(userDto, User.class);
        user.setPassword(bcryptEncoder.encode(userDto.getPassword()));

        // Assign only the USER role
        Set<Role> roles = new HashSet<>();
        Role userRole = roleService.findByName("USER");
        roles.add(userRole);
        user.setRoles(roles);

        // Ensure registration time is set using Instant
        user.setRegisteredAt(Instant.now());

        User savedUser = userDao.save(user);

        // Send Registration Email

         String toEmail = savedUser.getEmail();
         String subject = "Welcome to EMS - Registration Confirmation";
         String body = "<html><body>"
                     + "<p>Dear " + savedUser.getFirstName() + ",</p>" 
                     + "<p>Thank you for registering with the Employee Management System!</p>"
                     + "<p>We are excited to have you on board.</p>"
                     + "<p>Best regards,<br/>The EMS Team</p>"
                     + "</body></html>";

         String result = sendHtmlEmail(toEmail, subject, body);
         System.out.println("Email sending result: " + result); 

        // Print registration time
        System.out.println("User registered at: " + savedUser.getRegisteredAt());

        return savedUser;
    }



}
