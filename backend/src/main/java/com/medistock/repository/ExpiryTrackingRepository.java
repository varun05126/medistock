package com.medistock.repository;

import com.medistock.entity.ExpiryTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpiryTrackingRepository extends JpaRepository<ExpiryTracking, Long> {
    List<ExpiryTracking> findByStatus(String status);
    List<ExpiryTracking> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);
    List<ExpiryTracking> findByExpiryDateBefore(LocalDate date);
    long countByStatus(String status);
}
