package com.shop.cafe.dto;

import java.util.Date;

public class LoginAttempt {
    private String email;
    private int failCount;
    private Date lastFailedAttempt;
    private boolean isLocked;

    public LoginAttempt() {
    }

    public LoginAttempt(String email, int failCount, Date lastFailedAttempt, boolean isLocked) {
        this.email = email;
        this.failCount = failCount;
        this.lastFailedAttempt = lastFailedAttempt;
        this.isLocked = isLocked;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getFailCount() {
        return failCount;
    }

    public void setFailCount(int failCount) {
        this.failCount = failCount;
    }

    public Date getLastFailedAttempt() {
        return lastFailedAttempt;
    }

    public void setLastFailedAttempt(Date lastFailedAttempt) {
        this.lastFailedAttempt = lastFailedAttempt;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }
} 