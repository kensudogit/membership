package com.membership.service;

import com.membership.entity.Member;
import com.membership.entity.MemberCard;
import com.membership.repository.MemberCardRepository;
import com.membership.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {
    
    private final MemberRepository memberRepository;
    private final MemberCardRepository memberCardRepository;
    
    public Member createMember(Member member) {
        if (member.getMemberCode() == null || member.getMemberCode().isEmpty()) {
            member.setMemberCode(generateMemberCode());
        }
        if (member.getEnrollmentDate() == null) {
            member.setEnrollmentDate(LocalDate.now());
        }
        return memberRepository.save(member);
    }
    
    @Transactional(readOnly = true)
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public Member getMemberByCode(String memberCode) {
        return memberRepository.findByMemberCode(memberCode)
            .orElseThrow(() -> new RuntimeException("Member not found with code: " + memberCode));
    }
    
    @Transactional(readOnly = true)
    public Page<Member> getAllMembers(Pageable pageable) {
        return memberRepository.findAll(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Member> getMembersByStore(Long storeId, Pageable pageable) {
        return memberRepository.findByStoreId(storeId, pageable);
    }
    
    public Member updateMember(Long id, Member updatedMember) {
        Member member = getMemberById(id);
        member.setFirstName(updatedMember.getFirstName());
        member.setLastName(updatedMember.getLastName());
        member.setEmail(updatedMember.getEmail());
        member.setPhone(updatedMember.getPhone());
        member.setAddress(updatedMember.getAddress());
        member.setStatus(updatedMember.getStatus());
        return memberRepository.save(member);
    }
    
    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }
    
    public MemberCard issueMemberCard(Long memberId, String cardType) {
        Member member = getMemberById(memberId);
        
        MemberCard card = new MemberCard();
        card.setMemberId(memberId);
        card.setCardNumber(generateCardNumber());
        card.setCardType(cardType);
        card.setIssuedDate(LocalDate.now());
        card.setQrCode(generateQRCode(member.getMemberCode()));
        
        return memberCardRepository.save(card);
    }
    
    @Transactional(readOnly = true)
    public java.util.List<MemberCard> getMemberCards(Long memberId) {
        return memberCardRepository.findByMemberId(memberId);
    }
    
    private String generateMemberCode() {
        return "MEM" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private String generateCardNumber() {
        return "CARD" + System.currentTimeMillis();
    }
    
    private String generateQRCode(String memberCode) {
        // QRコード生成ロジック（実際の実装ではQRコードライブラリを使用）
        return "QR:" + memberCode + ":" + System.currentTimeMillis();
    }
}

