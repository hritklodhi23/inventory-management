package com.inventory.inventory_management.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "inventory-management-secret-key-2026-super-secure";

    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24; // 24 hours

    private final SecretKey key = Keys.hmacShaKeyFor(
            SECRET_KEY.getBytes(StandardCharsets.UTF_8)
    );

    public String generateToken(Long userId, String email, String role) {

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(key)
                .compact();
    }
}