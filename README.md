# SocietyHub Admin UI

React + Vite + Tailwind v4 admin panel for the **Society-Management-Api** backend.

## Run
```
npm install
# edit .env  ->  VITE_API_URL=http://localhost:5000/api   (your backend URL, ending in /api)
npm run dev
```
Open http://localhost:5173

## Screens
- Login, Forgot password -> Verify OTP -> New password
- Dashboard (stats + recent admins)
- Admins: search, add, edit, deactivate, delete

## Change the look
Everything is in `src/index.css` (`@theme` block). `indigo-*` = brand color (orange), `slate-*` = neutrals.

## Backend setup notes (required)
1. `.env` of the API needs: `PORT`, `MONGODBURI`, `JWT_SECRET_KEY`, **`JWT_REFRESH_SECRET_KEY`**, `EMAIL_USER`, `EMAIL_USER_PASS`,
   and **`LOCAL_ORIGIN=http://localhost:5173`** (CORS). `JWT_REFRESH_SECRET_KEY` and the origins are missing from `.env.example`.
2. `src/server.js` has `app.listen(...)` commented out. To run locally, uncomment it (or add an `index.js` that calls `app.listen`).
3. The refresh-token cookie is `secure + sameSite:none`. It works on `http://localhost` in Chrome/Edge; on a deployed site use HTTPS for both apps.
