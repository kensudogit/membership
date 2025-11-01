package com.membership.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "members", indexes = {
    @Index(name = "idx_members_store_id", columnList = "store_id"),
    @Index(name = "idx_members_status", columnList = "status"),
    @Index(name = "idx_members_enrollment_date", columnList = "enrollment_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Member {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "member_code", unique = true, nullable = false, length = 50)
    private String memberCode;
    
    @Column(name = "store_id")
    private Long storeId;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(name = "first_name_kana", length = 100)
    private String firstNameKana;
    
    @Column(name = "last_name_kana", length = 100)
    private String lastNameKana;
    
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "birthday")
    private LocalDate birthday;
    
    @Column(name = "gender", length = 10)
    private String gender;
    
    @Column(name = "address", length = 500)
    private String address;
    
    @Column(name = "postal_code", length = 10)
    private String postalCode;
    
    @Column(name = "member_type", nullable = false, length = 50)
    private String memberType;
    
    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE";
    
    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate;
    
    @Column(name = "enrollment_method", nullable = false, length = 50)
    private String enrollmentMethod;
    
    @Column(name = "face_recognition_data", columnDefinition = "TEXT")
    private String faceRecognitionData;
    
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;
    
    @Column(name = "ip_whitelist", columnDefinition = "TEXT[]")
    private String[] ipWhitelist;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

