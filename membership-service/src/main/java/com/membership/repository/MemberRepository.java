package com.membership.repository;

import com.membership.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    Optional<Member> findByMemberCode(String memberCode);
    
    Optional<Member> findByEmail(String email);
    
    Page<Member> findByStoreId(Long storeId, Pageable pageable);
    
    Page<Member> findByStatus(String status, Pageable pageable);
    
    @Query("SELECT m FROM Member m WHERE m.storeId = :storeId AND m.status = :status")
    Page<Member> findByStoreIdAndStatus(@Param("storeId") Long storeId, 
                                        @Param("status") String status, 
                                        Pageable pageable);
    
    @Query("SELECT m FROM Member m WHERE m.enrollmentDate BETWEEN :startDate AND :endDate")
    Page<Member> findByEnrollmentDateBetween(@Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate,
                                              Pageable pageable);
}

