package com.inventory.inventory_management.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "construction_materials")
@Data
public class ConstructionMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g. "Cement", "Sand", "Clay", "Iron"

    // Size specification (e.g. "8mm", "12mm", "16mm" for Iron rebar; null for Sand/Cement)
    private String specification;

    @Column(name = "price_per_kg", nullable = false)
    private BigDecimal pricePerKg;

    @Column(name = "quantity_in_kg", nullable = false)
    private Double quantityInKg;


}
