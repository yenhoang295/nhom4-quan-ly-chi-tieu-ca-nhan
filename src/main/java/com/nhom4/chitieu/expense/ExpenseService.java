package com.nhom4.chitieu.expense;

import java.time.LocalDate;

public class ExpenseService {
    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public Expense add(LocalDate date, long amount, int categoryId, String note) {
        throw new UnsupportedOperationException("chưa làm");
    }

    public long total() {
        throw new UnsupportedOperationException("chưa làm");
    }
}
