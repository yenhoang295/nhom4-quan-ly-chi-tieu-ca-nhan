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
