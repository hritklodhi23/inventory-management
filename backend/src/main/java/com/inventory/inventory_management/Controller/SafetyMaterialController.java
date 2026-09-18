package com.inventory.inventory_management.Controller;

import com.inventory.inventory_management.model.SafetyIssuanceLog;
import com.inventory.inventory_management.model.SafetyMaterial;
import com.inventory.inventory_management.repository.SafetyIssuanceLogRepository;
import com.inventory.inventory_management.repository.SafetyMaterialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/safety-materials")
public class SafetyMaterialController {

    private final SafetyMaterialRepository materialRepository;
    private final SafetyIssuanceLogRepository logRepository;

    public SafetyMaterialController(SafetyMaterialRepository materialRepository, SafetyIssuanceLogRepository logRepository) {
        this.materialRepository = materialRepository;
        this.logRepository = logRepository;
    }

    @GetMapping
    public List<SafetyMaterial> getAllSafetyMaterials() {
        return materialRepository.findAll();
    }

    @PostMapping
    public SafetyMaterial addSafetyMaterial(@RequestBody SafetyMaterial material) {
        return materialRepository.save(material);
    }

    // Issue safety equipment to worker
    @PostMapping("/issue")
    @Transactional
    public ResponseEntity<?> issueToWorker(
            @RequestParam Long materialId,
            @RequestParam String workerId,
            @RequestParam String workerName,
            @RequestParam Integer quantity,
            @RequestParam(required = false) String remarks) {

        SafetyMaterial material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Safety material not found"));

        if (material.getQuantityInStock() < quantity) {
            return ResponseEntity.badRequest().body("Insufficient stock! Available: " + material.getQuantityInStock());
        }

        material.setQuantityInStock(material.getQuantityInStock() - quantity);
        materialRepository.save(material);

        SafetyIssuanceLog log = SafetyIssuanceLog.builder()
                .workerId(workerId)
                .workerName(workerName)
                .safetyMaterial(material)
                .quantityIssued(quantity)
                .issueDate(LocalDateTime.now())
                .remarks(remarks)
                .build();
        // Save issuance history
        logRepository.save(log);

        return ResponseEntity.ok(log);
    }

    // Get all safety items issued to a specific worker
    @GetMapping("/worker/{workerId}")
    public List<SafetyIssuanceLog> getWorkerHistory(@PathVariable String workerId) {
        return logRepository.findByWorkerId(workerId);
    }

    // All issuance logs, used by the Dashboard's activity feed
    @GetMapping("/logs")
    public List<SafetyIssuanceLog> getAllIssuanceLogs() {
        return logRepository.findAll();
    }

    // Edit a safety material's details (name, price, stock)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSafetyMaterial(@PathVariable Long id, @RequestBody SafetyMaterial updated) {
        return materialRepository.findById(id)
                .map(material -> {
                    material.setName(updated.getName());
                    material.setPricePerUnit(updated.getPricePerUnit());
                    material.setQuantityInStock(updated.getQuantityInStock());
                    return ResponseEntity.ok(materialRepository.save(material));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}