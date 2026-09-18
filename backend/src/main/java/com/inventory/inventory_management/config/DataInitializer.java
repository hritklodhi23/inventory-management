package com.inventory.inventory_management.config;

import com.inventory.inventory_management.model.User;
import com.inventory.inventory_management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {

                User admin = new User();

                admin.setName("Admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(
                        passwordEncoder.encode("123456")
                );
                admin.setRole("ADMIN");

                userRepository.save(admin);

                System.out.println("Admin user created successfully.");
            }
        };
    }
}