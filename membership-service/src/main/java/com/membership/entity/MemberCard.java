package com.membership.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "member_cards", indexes = {
    @Index(name = "idx_member_cards_member_id", columnList = "member_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MemberCard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "member_id", nullable = false)
    private Long memberId;
    
    @Column(name = "card_number", unique = true, nullable = false, length = 100)
    private String cardNumber;
    
    @Column(name = "card_type", nullable = false, length = 50)
    private String cardType;
    
    @Column(name = "issued_date", nullable = false)
    private LocalDate issuedDate;
    
    @Column(name = "expiry_date")
    private LocalDate expiryDate;
    
    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE";
    
    @Column(name = "qr_code", columnDefinition = "TEXT")
    private String qrCode;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

