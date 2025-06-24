import requests
import json
import unittest
from urllib.parse import urljoin

class HealthyEatingAppTest(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Using localhost:3000 since we're testing the frontend directly
        self.base_url = "http://localhost:3000"
        
    def test_frontend_accessibility(self):
        """Test if the frontend is accessible"""
        response = requests.get(self.base_url)
        self.assertEqual(response.status_code, 200, "Frontend should be accessible")
        self.assertIn("text/html", response.headers["Content-Type"], "Response should be HTML")
        
    def test_recipe_suggester_page(self):
        """Test if the recipe suggester page is accessible"""
        response = requests.get(urljoin(self.base_url, "/recipesuggester"))
        self.assertEqual(response.status_code, 200, "Recipe suggester page should be accessible")
        
    def test_meal_by_macros_page(self):
        """Test if the meal by macros page is accessible"""
        response = requests.get(urljoin(self.base_url, "/mealbymacros"))
        self.assertEqual(response.status_code, 200, "Meal by macros page should be accessible")

if __name__ == "__main__":
    unittest.main()