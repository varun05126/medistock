package com.medistock.service;

import com.medistock.entity.ExpiryTracking;
import com.medistock.repository.ExpiryTrackingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpiryTrackingService {

    private final ExpiryTrackingRepository expiryTrackingRepository;

    public ExpiryTrackingService(ExpiryTrackingRepository expiryTrackingRepository) {
        this.expiryTrackingRepository = expiryTrackingRepository;
    }

    public List<ExpiryTracking> getExpiringSoonBatches(int withinDays) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(withinDays);
        List<ExpiryTracking> results = expiryTrackingRepository.findByExpiryDateBetween(today, futureDate);
        if (results.isEmpty()) {
            return expiryTrackingRepository.findByStatus("NEAR_EXPIRY");
        }
        return results;
    }

    public List<ExpiryTracking> getExpiredBatches() {
        List<ExpiryTracking> results = expiryTrackingRepository.findByExpiryDateBefore(LocalDate.now());
        if (results.isEmpty()) {
            return expiryTrackingRepository.findByStatus("EXPIRED");
        }
        return results;
    }

    public List<ExpiryTracking> getAllExpiryTracking() {
        return expiryTrackingRepository.findAll();
    }
}
