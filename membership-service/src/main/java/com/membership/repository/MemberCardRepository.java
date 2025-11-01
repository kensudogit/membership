package com.membership.repository;

import com.membership.entity.MemberCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberCardRepository extends JpaRepository<MemberCard, Long> {
    
    Optional<MemberCard> findByCardNumber(String cardNumber);
    
    List<MemberCard> findByMemberId(Long memberId);
    
    List<MemberCard> findByMemberIdAndStatus(Long memberId, String status);
}

