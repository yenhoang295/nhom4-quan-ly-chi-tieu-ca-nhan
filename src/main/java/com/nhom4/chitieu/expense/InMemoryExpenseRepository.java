package com.nhom4.chitieu.expense;

import java.util.ArrayList;
import java.util.List;

public class InMemoryExpenseRepository implements ExpenseRepository {
    private final List<Expense> data = new ArrayList<>();
    private int nextId = 1;

    @Override
    public Expense save(Expense expense) {
        Expense saved = new Expense(nextId++, expense.date(), expense.amount(),
                expense.categoryId(), expense.note());
        data.add(saved);
        return saved;
    }

    @Override
    public List<Expense> findAll() {
        return List.copyOf(data);
    }
}