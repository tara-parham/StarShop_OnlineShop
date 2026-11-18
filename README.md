# StarShop

A React + TypeScript storefront with a separate Node.js + TypeScript API and SQLite database.

## Run locally

Use Node.js 20.19+ (Node.js 22 LTS is also supported) and npm.

```sh
npm install
npm --prefix backend install
```

Start these in two terminals from the project root:

```sh
npm run dev:backend
```

```sh
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173). Vite proxies `/api` and `/uploads` to the backend on port 3001. Both servers must be running. The first API startup creates `backend/data/star-shop.sqlite` and seeds twelve demonstration products. Seeding is tracked as a migration, so deleting products does not cause them to reappear on restart.

## Create an administrator

There are no default admin credentials. From `backend/`, run:

```sh
read -r -p 'Admin email: ' ADMIN_EMAIL
read -r -s -p 'Admin password (12+ characters): ' ADMIN_PASSWORD
export ADMIN_EMAIL ADMIN_PASSWORD
npm run admin:create
unset ADMIN_EMAIL ADMIN_PASSWORD
```

These commands use Bash. Alternatively set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optional `ADMIN_NAME` in your shell or `backend/.env`, then run `npm --prefix backend run admin:create`. Keep credentials out of version control and remove them from `.env` after creating the account. The admin command never replaces an existing account.

Sign in at `/login` with that account and open `/admin` (also available through the navbar's Admin link). Public sign-ups always create customer accounts.

The admin can:

- Create, edit, and delete products, including prices, categories, descriptions, and stock availability.
- Upload JPEG, PNG, or WebP images up to 5 MB, or provide an HTTPS image URL. The API checks the file signature and generates filenames.
- Change the store name, home page title, description, announcement, and contact email.

The storefront reads its catalog and settings from the API. Catalog requests are cached and refreshed after admin changes and when the browser regains focus. Dark mode follows the operating system until a visitor chooses a theme using the navbar toggle; the choice is saved locally.

## Configuration and storage

Copy `backend/.env.example` to `backend/.env` if needed. Defaults work without an env file.

| Variable        | Default                   | Purpose                                                    |
| --------------- | ------------------------- | ---------------------------------------------------------- |
| `PORT`          | `3001`                    | API port; update the Vite proxy if changed                 |
| `DATABASE_PATH` | `./data/star-shop.sqlite` | SQLite file, relative to the backend working directory     |
| `UPLOAD_DIR`    | `./uploads`               | Uploaded images, relative to the backend working directory |
| `COOKIE_SECURE` | `false`                   | Set to `true` when serving through HTTPS                   |

Back up both the database and upload directory. Neither is committed. The sample catalog reuses the four existing local product photos; replace demonstration products and photography with your own before launch. Sample products have no fabricated review ratings.

## Architecture

```text
backend/src/
  domain/           Product, account, settings models and repository contract
  application/      Catalog/settings use cases and authentication service
  infrastructure/   SQLite repository, schema migration and initial seed data
  http/             Express routes, validation, access control, uploads and errors
  config.ts         Environment configuration
  server.ts         Dependency composition and server lifecycle
  create-admin.ts   Explicit admin provisioning command
src/
  components/admin/ Reusable product and settings forms
  context/          Catalog cache, server session, theme and cart state
  lib/api.ts        Shared HTTP client and error handling
```

Application services depend on the repository interface; the HTTP layer composes them with the SQLite implementation. Inputs are validated at the HTTP boundary; database queries use bound parameters. Passwords are salted and hashed with scrypt. Sessions are stored in SQLite using hashed random tokens; the browser receives an HttpOnly, SameSite cookie. Admin authorization is checked for every write or upload. Authentication endpoints are rate limited. Writes require a custom verification header and cross-site fetches are rejected; the deployment uses one origin and does not enable CORS.

## Checks

```sh
npm run build
npm run build:backend
npm run lint
npm run test:backend
```

The backend integration test uses a temporary SQLite database and HTTP server. It covers seeding, login and session revocation, customer/admin permissions, product validation and CRUD, settings, invalid and valid uploads, persistence, and an empty catalog remaining empty after restart.

## Deployment and remaining work

Build the frontend and backend separately. Serve `dist/` with a static web server, including SPA history fallback to `index.html`. Reverse-proxy `/api` and `/uploads` on that same origin to the API, which listens on `127.0.0.1:3001`. Run `npm --prefix backend start`, enable HTTPS, and set `COOKIE_SECURE=true`. The frontend image directory is part of the Vite build. `vite preview` alone does not run the API or provide the development proxy.

Checkout is still a local demonstration: it does not persist orders, take payment, or reserve inventory. Suggested next work is an order service with server-calculated totals, inventory quantities, payment integration, and admin order management. Password reset, email verification, image cleanup, and audit history are also useful before a public launch.
