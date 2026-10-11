package com.nhom4.chitieu.expense;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ExpenseServiceTest {

    private static final LocalDate NGAY = LocalDate.of(2026, 10, 1);
    private ExpenseService service;

    @BeforeEach
    void setUp() {
        service = new ExpenseService(new InMemoryExpenseRepository());
    }

    @Test
    @DisplayName("Thêm khoản chi hợp lệ thì được lưu và có mã")
    void themKhoanChi_hopLe_duocLuu() {
        Expense e = service.add(NGAY, 50_000, 1, "Ăn trưa");

        assertEquals(1, e.id());
        assertEquals(50_000, e.amount());
        assertEquals("Ăn trưa", e.note());
    }

    @Test
    @DisplayName("Tổng chi bằng 0 khi chưa có khoản chi nào")
    void tong_chuaCoKhoanChi_bangKhong() {
        assertEquals(0, service.total());
    }

    @Test
    @DisplayName("Tổng chi bằng tổng các khoản đã thêm")
    void tong_nhieuKhoanChi_congDon() {
        service.add(NGAY, 50_000, 1, "Ăn trưa");
        service.add(NGAY, 30_000, 2, "Xe buýt");

        assertEquals(80_000, service.total());
    }

    @Test
    @DisplayName("Xóa khoản chi đang có thì tổng chi giảm đúng bằng số tiền khoản đó")
    void xoaKhoanChi_dangCo_tongGiam() {
        Expense a = service.add(NGAY, 50_000, 1, "Ăn trưa");
        service.add(NGAY, 30_000, 2, "Xe buýt");

        service.delete(a.id());

        assertEquals(30_000, service.total());
    }

    @Test
    @DisplayName("Xóa mã không tồn tại thì báo lỗi")
    void xoaKhoanChi_khongTonTai_nemLoi() {
        assertThrows(NoSuchElementException.class, () -> service.delete(999));
    }
}