# Dummy Admin Dashboard

A modern admin dashboard built with **Next.js (App Router)**, **NextAuth**, **Zustand**, and **Material-UI (MUI)**.  
It consumes the public **DummyJSON** REST API for authentication, users, and products.

---

## 🔧 Tech Stack

- **Next.js** 14+ (App Router)
- **TypeScript**
- **NextAuth (Auth.js)** with Credentials Provider
- **Zustand** for state management
- **MUI (Material-UI)** for UI
- **DummyJSON API** as backend data source

---

## ✨ Features (Mapped to Assignment)

### 1. Authentication

- Login page built with MUI.
- Uses DummyJSON auth API: `POST https://dummyjson.com/auth/login`
- Integrated with **NextAuth Credentials Provider**.
- Access token stored in:
  - NextAuth JWT
  - Zustand auth store (for easy client access)
- Authenticated users are redirected to `/dashboard`.
- Dashboard routes are protected using `getServerSession` (unauthenticated users are redirected to `/`).

---

### 2. Users Module

- **List Users**:  
  `GET https://dummyjson.com/users?limit=10&skip=0`
- **Search Users**:  
  `GET https://dummyjson.com/users/search?q=...`

#### Users List Page

- Displays users in a responsive MUI table.
- Shows: **name, email, gender, phone, company**.
- API-side pagination using `limit` + `skip`.
- Search bar filters users via DummyJSON search API.

#### Single User Page

- `GET https://dummyjson.com/users/{id}`
- Clean, organized layout with MUI Card.
- Shows extended details:
  - Name, email, phone
  - Company info (name, title, department)
  - Address
- Includes **“Back to Users”** link.

---

### 3. Products Module

- **List Products**:  
  `GET https://dummyjson.com/products?limit=10&skip=0`
- **Search Products**:  
  `GET https://dummyjson.com/products/search?q=...`
- **Category Filter**:  
  `GET https://dummyjson.com/products/category/{category}`

#### Products List Page

- Responsive grid using MUI (`Box` with CSS grid + MUI Card).
- Shows: image, title, price, category, rating.
- Features:
  - API-side pagination (`limit` + `skip`)
  - Search bar (calls `/products/search`)
  - Category filter dropdown (calls `/products/category/...`)

#### Single Product Page

- `GET https://dummyjson.com/products/{id}`
- Product details page includes:
  - Images (simple carousel using next/prev buttons)
  - Title, price, rating, category
  - Description
- “Back to Products” link.

---

## 🧠 State Management (Zustand)

### Why Zustand?

> _Explained in code comments and here for clarity_

- Very **simple API** with almost zero boilerplate.
- **Small bundle size** compared to Redux.
- Async actions are implemented directly in the store functions.
- Perfect fit for **small–medium apps** like this dashboard where we don’t need the complexity of Redux Toolkit.

### What is stored in Zustand?

- **Auth Store**
  - `accessToken`, `refreshToken`, `isAuthenticated`
  - `setTokens` and `clear` actions.

- **Users Store**
  - `users`, `total`, `loading`, `error`
  - `fetchUsers({ q, limit, skip })` async action.
  - Simple **in-memory cache** to avoid redundant API calls.

- **Products Store**
  - `products`, `total`, `loading`, `error`
  - `fetchProducts({ q, limit, skip, category })` async action.
  - Similar in-memory caching by `[query + page + category]`.

---

## 🗃️ Caching Strategy

**Where:** `src/store/usersStore.ts` and `src/store/productsStore.ts`

- Each list store has a `cache` object:
  - Key format: `q-skip-limit-category`.
- When `fetchUsers` or `fetchProducts` is called:
  1. It first checks if that key exists in `cache`.
  2. If present, it sets the state from cache and _skips_ the API call.
  3. If not present, it calls the API and then stores the result in `cache`.

**Why caching is useful:**

- Avoid hitting the API again for the **same search query + page + category**.
- Makes the UI feel faster when:
  - User navigates back and forth between pages.
  - User re-applies the same filter/search.
- Reduces load on the public DummyJSON API.

---

## ⚙️ Project Structure (high level)

```text
src/
  app/
    layout.tsx                 # Root layout with Providers
    page.tsx                   # Login page
    api/
      auth/[...nextauth]/route.ts  # NextAuth route
    dashboard/
      layout.tsx               # Protected dashboard layout (getServerSession)
      page.tsx                 # Dashboard home
      users/
        page.tsx               # Users list
        [id]/page.tsx          # Single user details
      products/
        page.tsx               # Products list
        [id]/page.tsx          # Single product details
  components/
    Providers.tsx              # MUI + NextAuth providers (client)
  lib/
    apiClient.ts               # Fetch helper for DummyJSON
    authOptions.ts             # NextAuth config
  store/
    authStore.ts               # Auth Zustand store
    usersStore.ts              # Users Zustand store
    productsStore.ts           # Products Zustand store
