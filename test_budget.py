import pytest
from budget import BudgetManager

def test_add_category_success():
    manager = BudgetManager()
    assert manager.add_category("Ăn uống") is True
    assert "Ăn uống" in manager.get_categories()

def test_add_duplicate_category():
    manager = BudgetManager()
    manager.add_category("Mua sắm")
    assert manager.add_category("Mua sắm") is False
    def test_calculate_total_by_category():
    manager = BudgetManager()
    # Giả lập dữ liệu danh sách chi tiêu để tính tổng
    mock_expenses = [
        {"amount": 50000, "category": "Ăn uống"},
        {"amount": 30000, "category": "Ăn uống"},
        {"amount": 100000, "category": "Di chuyển"}
    ]
    assert manager.get_total_by_category("Ăn uống", mock_expenses) == 80000
    assert manager.get_total_by_category("Mua sắm", mock_expenses) == 0
def test_set_monthly_budget_valid():
    manager = BudgetManager()
    assert manager.set_budget(5000000) is True
    assert manager.get_budget() == 5000000

def test_set_monthly_budget_invalid():
    manager = BudgetManager()
    assert manager.set_budget(-1000) is False  # Ngân sách không được âm
def test_is_budget_exceeded_true():
    manager = BudgetManager()
    manager.set_budget(100000)  # Ngân sách 100k
    # Tổng chi tiêu là 120k -> Vượt ngân sách
    mock_expenses = [{"amount": 70000}, {"amount": 50000}]
    assert manager.is_budget_exceeded(mock_expenses) is True

def test_is_budget_exceeded_false():
    manager = BudgetManager()
    manager.set_budget(100000)  # Ngân sách 100k
    # Tổng chi tiêu là 80k -> Chưa vượt ngân sách
    mock_expenses = [{"amount": 50000}, {"amount": 30000}]
    assert manager.is_budget_exceeded(mock_expenses) is False

