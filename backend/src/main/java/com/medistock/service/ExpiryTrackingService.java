package com.medistock.service;

import com.medistock.entity.MedicineBatch;
import com.medistock.repository.MedicineBatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpiryTrackingService {

    private final MedicineBatchRepository batchRepository;

    public List<MedicineBatch> getExpiringSoonBatches(int withinDays) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(withinDays);
        return batchRepository.findByExpiryDateBetween(today, futureDate);
    }

    public List<MedicineBatch> getExpiredBatches() {
        return batchRepository.findByExpiryDateBeforeAndQuantityGreaterThan(LocalDate.now(), 0);
    }

    @Scheduled(cron = "0 0 1 * * ?") // Runs every day at 1:00 AM
    @Transactional
    public void scanAndFlagExpiringBatches() {
        LocalDate today = LocalDate.now();
        LocalDate nearExpiryThreshold = today.plusDays(30);

        List<MedicineBatch> batches = batchRepository.findAll();
        for (MedicineBatch batch : batches) {
            if (batch.getExpiryDate().isBefore(today)) {
                batch.setStatus("EXPIRED");
            } else if (batch.getExpiryDate().isBefore(nearExpiryThreshold)) {
                batch.setStatus("NEAR_EXPIRY");
            }
        }
        batchRepository.saveAll(batches);
    }
}
