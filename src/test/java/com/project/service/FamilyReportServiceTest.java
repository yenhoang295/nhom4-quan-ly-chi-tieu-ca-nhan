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
        
        // Cập nhật cấu trúc bản ghi khớp hoàn toàn với DB thực tế (Sử dụng spent_on thay vì created_at)
        Map<String, Object> exp1 = new HashMap<>();
        exp1.put("user_name", "Con A"); 
        exp1.put("amount", 500000);
        exp1.put("spent_on", "2026-10-05");
        
        Map<String, Object> exp2 = new HashMap<>();
        exp2.put("user_name", "Con A"); 
        exp2.put("amount", 300000);
        exp2.put("spent_on", "2026-10-12");
        
        Map<String, Object> exp3 = new HashMap<>();
        exp3.put("user_name", "Con B"); 
        exp3.put("amount", 1200000);
        exp3.put("spent_on", "2026-10-20");

        mockExpenses = Arrays.asList(exp1, exp2, exp3);
    }

    @Test
    public void testCalculateTotalFamilyExpense() {
        long total = reportService.calculateTotalExpense(mockExpenses);
        assertEquals(2000000L, total); 
    }

    @Test
    public void testFindTopSpender() {
        String topSpender = reportService.findTopSpender(mockExpenses);
        assertEquals("Con B", topSpender); 
    }

    @Test
    public void testCalculateTotalExpenseWithNullInput() {
        long total = reportService.calculateTotalExpense(null);
        assertEquals(0L, total);
    }

    @Test
    public void testCalculateTotalExpenseWithEmptyList() {
        long total = reportService.calculateTotalExpense(Collections.emptyList());
        assertEquals(0L, total);
    }

    @Test
    public void testFindTopSpenderWithNullInput() {
        assertNull(reportService.findTopSpender(null));
    }
}
