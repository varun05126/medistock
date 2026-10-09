package com.medistock.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicine_batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "batch_number", nullable = false, unique = true, length = 50)
    private String batchNumber;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    @Column(name = "manufacturing_date", nullable = false)
    private LocalDate manufacturingDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "purchase_price", precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "selling_price", precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Column(length = 30)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, NEAR_EXPIRY, EXPIRED, DEPLETED

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
