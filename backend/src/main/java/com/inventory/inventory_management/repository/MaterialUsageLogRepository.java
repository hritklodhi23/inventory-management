package com.inventory.inventory_management.repository;

import com.inventory.inventory_management.model.MaterialUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaterialUsageLogRepository extends JpaRepository<MaterialUsageLog, Long> {
    List<MaterialUsageLog> findByLocationUsedContainingIgnoreCase(String locationKey);
}
