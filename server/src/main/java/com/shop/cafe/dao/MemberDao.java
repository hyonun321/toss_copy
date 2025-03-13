package com.shop.cafe.dao;

import javax.annotation.PostConstruct;
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
    
    @Value("${spring.datasource.driver-class-name}")
    private String DB_DRIVER;
    
    @Value("${spring.datasource.url}")
    private String DB_URL;
    
    @Value("${spring.datasource.username}")
    private String DB_USER;
    
    @Value("${spring.datasource.password}")
    private String DB_PW;
    
    public MemberDao() {
    }
    
    @PostConstruct
    public void init() throws ClassNotFoundException {
        Class.forName(DB_DRIVER);
    }
    
    public Member login(Member m) throws Exception {
        String sql = "select * from member where email=? and pwd=? ";
        System.out.println(sql);

		Class.forName(DB_DRIVER);
        Connection con = DriverManager.getConnection(DB_URL, DB_USER, DB_PW);
    		
        PreparedStatement stmt = con.prepareStatement(sql);
    		
    	stmt.setString(1,m.getEmail());
		stmt.setString(2,m.getPwd());
        ResultSet rs = stmt.executeQuery();
     
        if(rs.next()) { // 로그인 성공 시
            String nickname = rs.getString("nickname");
            m.setNickname(nickname);
            return m;
        } else {
            return null;
        }
        
    }
    public void insertMember(Member m) throws Exception {
        // 테이블의 컬럼 순서가 email, pwd, nickname이라면 이렇게 수정합니다.
        String sql = "insert into member(email, pwd, nickname) values(?,?,?)";
        try (
            Connection con = DriverManager.getConnection(DB_URL, DB_USER, DB_PW);
            PreparedStatement stmt = con.prepareStatement(sql);
        ) {
            stmt.setString(1, m.getEmail());
            stmt.setString(2, m.getPwd());
            stmt.setString(3, m.getNickname());
            int i = stmt.executeUpdate();
            System.out.println(i + "행이 insert되었습니다");
        }
    }

}
