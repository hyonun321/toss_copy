package com.shop.cafe.dao;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import com.shop.cafe.dto.Member;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

@Repository
public class MemberDao {

    @Autowired
    private DataSource dataSource;

    public Member login(Member m) throws Exception {
        String sql = "select * from member where email=? and pwd=?";
        try (Connection con = dataSource.getConnection();
             PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, m.getEmail());
            stmt.setString(2, m.getPwd());
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String nickname = rs.getString("nickname");
                    m.setNickname(nickname);
                    return m;
                } else {
                    return null;
                }
            }
        }
    }
    public int countByNickname(String nickname) throws Exception {
        String sql = "SELECT COUNT(*) FROM member WHERE nickname = ?";
        try (Connection con = dataSource.getConnection();
             PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, nickname);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                } else {
                    return 0;
                }
            }
        }
    }
    public int countByEmail(String email) throws Exception {
        String sql = "SELECT COUNT(*) FROM member WHERE email = ?";
        try (Connection con = dataSource.getConnection();
             PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                } else {
                    return 0;
                }
            }
        }
    }

    public void insertMember(Member m) throws Exception {
        String sql = "insert into member(email, pwd, nickname) values(?,?,?)";
        try (Connection con = dataSource.getConnection();
             PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, m.getEmail());
            stmt.setString(2, m.getPwd());
            stmt.setString(3, m.getNickname());
            int i = stmt.executeUpdate();
            System.out.println(i + "행이 insert되었습니다");
        }
    }
    // 나머지 메서드도 같은 방식으로 수정
}