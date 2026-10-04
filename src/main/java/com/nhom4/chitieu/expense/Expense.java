package com.nhom4.chitieu.expense;

import java.time.LocalDate;

public record Expense(int id, LocalDate date, long amount, int categoryId, String note) {
}