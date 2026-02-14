# Specification

## Summary
**Goal:** Add a fixed set of predefined product categories and make category selection required when vendors add products, while updating buyer-facing category display accordingly.

**Planned changes:**
- Define a single canonical allowed category list: Fruits, Vegetables, Spices, Groceries, Snacks, Beverages, Household/Toiletries (English labels; ensure “Beverages” spelling).
- Backend: extend the Product model to include a category field; require add-product to accept and persist category; return category in getProduct/getAllProducts; reject categories not in the allowed list.
- Frontend (vendor): update add-product form to include a required dropdown/select for Category using the predefined list; submit category with the add-product call; clear the category field after successful add; show an English validation error if missing.
- Frontend (buyer): update “Shop by Category” UI to display exactly the new category names and remove/merge any categories outside the requested set.
- Update frontend type bindings so Product includes the category field without TypeScript errors.

**User-visible outcome:** Vendors must choose a category from a predefined dropdown when adding products, and buyers see the updated fixed set of categories in the “Shop by Category” section.
