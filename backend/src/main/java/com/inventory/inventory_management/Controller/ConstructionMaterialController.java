package com.inventory.inventory_management.Controller;

import com.inventory.inventory_management.model.ConstructionMaterial;
import com.inventory.inventory_management.model.MaterialUsageLog;
import com.inventory.inventory_management.repository.ConstructionMaterialRepository;
import com.inventory.inventory_management.repository.MaterialUsageLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/construction-materials")
public class ConstructionMaterialController {

    private final ConstructionMaterialRepository materialRepository;
    private final MaterialUsageLogRepository usageLogRepository;

    public ConstructionMaterialController(ConstructionMaterialRepository materialRepository, MaterialUsageLogRepository usageLogRepository) {
        this.materialRepository = materialRepository;
        this.usageLogRepository = usageLogRepository;
    }

    @GetMapping
    public List<ConstructionMaterial> getAllMaterials() {
        return materialRepository.findAll();
    }

    @PostMapping
    public ConstructionMaterial addMaterial(@RequestBody ConstructionMaterial material) {
        return materialRepository.save(material);
    }

    // Log material usage at location (e.g. "Tower 3 Floor 3")
    @PostMapping("/use")
    @Transactional
    public ResponseEntity<?> logMaterialUsage(
            @RequestParam Long materialId,
            @RequestParam Double quantityUsedKg,
            @RequestParam String locationUsed,
            @RequestParam(required = false, defaultValue = "Site Supervisor") String loggedBy) {

        ConstructionMaterial material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Construction material not found"));

        if (material.getQuantityInKg() < quantityUsedKg) {
            return ResponseEntity.badRequest().body("Insufficient stock! Available (kg): " + material.getQuantityInKg());
        }

        material.setQuantityInKg(material.getQuantityInKg() - quantityUsedKg);
        materialRepository.save(material);

        MaterialUsageLog log =  MaterialUsageLog.builder()
                .constructionMaterial(material)
                .quantityUsedKg(quantityUsedKg)
                .locationUsed(locationUsed)
                .usedDate(LocalDateTime.now())
                .loggedBy(loggedBy)
                .build();
        usageLogRepository.save(log);

        return ResponseEntity.ok(log);
    }

    // Find all material usage logs for a location (e.g. "Tower 3")
    @GetMapping("/usage-by-location")
    public List<MaterialUsageLog> getUsageByLocation(@RequestParam String location) {
        return usageLogRepository.findByLocationUsedContainingIgnoreCase(location);
    }

    // All usage logs, used by the Dashboard's activity feed
    @GetMapping("/usage-logs")
    public List<MaterialUsageLog> getAllUsageLogs() {
        return usageLogRepository.findAll();
    }

    // Edit a material's details (name, specification, price, quantity)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMaterial(@PathVariable Long id, @RequestBody ConstructionMaterial updated) {
        return materialRepository.findById(id)
                .map(material -> {
                    material.setName(updated.getName());
                    material.setSpecification(updated.getSpecification());
                    material.setPricePerKg(updated.getPricePerKg());
                    material.setQuantityInKg(updated.getQuantityInKg());
                    return ResponseEntity.ok(materialRepository.save(material));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}