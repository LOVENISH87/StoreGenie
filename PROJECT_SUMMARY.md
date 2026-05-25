# StoreGenie - Project Summary

## Overview

**StoreGenie** is a Next.js application enabling small shop owners to create online storefronts with drag-and-drop product management.

---

## Problem

- No technical knowledge for building websites
- Overwhelmed by manual product entry
- Complex existing tools

---

## Solution

- Simple input forms
- **Drag-and-drop** product management
- 4 pre-designed themes
- Storefront in minutes

---

## Architecture

```
[User Input] → [Next.js API] → [MongoDB] → [React Templates] → [Live Store]
```

### Tech Stack
- **Frontend:** Next.js 15 + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **DnD:** @dnd-kit/core, @dnd-kit/sortable

---

## Database

### Shops
| Field | Type |
|-------|------|
| name | string |
| description | string |
| phone | string |
| address | string |
| theme | string |

### Products
| Field | Type |
|-------|------|
| shopId | string |
| name | string |
| price | string |
| image | string |
| order | number |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shop/create` | Create shop |
| GET | `/api/shop/:id` | Get shop |
| POST | `/api/products` | Add product |
| GET | `/api/products?shopId=` | Get products |
| DELETE | `/api/products/:id` | Delete product |
| PUT | `/api/products/reorder` | Reorder |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Create shop form |
| `/dashboard/:id` | Manage products (drag-drop) |
| `/store/:id` | Public storefront |

---

## Themes

1. **Minimal** - Clean, white space
2. **Bold** - Large images, gradients
3. **Classic** - Traditional, amber tones
4. **Modern** - Cards, violet gradients

---

## Summary

> StoreGenie is a Next.js app with drag-and-drop interface for creating online storefronts without technical skills.
