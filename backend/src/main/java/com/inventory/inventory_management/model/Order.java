package com.inventory.inventory_management.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String materialName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String requestedBy;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private String status;
}