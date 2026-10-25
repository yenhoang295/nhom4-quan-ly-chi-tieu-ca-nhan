package com.project.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class FamilyReportService {

    /**
     * Tính tổng chi tiêu của cả gia đình sử dụng Stream API
     */
    public long calculateTotalExpense(List<Map<String, Object>> expenses) {
        if (expenses == null || expenses.isEmpty()) return 0L;
        return expenses.stream()
                .filter(exp -> exp.get("amount") != null)
                .mapToLong(exp -> ((Number) exp.get("amount")).longValue())
                .sum();
    }

    /**
     * Nhóm tổng chi tiêu theo từng thành viên và tìm ra người chi nhiều nhất
     */
    public String findTopSpender(List<Map<String, Object>> expenses) {
        if (expenses == null || expenses.isEmpty()) return null;
        
        return expenses.stream()
                .filter(exp -> exp.get("user_name") != null && exp.get("amount") != null)
                .collect(Collectors.groupingBy(
                        exp -> (String) exp.get("user_name"),
                        Collectors.summingLong(exp -> ((Number) exp.get("amount")).longValue())
                ))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }
}
