# Liqaa Cloudflare Pages + D1 authentication

This version moves account authentication to Cloudflare Pages Functions and D1. Browser localStorage is used only for non-secret UI display state after `/api/auth/me`; it is not an account database and contains no auth token or password. The session identifier is only in a secure HttpOnly cookie.

## 1. Create and initialize D1

From this project directory, after installing/authenticating Wrangler:

```bash
npx wrangler d1 create liqaa
```

Copy the returned `database_id` into `wrangler.toml` in place of `REPLACE_WITH_YOUR_CLOUDFLARE_D1_DATABASE_ID`.

Apply the schema to the real database:

```bash
npx wrangler d1 execute liqaa --remote --file=./schema.sql
```

## 2. Deploy to Cloudflare Pages

Create a Pages project connected to this Git repository. The project root is `./`; no build command is needed for this static site. In the Pages project **Settings → Bindings**, add a D1 binding named exactly:

```text
DB
```

and select the `liqaa` D1 database.

## 3. Configure Google OAuth on the server

Create a Google OAuth **Web application** client in Google Cloud Console. Its authorized redirect URI must be exactly:

```text
https://YOUR-PAGES-DOMAIN/api/auth/google/callback
```

In Cloudflare Pages **Settings → Environment variables**, add these as encrypted secrets for Production and Preview:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
```

`GOOGLE_REDIRECT_URI` is the exact full callback URL above. Redeploy after saving bindings/secrets.

## API routes

- `POST /api/auth/register` with `{ email, password, name? }`
- `POST /api/auth/login` with `{ email, password }`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`

## Security notes

- Passwords use Web Crypto PBKDF2-SHA-256 with a unique random salt and 310,000 iterations. Plain-text passwords are never written to D1 or localStorage.
- Each successful login has a random, server-side D1 session record. The browser receives only a `Secure; HttpOnly; SameSite=Lax` cookie.
- Google OAuth accounts are linked by provider subject. If Google returns an email already in `users`, a Google `accounts` link is added to that same user, rather than creating a duplicate user.
- Existing old localStorage accounts are never imported automatically.

## Testing checklist

Use the deployed Pages domain (not a local HTML file): register, login, `/api/auth/me`, logout, invalid credentials, duplicate email, Google login, then login from another device with the same provider/account.
