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
