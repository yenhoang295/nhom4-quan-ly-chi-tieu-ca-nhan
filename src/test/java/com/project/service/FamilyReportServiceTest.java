package com.project.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class FamilyReportServiceTest {
    private FamilyReportService reportService;
    private List<Map<String, Object>> mockExpenses;

    @BeforeEach
    public void setUp() {
        reportService = new FamilyReportService();
        
        // Giả lập cấu trúc dữ liệu Map tương tự như cấu trúc JSON trả về từ DB
        Map<String, Object> exp1 = new HashMap<>();
        exp1.put("user_name", "Con A"); exp1.put("amount", 500000);
        
        Map<String, Object> exp2 = new HashMap<>();
        exp2.put("user_name", "Con A"); exp2.put("amount", 300000);
        
        Map<String, Object> exp3 = new HashMap<>();
        exp3.put("user_name", "Con B"); exp3.put("amount", 1200000);

        mockExpenses = Arrays.asList(exp1, exp2, exp3);
    }

    @Test
    public void testCalculateTotalFamilyExpense() {
        long total = reportService.calculateTotalExpense(mockExpenses);
        // Tổng chi tiêu kỳ vọng: 500k + 300k + 1200k = 2000k
        assertEquals(2000000L, total); 
    }

    @Test
    public void testFindTopSpender() {
        String topSpender = reportService.findTopSpender(mockExpenses);
        // Con B tiêu 1200k (nhiều nhất nhà)
        assertEquals("Con B", topSpender); 
    }

    @Test
    public void testFindTopSpenderWithEmptyList() {
        assertNull(reportService.findTopSpender(Collections.emptyList()));
    }
}
