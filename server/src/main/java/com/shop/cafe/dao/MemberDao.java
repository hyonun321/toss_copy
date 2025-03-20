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
    public void updatePassword(Member m) throws Exception {
        String sql = "UPDATE member SET pwd = ? WHERE email = ?";
        try (Connection con = dataSource.getConnection();
             PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, m.getPwd());
            stmt.setString(2, m.getEmail());
            int i = stmt.executeUpdate();
            if (i == 0) {
                throw new Exception("존재하지 않는 사용자입니다.");
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
    
    public void updateMember(Member m) throws Exception {
        String sql = "UPDATE member SET nickname = ? WHERE email = ?";
        try (Connection con = dataSource.getConnection();
             PreparedStatement stmt = con.prepareStatement(sql)) {
            stmt.setString(1, m.getNickname());
            stmt.setString(2, m.getEmail());
            int i = stmt.executeUpdate();
            if (i == 0) {
                throw new Exception("존재하지 않는 사용자입니다.");
            }
            System.out.println(i + "행이 update되었습니다");
        }
    }
}