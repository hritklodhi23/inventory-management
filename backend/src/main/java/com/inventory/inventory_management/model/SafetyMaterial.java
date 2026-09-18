package com.inventory.inventory_management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "safety_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SafetyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g. "Safety Helmet", "Reflective Jacket", "Safety Boots", "Welding Glasses"

    @Column(name = "price_per_unit", nullable = false)
    private BigDecimal pricePerUnit;

    @Column(name = "quantity_in_stock", nullable = false)
    private Integer quantityInStock;


}
