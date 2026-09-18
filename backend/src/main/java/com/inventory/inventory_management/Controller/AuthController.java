package com.inventory.inventory_management.Controller;

import com.inventory.inventory_management.config.JwtService;
import com.inventory.inventory_management.model.LoginResponse;
import com.inventory.inventory_management.model.User;
import com.inventory.inventory_management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        User user = userRepository
                .findByEmail(loginUser.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        }

        // BCrypt password verification
        if (!passwordEncoder.matches(
                loginUser.getPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        }

        // Generate JWT after successful login
        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        LoginResponse response = new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token
        );

        return ResponseEntity.ok(response);
    }
}