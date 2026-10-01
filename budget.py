class BudgetManager:
    def __init__(self):
        self.categories = []
        self.monthly_budget = 0  # Bổ sung biến lưu ngân sách

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
        total_expense = 0
        for exp in expenses_list:
            total_expense += exp.get("amount", 0)

        if total_expense > self.monthly_budget:
            return True
        return False

