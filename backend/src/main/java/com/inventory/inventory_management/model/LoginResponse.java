package com.inventory.inventory_management.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String token;
}