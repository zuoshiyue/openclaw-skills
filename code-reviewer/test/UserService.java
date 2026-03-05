package com.example.service;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 用户服务类 - 包含多种代码问题的示例
 */
public class UserService {
    
    // 问题 1: SimpleDateFormat 定义为 static (线程安全问题)
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    
    // 问题 2: 魔法数字
    private static final int MAX_RETRY = 3;
    private int timeout = 86400000;
    
    private UserRepository userRepository;
    private EmailService emailService;
    
    public UserService() {
        // 问题 3: 直接实例化依赖 (违反依赖倒置原则)
        this.userRepository = new MySQLUserRepository();
        this.emailService = new EmailServiceImpl();
    }
    
    // 问题 4: 函数过长、参数过多、做多件事
    public boolean registerUser(String username, String password, String email, 
                                String phone, String address, int age, 
                                String city, String country) {
        // 验证用户
        if (username != null && !username.isEmpty()) {
            if (password != null && password.length() >= 6) {
                if (email != null && email.contains("@")) {
                    // 创建用户
                    User user = new User();
                    user.setUsername(username);
                    user.setPassword(password);
                    user.setEmail(email);
                    user.setPhone(phone);
                    user.setAddress(address);
                    user.setAge(age);
                    user.setCity(city);
                    user.setCountry(country);
                    user.setCreateTime(new Date());
                    
                    // 保存用户
                    try {
                        userRepository.save(user);
                        
                        // 发送邮件
                        emailService.sendWelcomeEmail(user);
                        
                        // 记录日志
                        System.out.println("用户注册成功：" + username);
                        
                        return true;
                    } catch (Exception e) {
                        // 问题 5: 空 catch 块
                    }
                }
            }
        }
        return false;
    }
    
    // 问题 6: 命名不规范
    public List<User> getAllU() {
        return userRepository.findAll();
    }
    
    // 问题 7: 返回 null 而不是空集合
    public List<User> findUsersByCondition(String condition) {
        if (condition == null) {
            return null;
        }
        return userRepository.findByCondition(condition);
    }
    
    // 问题 8: 违反 equals/hashCode 约定
    public static class UserQuery {
        private String name;
        private int age;
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null) return false;
            UserQuery other = (UserQuery) obj;
            return age == other.age && 
                   Objects.equals(name, other.name);
        }
        // 缺少 hashCode 方法
    }
    
    // 问题 9: 过多的 switch 语句
    public String getUserTypeDescription(int type) {
        switch (type) {
            case 1:
                return "普通用户";
            case 2:
                return "VIP 用户";
            case 3:
                return "管理员";
            case 4:
                return "超级管理员";
            default:
                return "未知类型";
        }
    }
    
    // 问题 10: 临时字段
    public class Report {
        private String title;
        private String content;
        private String tempData; // 只在某些方法中使用
        
        public void generatePDF() {
            // 使用 tempData
        }
        
        public void generateExcel() {
            // 不使用 tempData
        }
    }
}
