package com.shop.cafe.dao;

import com.shop.cafe.dto.LoginAttempt;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginAttemptDao {
    LoginAttempt getLoginAttempt(String email) throws Exception;
    void insertLoginAttempt(LoginAttempt attempt) throws Exception;
    void updateLoginAttempt(LoginAttempt attempt) throws Exception;
    void resetLoginAttempt(String email) throws Exception;
} 