package com.inventory.inventory_management.Controller;

import com.inventory.inventory_management.dto.UserProfileResponse;
import com.inventory.inventory_management.model.User;
import com.inventory.inventory_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/email/{email}")
    public ResponseEntity<UserProfileResponse> getUserByEmail(
            @PathVariable String email) {

        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(
                        new UserProfileResponse(
                                user.getName(),
                                user.getEmail(),
                                user.getRole()
                        )
                ))
                .orElse(ResponseEntity.notFound().build());
    }
}