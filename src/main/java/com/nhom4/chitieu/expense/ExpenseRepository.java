package com.nhom4.chitieu.expense;

import java.util.List;

public interface ExpenseRepository {
    Expense save(Expense expense);

    List<Expense> findAll();
}