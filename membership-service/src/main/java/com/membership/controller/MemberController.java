package com.membership.controller;

import com.membership.entity.Member;
import com.membership.entity.MemberCard;
import com.membership.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Tag(name = "Member Management", description = "会員管理API")
public class MemberController {
    
    private final MemberService memberService;
    
    @PostMapping
    @Operation(summary = "新規会員登録", description = "Webまたはタブレットからの会員登録")
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member created = memberService.createMember(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "会員情報取得", description = "IDによる会員情報取得")
    public ResponseEntity<Member> getMember(@PathVariable Long id) {
        Member member = memberService.getMemberById(id);
        return ResponseEntity.ok(member);
    }
    
    @GetMapping("/code/{memberCode}")
    @Operation(summary = "会員情報取得（会員コード）", description = "会員コードによる会員情報取得")
    public ResponseEntity<Member> getMemberByCode(@PathVariable String memberCode) {
        Member member = memberService.getMemberByCode(memberCode);
        return ResponseEntity.ok(member);
    }
    
    @GetMapping
    @Operation(summary = "会員一覧取得", description = "ページネーション対応の会員一覧取得")
    public ResponseEntity<Page<Member>> getAllMembers(Pageable pageable) {
        Page<Member> members = memberService.getAllMembers(pageable);
        return ResponseEntity.ok(members);
    }
    
    @GetMapping("/store/{storeId}")
    @Operation(summary = "店舗別会員一覧取得", description = "店舗IDによる会員一覧取得")
    public ResponseEntity<Page<Member>> getMembersByStore(@PathVariable Long storeId, Pageable pageable) {
        Page<Member> members = memberService.getMembersByStore(storeId, pageable);
        return ResponseEntity.ok(members);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "会員情報更新", description = "会員情報の更新")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member member) {
        Member updated = memberService.updateMember(id, member);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "会員削除", description = "会員情報の削除")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{memberId}/cards")
    @Operation(summary = "会員証発行", description = "会員証の発行")
    public ResponseEntity<MemberCard> issueMemberCard(@PathVariable Long memberId, 
                                                      @RequestParam(defaultValue = "STANDARD") String cardType) {
        MemberCard card = memberService.issueMemberCard(memberId, cardType);
        return ResponseEntity.status(HttpStatus.CREATED).body(card);
    }
    
    @GetMapping("/{memberId}/cards")
    @Operation(summary = "会員証一覧取得", description = "会員の会員証一覧取得")
    public ResponseEntity<List<MemberCard>> getMemberCards(@PathVariable Long memberId) {
        List<MemberCard> cards = memberService.getMemberCards(memberId);
        return ResponseEntity.ok(cards);
    }
}

