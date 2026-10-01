class BudgetManager:
    def __init__(self):
        self.categories = []

    def add_category(self, category_name):
        if not category_name or category_name in self.categories:
            return False
        self.categories.append(category_name)
        return True

    def get_categories(self):
       return self.categories
            def get_total_by_category(self, category_name, expenses_list):
        total = 0
        for exp in expenses_list:
            if exp.get("category") == category_name:
                total += exp.get("amount", 0)
        return total

