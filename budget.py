class BudgetManager:
    """Quản lý danh mục và ngân sách chi tiêu đạt chuẩn TDD."""

    def __init__(self):
        self.categories = []
        self.monthly_budget = 0

    def add_category(self, category_name):
        if not category_name or category_name in self.categories:
            return False
        self.categories.append(category_name)
        return True

    def get_categories(self):
        return self.categories

    def get_total_by_category(self, category_name, expenses_list):
        return sum(exp.get("amount", 0) for exp in expenses_list if exp.get("category") == category_name)

    def set_budget(self, amount):
        if amount < 0:
            return False
        self.monthly_budget = amount
        return True

    def get_budget(self):
        return self.monthly_budget

    def is_budget_exceeded(self, expenses_list):
        total_expense = sum(exp.get("amount", 0) for exp in expenses_list)
        return total_expense > self.monthly_budget

    def get_monthly_statistics(self, year_month, expenses_list):
        if not year_month or not expenses_list:
            return 0
        return sum(exp.get("amount", 0) for exp in expenses_list if str(exp.get("date", "")).startswith(year_month))

    def get_top_spending_category(self, expenses_list):
        if not expenses_list:
            return None

        totals = {}
        for exp in expenses_list:
            cat = exp.get("category")
            if cat:
                totals[cat] = totals.get(cat, 0) + exp.get("amount", 0)

        return max(totals, key=totals.get) if totals else None

    def compare_months(self, month1, month2, expenses_list):
        return self.get_monthly_statistics(month1, expenses_list) - self.get_monthly_statistics(month2, expenses_list)



