package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.model.SafetyIssuanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SafetyIssuanceLogRepository extends JpaRepository<SafetyIssuanceLog, Long> {
    List<SafetyIssuanceLog> findByWorkerId(String workerId);
}