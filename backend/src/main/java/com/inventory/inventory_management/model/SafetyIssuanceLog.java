package com.inventory.inventory_management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "safety_issuance_logs")
public class SafetyIssuanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "worker_id", nullable = false)
    private String workerId; // e.g. "W-101"

    @Column(name = "worker_name", nullable = false)
    private String workerName; // e.g. "Ramesh Kumar"

    @ManyToOne
    @JoinColumn(name = "safety_material_id", nullable = false)
    private SafetyMaterial safetyMaterial;

    @Column(name = "quantity_issued", nullable = false)
    private Integer quantityIssued;

    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate;

    private String remarks;



}
