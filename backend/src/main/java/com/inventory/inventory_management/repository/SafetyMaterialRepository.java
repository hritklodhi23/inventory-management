package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.model.SafetyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SafetyMaterialRepository extends JpaRepository<SafetyMaterial, Long> {

}

