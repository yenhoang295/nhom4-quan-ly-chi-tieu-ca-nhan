package com.nhom4.chitieu.expense;

import java.time.LocalDate;
import java.util.NoSuchElementException;

public class ExpenseService {
    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public Expense add(LocalDate date, long amount, int categoryId, String note) {
        return repository.save(new Expense(0, date, amount, categoryId, note));
    }

    public long total() {
        return repository.findAll().stream().mapToLong(Expense::amount).sum();
    }

    public void delete(int id) {
        if (!repository.deleteById(id)) {
            throw new NoSuchElementException("Không tìm thấy khoản chi có mã " + id);
        }
    }
}