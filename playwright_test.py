import asyncio
from playwright.async_api import async_playwright
import os
import sys

async def test_healthy_eating_app():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Set viewport size for desktop testing
        await page.set_viewport_size({"width": 1920, "height": 1080})
        
        # Test results
        test_results = {
            "navigation": {"passed": False, "details": ""},
            "visual_design": {"passed": False, "details": ""},
            "recipe_suggester": {"passed": False, "details": ""},
            "macro_planner": {"passed": False, "details": ""},
            "responsive_design": {"passed": False, "details": ""},
            "media_section": {"passed": False, "details": ""}
        }
        
        try:
            # Test Main Page
            print("Testing Main Page...")
            await page.goto("http://localhost:3001")
            
            # Check if the page loaded
            title = await page.title()
            print(f"Page title: {title}")
            
            # Take a screenshot
            await page.screenshot(path="main_page.png")
            
            # Check for navigation links
            nav_links = await page.query_selector_all("nav a")
            if len(nav_links) > 0:
                print(f"Found {len(nav_links)} navigation links")
                test_results["navigation"]["passed"] = True
                test_results["navigation"]["details"] = f"Found {len(nav_links)} navigation links"
            else:
                print("Navigation menu not found")
                test_results["navigation"]["details"] = "Navigation menu not found"
            
            # Check for green theme
            green_elements = await page.query_selector_all("[class*='green'], [class*='primary']")
            if len(green_elements) > 0:
                print(f"Found {len(green_elements)} green-themed elements")
                test_results["visual_design"]["passed"] = True
                test_results["visual_design"]["details"] = f"Found {len(green_elements)} green-themed elements"
            else:
                print("Green theme not detected")
                test_results["visual_design"]["details"] = "Green theme not detected"
            
            # Test Recipe Suggester Page
            print("\nTesting Recipe Suggester Page...")
            recipe_link = await page.query_selector("a[href='/recipesuggester']")
            if recipe_link:
                await recipe_link.click()
                await page.wait_for_load_state("networkidle")
                
                # Take a screenshot
                await page.screenshot(path="recipe_suggester.png")
                
                # Check for ingredient input fields
                ingredient_fields = await page.query_selector_all("input[type='text']")
                if len(ingredient_fields) >= 5:
                    print(f"Found {len(ingredient_fields)} ingredient input fields")
                    test_results["recipe_suggester"]["passed"] = True
                    test_results["recipe_suggester"]["details"] = f"Found {len(ingredient_fields)} ingredient input fields"
                else:
                    print(f"Expected at least 5 ingredient fields, found {len(ingredient_fields)}")
                    test_results["recipe_suggester"]["details"] = f"Expected at least 5 ingredient fields, found {len(ingredient_fields)}"
                
                # Check for photo detection feature
                photo_button = await page.query_selector("button:has-text('Detect')")
                if photo_button:
                    print("Photo detection feature found")
                else:
                    print("Photo detection feature not found")
                    test_results["recipe_suggester"]["details"] += ". Photo detection feature not found"
            else:
                print("Recipe Suggester link not found")
                test_results["recipe_suggester"]["details"] = "Recipe Suggester link not found"
            
            # Test Macro Planner Page
            print("\nTesting Macro Planner Page...")
            await page.goto("http://localhost:3001/mealbymacros")
            await page.wait_for_load_state("networkidle")
            
            # Take a screenshot
            await page.screenshot(path="macro_planner.png")
            
            # Check for macro input fields
            macro_fields = await page.query_selector_all("input[type='number']")
            if len(macro_fields) >= 3:  # Protein, Carbs, Fat
                print(f"Found {len(macro_fields)} macro input fields")
                test_results["macro_planner"]["passed"] = True
                test_results["macro_planner"]["details"] = f"Found {len(macro_fields)} macro input fields"
            else:
                print(f"Expected at least 3 macro fields, found {len(macro_fields)}")
                test_results["macro_planner"]["details"] = f"Expected at least 3 macro fields, found {len(macro_fields)}"
            
            # Test Responsive Design
            print("\nTesting Responsive Design...")
            # Test tablet size
            await page.set_viewport_size({"width": 768, "height": 1024})
            await page.goto("http://localhost:3001")
            await page.wait_for_load_state("networkidle")
            await page.screenshot(path="tablet_view.png")
            
            # Test mobile size
            await page.set_viewport_size({"width": 390, "height": 844})
            await page.goto("http://localhost:3001")
            await page.wait_for_load_state("networkidle")
            await page.screenshot(path="mobile_view.png")
            
            # Check if the layout adapts
            hamburger_menu = await page.query_selector("[class*='hamburger'], [class*='menu-icon']")
            if hamburger_menu:
                print("Responsive design detected (hamburger menu found)")
                test_results["responsive_design"]["passed"] = True
                test_results["responsive_design"]["details"] = "Responsive design detected (hamburger menu found)"
            else:
                print("Hamburger menu not found, responsive design might be missing")
                test_results["responsive_design"]["details"] = "Hamburger menu not found, responsive design might be missing"
            
            # Test Media Section
            print("\nTesting Media Section...")
            await page.goto("http://localhost:3001")
            await page.wait_for_load_state("networkidle")
            
            media_section = await page.query_selector("[id*='media'], [class*='media']")
            if media_section:
                print("Media section found")
                test_results["media_section"]["passed"] = True
                test_results["media_section"]["details"] = "Media section found"
            else:
                print("Media section not found")
                test_results["media_section"]["details"] = "Media section not found"
            
        except Exception as e:
            print(f"Error during testing: {str(e)}")
        
        # Print test summary
        print("\n=== TEST SUMMARY ===")
        for test_name, result in test_results.items():
            status = "✅ PASSED" if result["passed"] else "❌ FAILED"
            print(f"{test_name}: {status}")
            print(f"  Details: {result['details']}")
        
        # Close the browser
        await browser.close()
        
        # Return overall result
        return all(result["passed"] for result in test_results.values())

if __name__ == "__main__":
    success = asyncio.run(test_healthy_eating_app())
    sys.exit(0 if success else 1)