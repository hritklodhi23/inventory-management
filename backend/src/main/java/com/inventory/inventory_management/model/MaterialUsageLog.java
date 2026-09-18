package com.inventory.inventory_management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "material_usage_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "construction_material_id", nullable = false)
    private ConstructionMaterial constructionMaterial;

    @Column(name = "quantity_used_kg", nullable = false)
    private Double quantityUsedKg;

    // Location format e.g. "Tower 3 Floor 3" or "Block A Foundation"
    @Column(name = "location_used", nullable = false)
    private String locationUsed;

    @Column(name = "used_date", nullable = false)
    private LocalDateTime usedDate;

    private String loggedBy;

}
