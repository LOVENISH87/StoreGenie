# StoreGenie

A Next.js-based storefront generator that helps small shop owners create online stores with drag-and-drop simplicity.

## Features

- Create shop profile in seconds
- Drag-and-drop product management
- 4 built-in themes (Minimal, Bold, Classic, Modern)
- Auto-generated storefront pages
- Public shareable links

## Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **Drag & Drop:** @dnd-kit

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up MongoDB (update `.env.local`):
   ```
   MONGODB_URI=mongodb://localhost:27017/storegenie
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Project Structure

```
app/
  api/
    shop/         # Shop CRUD endpoints
    products/     # Product CRUD endpoints
  dashboard/[id]/ # Shop management (drag-drop)
  store/[id]/     # Public storefront
  page.tsx        # Home - create shop form
```

## Themes

| Theme   | Description           |
|---------|-----------------------|
| Minimal | Clean, whitespace     |
| Bold    | Large images, vibrant |
| Classic | Traditional layout    |
| Modern  | Card-based, gradients |
# StoreGenie
