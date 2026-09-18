package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.model.ConstructionMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConstructionMaterialRepository extends JpaRepository<ConstructionMaterial, Long> {
    List<ConstructionMaterial> findByName(String name);
    List<ConstructionMaterial> findByNameAndSpecification(String name, String specification);
}