package com.shop.cafe.controller;

import com.shop.cafe.dto.Like;
import com.shop.cafe.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin({"http://127.0.0.1:3000/","http://127.0.0.1:5500/","http://localhost:3000"})
public class LikeController {
    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addLike(@RequestBody Like like) {
        try {
            likeService.addLike(like);
            return ResponseEntity.ok("좋아요가 추가되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("좋아요 추가 실패");
        }
    }

    @PostMapping("/remove")
    public ResponseEntity<String> removeLike(@RequestBody Like like) {
        try {
            likeService.removeLike(like);
            return ResponseEntity.ok("좋아요가 제거되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("좋아요 제거 실패");
        }
    }

    @GetMapping("/isLiked")
    public ResponseEntity<Boolean> isLiked(@RequestParam String email) {
        try {
            return ResponseEntity.ok(likeService.isLiked(email));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(false);
        }
    }
}
